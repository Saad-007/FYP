import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useTheme } from "../pages/pro/data/ThemeContext";

// Mock bot replies - baad me Saad ki real API se replace karna
const MOCK_REPLIES = [
  "Great question! Let's break that down step by step.",
  "AI literacy basically means understanding how AI tools work and their limits.",
  "Try asking me about prompt engineering or how neural networks learn!",
  "That's an interesting topic. Here's a simple way to think about it...",
  "I'm just a mock reply for now, but soon Saad's backend will power me.",
];

const SUGGESTIONS = [
  "What is prompt engineering?",
  "How do neural networks learn?",
  "Explain AI bias simply",
];

function getMockReply() {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatUI() {
  const { C, isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I'm your AI literacy assistant. Ask me anything about AI concepts, tools, or how things work under the hood.",
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const send = (text) => {
    const value = text ?? input;
    if (!value.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: value, time: timeNow() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: getMockReply(), time: timeNow() },
      ]);
      setIsTyping(false);
    }, 900 + Math.random() * 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "min(72vh, 640px)",
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.35)" : "0 8px 30px rgba(0,0,0,0.06)",
      }}
    >
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: ${C.borderL}; border-radius: 99px; }
        @media (max-width: 640px) {
          .chatui-header { padding: 12px 14px !important; }
          .chatui-body { padding: 14px 12px !important; gap: 10px !important; }
          .chatui-bubble { max-width: 86% !important; font-size: 13.5px !important; }
          .chatui-suggestions { display: none !important; }
          .chatui-footer { padding: 10px !important; }
        }
      `}</style>

      {/* Header */}
      <div
        className="chatui-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
          background: C.raised,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 4px 14px ${C.accent}40`,
          }}
        >
          <Bot size={19} color="#fff" strokeWidth={2.4} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text, letterSpacing: "-0.2px" }}>
            AIQuest Assistant
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
            Mock mode &middot; replies simulated
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="chat-scroll chatui-body"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: msg.sender === "user" ? C.accent : C.raised,
                  border: msg.sender === "user" ? "none" : `1px solid ${C.border}`,
                }}
              >
                {msg.sender === "user" ? (
                  <User size={13} color="#fff" strokeWidth={2.6} />
                ) : (
                  <Bot size={13} color={C.accent} strokeWidth={2.6} />
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: "72%" }}>
                <div
                  className="chatui-bubble"
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 14,
                    lineHeight: 1.55,
                    fontWeight: 500,
                    background: msg.sender === "user" ? C.accent : C.raised,
                    color: msg.sender === "user" ? "#fff" : C.text,
                    border: msg.sender === "user" ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  {msg.text}
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    color: C.muted,
                    fontWeight: 600,
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    padding: "0 4px",
                  }}
                >
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", background: C.raised, border: `1px solid ${C.border}`, flexShrink: 0,
              }}
            >
              <Bot size={13} color={C.accent} strokeWidth={2.6} />
            </div>
            <div style={{ background: C.raised, border: `1px solid ${C.border}`, padding: "10px 14px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: C.muted }}
                  animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggestions - only shown when conversation is fresh */}
      {messages.length === 1 && (
        <div
          className="chatui-suggestions"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 20px 14px" }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
                padding: "7px 12px", borderRadius: 99, border: `1px solid ${C.border}`,
                background: "transparent", color: C.textSub, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <Sparkles size={12} color={C.accent} /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="chatui-footer"
        style={{
          display: "flex", gap: 10, padding: "14px 16px",
          borderTop: `1px solid ${C.border}`, background: C.raised, flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about AI concepts..."
          style={{
            flex: 1, background: C.surface, color: C.text, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "11px 14px", fontSize: 13.5, outline: "none", fontFamily: "inherit",
          }}
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => send()}
          disabled={!input.trim()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 42, height: 42, borderRadius: 12, border: "none", flexShrink: 0,
            background: input.trim() ? C.accent : C.border,
            cursor: input.trim() ? "pointer" : "default", transition: "background 0.15s",
          }}
        >
          <Send size={16} color="#fff" strokeWidth={2.4} />
        </motion.button>
      </div>
    </div>
  );
}
