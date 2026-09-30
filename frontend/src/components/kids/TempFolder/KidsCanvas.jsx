import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eraser, Trash2 } from "lucide-react";

const COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#A855F7", "#EC4899", "#09090B"];

// Mock AI feedback - baad me Saad ke image-analysis endpoint se replace hoga
const MOCK_FEEDBACK = [
  "Wow, great colors! I can see you used a lot of imagination.",
  "Nice shapes! Looks like you're drawing something fun.",
  "I love the creativity here! Keep going.",
  "That's a cool drawing! Try adding more colors next time.",
  "Awesome work! AI can already see some great patterns here.",
];

function getMockFeedback() {
  return MOCK_FEEDBACK[Math.floor(Math.random() * MOCK_FEEDBACK.length)];
}

export default function KidsCanvas() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Redraw white background whenever canvas is (re)sized
  const paintBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Responsive canvas sizing — matches wrapper width, keeps it a square, retina-sharp
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const size = wrapper.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      paintBackground();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [paintBackground]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    paintBackground();
    setFeedback(null);
  };

  const askAI = () => {
    setIsAnalyzing(true);
    setFeedback(null);
    setTimeout(() => {
      setFeedback(getMockFeedback());
      setIsAnalyzing(false);
    }, 1400);
  };

  return (
    <div
      style={{
        width: "min(92vw, 420px)",
        maxHeight: "88vh",
        overflowY: "auto",
        margin: "0 auto",
        background: "linear-gradient(160deg, #FFF7ED 0%, #FDF2F8 100%)",
        borderRadius: 24,
        border: "3px solid #FBCFE8",
        padding: "clamp(12px, 4vw, 20px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .kc-scroll::-webkit-scrollbar { width: 4px; }
        .kc-swatch { transition: transform 0.15s; }
        .kc-swatch:active { transform: scale(0.9); }
      `}</style>

      <h2
        style={{
          textAlign: "center",
          fontSize: "clamp(16px, 4vw, 20px)",
          fontWeight: 900,
          color: "#DB2777",
          margin: "0 0 12px",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        Kids Canvas
      </h2>

      {/* Canvas wrapper — enforces square aspect ratio responsively */}
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 16,
          overflow: "hidden",
          border: "2px solid #FBCFE8",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Color palette */}
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(6px, 2vw, 10px)", marginTop: 14, flexWrap: "wrap" }}>
        {COLORS.map((c) => (
          <button
            key={c}
            className="kc-swatch"
            onClick={() => {
              setColor(c);
              setIsEraser(false);
            }}
            style={{
              width: "clamp(24px, 7vw, 30px)",
              height: "clamp(24px, 7vw, 30px)",
              borderRadius: "50%",
              border: !isEraser && color === c ? "3px solid #1F2937" : "2px solid #ffffff",
              background: c,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          />
        ))}
        <button
          className="kc-swatch"
          onClick={() => setIsEraser(true)}
          style={{
            width: "clamp(24px, 7vw, 30px)",
            height: "clamp(24px, 7vw, 30px)",
            borderRadius: "50%",
            border: isEraser ? "3px solid #1F2937" : "2px solid #E5E7EB",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Eraser size={13} color="#6B7280" />
        </button>
      </div>

      {/* Brush size */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, padding: "0 4px" }}>
        <span style={{ fontSize: 12, color: "#9D174D", fontWeight: 800, flexShrink: 0 }}>Brush</span>
        <input
          type="range"
          min={2}
          max={20}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ flex: 1, minWidth: 0, accentColor: "#EC4899" }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={clearCanvas}
          style={{
            flex: "1 1 100px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "#F3F4F6", color: "#374151", border: "none", padding: "10px 8px",
            borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Trash2 size={14} /> Clear
        </button>
        <button
          onClick={askAI}
          disabled={isAnalyzing}
          style={{
            flex: "1 1 140px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: isAnalyzing ? "#F9A8D4" : "linear-gradient(135deg, #EC4899, #DB2777)",
            backgroundImage: isAnalyzing ? "none" : "linear-gradient(135deg, #EC4899, #DB2777)",
            color: "#fff", border: "none", padding: "10px 8px", borderRadius: 12,
            fontSize: 13, fontWeight: 800, cursor: isAnalyzing ? "default" : "pointer", fontFamily: "inherit",
            boxShadow: "0 6px 16px rgba(219,39,119,0.35)",
          }}
        >
          <Sparkles size={14} /> {isAnalyzing ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {/* Feedback bubble */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 12, background: "#ffffff", border: "2px solid #FBCFE8",
              borderRadius: 14, padding: "10px 14px", fontSize: 13, lineHeight: 1.5,
              color: "#374151", fontWeight: 600,
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
