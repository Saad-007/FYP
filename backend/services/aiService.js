import fetch from 'node-fetch';
globalThis.fetch = fetch;

import 'dotenv/config'; 
import { pipeline } from '@xenova/transformers';
import { supabase } from '../config/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as googleTTS from 'google-tts-api';
import * as tf from '@tensorflow/tfjs'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import OpenAI from 'openai';
import Jimp from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Keys Setup
const cleanApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
const genAI = new GoogleGenerativeAI(cleanApiKey);

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ---------------------------------------------------------
// 1. RAG System: Search Similar Documents
// ---------------------------------------------------------
let cachedPipeline = null;

async function getPipeline() {
  if (!cachedPipeline) {
    console.log("⏳ Loading embedding model...");
    cachedPipeline = await pipeline('feature-extraction', 'Supabase/gte-small');
  }
  return cachedPipeline;
}

export const searchSimilarDocuments = async (query) => {
  const generateEmbedding = await getPipeline();
  const output = await generateEmbedding(query, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 3
  });

  if (error) throw error;

  if (!data || data.length === 0) {
    return { 
      answer: "Sorry, mujhe is course material mein is sawal ka jawab nahi mila.", 
      sources: [] 
    };
  }

  const contextText = data.map(doc => doc.content).join("\n\n");
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" }); 
  
  const prompt = `
  You are an intelligent and professional AI tutor for EduAIQuest. 
  Answer the user's question clearly and concisely, based ONLY on the provided context. 
  If the answer is not present in the context, politely state that the information is not available in the current course materials. Do not invent or hallucinate information.
  Respond strictly in professional English.

  Context:
  ${contextText}

  User Question: ${query}
  `;

  const result = await model.generateContent(prompt);
  return { answer: result.response.text(), sources: data };
};

// ---------------------------------------------------------
// 2. TensorFlow Model Loading & Drawing Evaluation
// ---------------------------------------------------------
let aiModel;
let categories = [];

async function loadTensorFlowModel() {
    try {
        const rootDir = path.join(__dirname, '..'); 
        const categoriesPath = path.join(rootDir, 'categories_list.json');
        categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

        const customLoader = {
            load: async () => {
                const modelDir = path.join(rootDir, 'tfjs_drawing_model');
                const jsonPath = path.join(modelDir, 'model.json');
                const modelJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                
                const weightSpecs = [];
                const buffers = [];
                
                for (const manifest of modelJson.weightsManifest) {
                    weightSpecs.push(...manifest.weights);
                    for (const fileName of manifest.paths) {
                        const binPath = path.join(modelDir, fileName);
                        const buf = fs.readFileSync(binPath);
                        buffers.push(new Uint8Array(buf));
                    }
                }
                
                const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
                const weightData = new Uint8Array(totalLength);
                let offset = 0;
                for (const b of buffers) {
                    weightData.set(b, offset);
                    offset += b.length;
                }
                
                return {
                    modelTopology: modelJson.modelTopology,
                    weightSpecs: weightSpecs,
                    weightData: weightData.buffer
                };
            }
        };
        
        aiModel = await tf.loadGraphModel(customLoader);
        console.log("✅ TensorFlow Drawing Model Loaded (GraphModel) via Pure JS!");
    } catch (error) {
        console.error("❌ TensorFlow Model load error:", error);
    }
}
loadTensorFlowModel();

export const evaluateDrawingImage = async (imageBase64, expectedCategory) => {
    if (!aiModel) throw new Error("AI Model is still loading.");

    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const image = await Jimp.read(imageBuffer);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            if (this.bitmap.data[idx] > 240) {
                this.bitmap.data[idx] = 255;   
                this.bitmap.data[idx+1] = 255; 
                this.bitmap.data[idx+2] = 255; 
            }
        });

        image.autocrop();
        const maxDim = Math.max(image.bitmap.width, image.bitmap.height);
        const paddedSize = Math.floor(maxDim * 1.2); 
        
        const squareImg = new Jimp(paddedSize, paddedSize, 0xFFFFFFFF);
        const xOffset = Math.floor((paddedSize - image.bitmap.width) / 2);
        const yOffset = Math.floor((paddedSize - image.bitmap.height) / 2);
        
        squareImg.composite(image, xOffset, yOffset);
        squareImg.resize(28, 28).greyscale();
        
        const values = new Float32Array(28 * 28);
        let i = 0;
        
        squareImg.scan(0, 0, 28, 28, function(x, y, idx) {
            let pixelValue = this.bitmap.data[idx];
            let inverted = 255 - pixelValue;
            values[i++] = inverted > 20 ? 1.0 : 0.0;
        });

        const tensor = tf.tensor4d(values, [1, 28, 28, 1]);
        const predictions = aiModel.predict(tensor);
        const probabilities = await predictions.data();
        const bestMatchIndex = predictions.argMax(1).dataSync()[0];

        const rawCategory = categories[bestMatchIndex];
        const predictedCategory = rawCategory.split('/').pop().replace(/_/g, ' '); 
        const confidenceScore = Math.round(probabilities[bestMatchIndex] * 100);

        tensor.dispose();
        predictions.dispose();

        console.log(`🧠 Backend CNN Guessed: ${predictedCategory} (${confidenceScore}%) | Expected: ${expectedCategory}`);

        const isCorrect = predictedCategory.toLowerCase().includes(expectedCategory.toLowerCase());

        return {
            isCorrect: isCorrect || confidenceScore > 60,
            score: confidenceScore,
            predicted: predictedCategory,
            feedback: `It looks like a ${predictedCategory} to me!`
        };
    } catch (error) {
        console.error("❌ TensorFlow Evaluation Error:", error);
        throw new Error("Drawing check fail ho gaya.");
    }
};

// ---------------------------------------------------------
// 3. Story Chat & Voice Pipeline
// ---------------------------------------------------------
export const chatWithStoryBot = async (userText, chatHistory, botName, scenario, language = 'en') => {
  try {
    const historyString = chatHistory.map(m => `${m.role === 'bot' ? botName : 'Learner'}: ${m.text}`).join('\n');

    const langInstruction = language === 'ur' 
      ? "Reply strictly in native Urdu script (اردو). Apka lehja hosla afza aur dostana hona chahiye." 
      : "Reply strictly in English.";

    const prompt = `
    You are ${botName}, a friendly and enthusiastic AI playing a chat game with a learner.
    Scenario: ${scenario}
    
    Here is the chat history so far:
    ${historyString}
    
    The learner just said: "${userText}"
    
    Reply naturally and enthusiastically to the learner. Keep your response very short (1-2 sentences). 
    Do not use JSON, just return plain conversational text.
    ${langInstruction}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    console.log(`💬 Chatting with AI (${botName}) in ${language}...`);
    const result = await model.generateContent(prompt);
    
    return result.response.text();

  } catch (error) {
    console.error("❌ Story Chat AI Error:", error);
    throw new Error("Chat generate karne mein masla aaya.");
  }
};

export const processVoiceChat = async (audioBuffer, chatHistory, botName, scenario, language = 'en') => {
  try {
    const tempFilePath = path.join(tmpdir(), `voice_${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    console.log(`🎙️ Whisper: Awaz sun raha hoon (${language})...`);
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      language: language === 'ur' ? 'ur' : 'en' 
    });
    const userText = transcription.text;
    
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath); 
    console.log(`🗣️ Learner ne kaha: "${userText}"`);

    const historyString = chatHistory.map(m => `${m.role === 'bot' ? botName : 'Learner'}: ${m.text}`).join('\n');
    const langInstruction = language === 'ur' 
      ? "Reply strictly in native Urdu script (اردو). Apka lehja hosla afza aur dostana hona chahiye." 
      : "Reply strictly in English.";

    const prompt = `
    You are ${botName}, a friendly and enthusiastic AI playing a chat game with a learner.
    Scenario: ${scenario}
    History so far:
    ${historyString}
    
    The learner just said: "${userText}"
    Reply naturally and enthusiastically in 1-2 very short sentences.
    ${langInstruction}
    `;

    console.log(`🧠 Gemini: ${botName} jawab soch raha hai...`);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const aiResult = await model.generateContent(prompt);
    const replyText = aiResult.response.text().replace(/\*/g, ''); 

    console.log(`🔊 Google TTS: Text ko awaz mein badal raha hoon (${language})...`);
    const responseAudioBase64 = await googleTTS.getAudioBase64(replyText, {
      lang: language, 
      slow: false,
      host: 'https://translate.google.com',
    });

    return { 
      replyText: replyText, 
      audioBase64: responseAudioBase64 
    };

  } catch (error) {
    console.error("❌ Whisper/Voice Pipeline Error:", error);
    throw new Error("Voice process fail ho gaya.");
  }
};