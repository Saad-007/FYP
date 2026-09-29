import { GoogleGenerativeAI } from "@google/generative-ai";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import * as sandboxService from "../services/sandboxService.js";
import { supabase } from "../config/supabase.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Config ──────────────────────────────────────────────────────────────
const TIMEOUT_MS = 5000; // 5s execution limit
const MAX_OUTPUT_CHARS = 20000; // guard against runaway output
const PYTHON_BIN = process.platform === "win32" ? "py" : "python3";

// ── Helpers ─────────────────────────────────────────────────────────────

// Runs a command with args, enforcing a timeout, and returns {stdout, stderr, timedOut, exitCode}
function runProcess(cmd, args, options = {}) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;

    const child = spawn(cmd, args, { cwd: options.cwd, shell: false });

    const timer = setTimeout(() => {
      timedOut = true;
      // Kill the whole process; on Windows this is enough since we didn't use shell:true
      child.kill("SIGKILL");
    }, options.timeoutMs || TIMEOUT_MS);

    child.stdout.on("data", (d) => {
      if (stdout.length < MAX_OUTPUT_CHARS) stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      if (stderr.length < MAX_OUTPUT_CHARS) stderr += d.toString();
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: `${stderr}\n${err.message}`,
        timedOut,
        exitCode: -1,
      });
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, timedOut, exitCode: code });
    });
  });
}

// Extracts the public class name from Java source so the file can be named correctly
function extractJavaClassName(code) {
  const match = code.match(/public\s+class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  return match ? match[1] : "Main";
}

async function makeTempDir() {
  const dir = path.join(os.tmpdir(), `workspace_${crypto.randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function cleanupDir(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (e) {
    console.error("Cleanup failed for", dir, e.message);
  }
}

// ── Language runners ───────────────────────────────────────────────────

async function runPython(code) {
  const dir = await makeTempDir();
  const file = path.join(dir, "main.py");
  await fs.writeFile(file, code, "utf-8");
  try {
    const result = await runProcess(PYTHON_BIN, [file], { cwd: dir });
    return result;
  } finally {
    await cleanupDir(dir);
  }
}

async function runJavaScript(code) {
  const dir = await makeTempDir();
  const file = path.join(dir, "script.js");
  await fs.writeFile(file, code, "utf-8");
  try {
    const result = await runProcess("node", [file], { cwd: dir });
    return result;
  } finally {
    await cleanupDir(dir);
  }
}

async function runJava(code) {
  const dir = await makeTempDir();
  const className = extractJavaClassName(code);
  const file = path.join(dir, `${className}.java`);
  await fs.writeFile(file, code, "utf-8");
  try {
    // Compile first
    const compile = await runProcess("javac", [file], {
      cwd: dir,
      timeoutMs: TIMEOUT_MS,
    });
    if (compile.exitCode !== 0 || compile.timedOut) {
      return {
        stdout: "",
        stderr: compile.timedOut ? "Compilation timed out" : compile.stderr,
        timedOut: compile.timedOut,
        exitCode: compile.exitCode,
      };
    }
    // Then run
    const run = await runProcess("java", ["-cp", dir, className], {
      cwd: dir,
      timeoutMs: TIMEOUT_MS,
    });
    return run;
  } finally {
    await cleanupDir(dir);
  }
}

const RUNNERS = {
  python: runPython,
  javascript: runJavaScript,
  java: runJava,
};

// ── Controllers ─────────────────────────────────────────────────────────
export const executeCode = async (req, res) => {
  console.log("FRONTEND REQ BODY:", req.body);
  const startTime = Date.now();
  try {
    // Frontend se zoneId, userId, aur xpReward ko extract karein
    const {
      code,
      language,
      sessionId,
      zoneId,
      userId,
      xpReward = 75,
    } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Code and language are required",
      });
    }

    // Python ke liye Sandbox use karein
    if (language === "python" || language === "py") {
      const result = await sandboxService.executeStudentCode(code);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        let newXP = null;
        let newLevel = null;
        let xpMessage = null;

        // Agar user logged in hai aur zoneId maujood hai, toh Supabase update karein
        if (userId && zoneId) {
          // 1. Check karein ke task pehle se completed toh nahi hai
          const { data: existingTask } = await supabase
            .from("completed_tasks")
            .select("*")
            .eq("user_id", userId)
            .eq("zone_id", zoneId)
            .maybeSingle();
          if (!existingTask) {
            // YAHAN CHANGE KIYA HAI: insertErr ko capture kiya aur zone_id ko String banaya
            const { error: insertErr } = await supabase
              .from("completed_tasks")
              .insert([
                {
                  user_id: userId,
                  zone_id: String(zoneId), // Zone ID ko Text mein convert kar diya
                  task_type: "practical", // Task type add kar diya
                },
              ]);

            // Agar koi error aaya toh terminal mein dikhayega
            if (insertErr) {
              console.error("Insert task error:", insertErr.message);
            }
            // User ki current progress fetch karein
            const { data: progress } = await supabase
              .from("pro_progress")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();
            const currentXP = progress ? progress.total_xp : 0;
            newXP = currentXP + xpReward;
            newLevel = Math.floor(newXP / 500) + 1; // Level calculation formula
            if (progress) {
              await supabase
                .from("pro_progress")
                .update({ total_xp: newXP, level: newLevel })
                .eq("user_id", userId);
            } else {
              await supabase.from("pro_progress").insert({
                user_id: userId,
                total_xp: newXP,
                level: newLevel,
                current_track: "data_scientist",
              });
            }

            xpMessage = `Awesome! You earned ${xpReward} XP.`;
          } else {
            xpMessage = `Task already completed!`;
          }
        }

        return res.status(200).json({
          success: true,
          data: {
            output: result.output.trim() || "(no output)",
            error: null,
            executionTime,
            language,
            status: "success",
            sessionId: sessionId || `session_${Date.now()}`,
            newXP,
            newLevel,
            xpMessage,
          },
        });
      } else {
        return res.status(200).json({
          success: false,
          error: result.error || "Execution failed",
          data: {
            executionTime,
            language,
            sessionId: sessionId || `session_${Date.now()}`,
          },
        });
      }
    }

    // Python ke liye Sandbox use karein
    if (language === "python" || language === "py") {
      const result = await sandboxService.executeStudentCode(code);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: {
            output: result.output.trim() || "(no output)",
            error: null,
            executionTime,
            language,
            status: "success",
            sessionId: sessionId || `session_${Date.now()}`,
          },
        });
      } else {
        return res.status(200).json({
          success: false,
          error: result.error || "Execution failed",
          data: {
            executionTime,
            language,
            sessionId: sessionId || `session_${Date.now()}`,
          },
        });
      }
    }

    // Baqi languages ke liye purana logic (Javascript/Java)
    const runner = RUNNERS[language];
    if (!runner) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const { stdout, stderr, timedOut, exitCode } = await runner(code);
    const executionTime = Date.now() - startTime;

    if (timedOut) {
      return res.status(200).json({
        success: false,
        error: `Execution timed out (${TIMEOUT_MS / 1000}s limit)`,
        data: {
          executionTime,
          language,
          sessionId: sessionId || `session_${Date.now()}`,
        },
      });
    }

    if (exitCode !== 0) {
      return res.status(200).json({
        success: false,
        error: stderr.trim() || `Process exited with code ${exitCode}`,
        data: {
          executionTime,
          language,
          sessionId: sessionId || `session_${Date.now()}`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        output: stdout.trim() || "(no output)",
        error: null,
        executionTime,
        language,
        status: "success",
        sessionId: sessionId || `session_${Date.now()}`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Code Execution Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to execute code",
      details: error.message,
    });
  }
};

export const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an expert AI programming tutor. Review this ${language} code and provide:
1. A brief assessment (2-3 sentences)
2. 2-3 specific improvements (bullet points)
3. One best practice tip
4. A difficulty rating (Beginner/Intermediate/Advanced)

Code:
\`\`\`${language}
${code}
\`\`\`

Keep your response concise and constructive.`;

    const result = await model.generateContent(prompt);
    const review = result.response.text();

    res.status(200).json({
      success: true,
      data: {
        review,
        language,
        reviewedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Code Review Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to review code",
      details: error.message,
    });
  }
};

export const getSavedSessions = async (req, res) => {
  try {
    // Still mock — wire this to a real DB (Mongo/Postgres) when you're ready to persist sessions
    const sessions = [
      {
        id: "session_1",
        name: "Python Basics Practice",
        language: "python",
        createdAt: "2024-08-20T10:30:00Z",
        lastModified: "2024-08-22T15:45:00Z",
        codeSnippet: 'print("Hello, World!")',
        status: "saved",
      },
      {
        id: "session_2",
        name: "JavaScript Functions",
        language: "javascript",
        createdAt: "2024-08-18T14:20:00Z",
        lastModified: "2024-08-21T09:15:00Z",
        codeSnippet: 'function greet() { return "Hello"; }',
        status: "saved",
      },
      {
        id: "session_3",
        name: "Data Processing",
        language: "python",
        createdAt: "2024-08-15T11:00:00Z",
        lastModified: "2024-08-15T11:00:00Z",
        codeSnippet: "import pandas as pd",
        status: "saved",
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        sessions,
        totalSessions: sessions.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sessions",
      details: error.message,
    });
  }
};
