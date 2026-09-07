import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, Dog, Cat, Rabbit, Apple, Carrot, Cherry, Paintbrush, Grid3X3, Trash2, Loader2 } from 'lucide-react'

// ── Game Data with Lucide Icons ───────────────────────────────────────────
const ALL_ITEMS = [
  { id: 'cat',    icon: Cat,    type: 'pets', color: '#FEF3C7', iconColor: '#D97706' },
  { id: 'dog',    icon: Dog,    type: 'pets', color: '#D1FAE5', iconColor: '#059669' },
  { id: 'rabbit', icon: Rabbit, type: 'pets', color: '#E0E7FF', iconColor: '#4F46E5' },
  { id: 'apple',  icon: Apple,  type: 'food', color: '#FEE2E2', iconColor: '#DC2626' },
  { id: 'carrot', icon: Carrot, type: 'food', color: '#FFEDD5', iconColor: '#EA580C' },
  { id: 'cherry', icon: Cherry, type: 'food', color: '#FCE7F3', iconColor: '#DB2777' },
]

// 🌟 DYNAMIC DRAWING CATEGORIES
const DRAWING_CATEGORIES = [
  { id: 'airplane', name: 'Airplane', emoji: '✈️' },
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'bus', name: 'Bus', emoji: '🚌' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓' },
  { id: 'clock', name: 'Clock', emoji: '⏰' }
]

const PALETTE_COLORS = ['#EF4444', '#A3E635', '#0EA5E9', '#10B981', '#D946EF', '#09090B', '#ffffff']

export default function VisualTask({ zone, onComplete }) {
  // ── DUAL MODE STATE ──
  const [taskMode, setTaskMode] = useState('draw') 

  // ── SORTING STATE ──
  const [activeBin, setActiveBin] = useState('pets')
  const [unassigned, setUnassigned] = useState(ALL_ITEMS)
  const [bins, setBins] = useState({ pets: [], food: [] })
  
  // ── DRAWING STATE ──
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState('#09090B')
  const [currentDrawTask, setCurrentDrawTask] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // ── SHARED STATE ──
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [timeLeft, setTimeLeft] = useState(100)

  // ── Timer Logic ──
  useEffect(() => {
    if (success) return
    const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 0.5)), 500)
    return () => clearInterval(timer)
  }, [success])

  // ── Pick Random Drawing Task on Mount ──
  useEffect(() => {
    pickRandomTask()
  }, [])

  const pickRandomTask = () => {
    const randomTask = DRAWING_CATEGORIES[Math.floor(Math.random() * DRAWING_CATEGORIES.length)]
    setCurrentDrawTask(randomTask)
  }

  // ── SORTING LOGIC ──
  const handleItemTap = (item, source) => {
    if (success) return
    if (source === 'unassigned') {
      setUnassigned(prev => prev.filter(i => i.id !== item.id))
      setBins(prev => ({ ...prev, [activeBin]: [...prev[activeBin], item] }))
    } else {
      setBins(prev => ({ ...prev, [source]: prev[source].filter(i => i.id !== item.id) }))
      setUnassigned(prev => [...prev, item])
    }
    setErrorMsg(null)
  }

  const handleCheckSort = () => {
    if (unassigned.length > 0) {
      setErrorMsg("Hint: Sort all items first! 🌟")
      setTimeout(() => setErrorMsg(null), 2000)
      return
    }
    const isPetsCorrect = bins.pets.every(i => i.type === 'pets')
    const isFoodCorrect = bins.food.every(i => i.type === 'food')
    if (isPetsCorrect && isFoodCorrect) {
      setSuccess(true)
    } else {
      setErrorMsg("Hint: Oops! Try checking the categories again. 🧐")
      setTimeout(() => {
        setUnassigned(ALL_ITEMS)
        setBins({ pets: [], food: [] })
        setErrorMsg(null)
      }, 2000)
    }
  }

  // ── DRAWING LOGIC ──
  useEffect(() => {
    if (taskMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 6
      ctx.fillStyle = '#FAFAFA'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctxRef.current = ctx
    }
  }, [taskMode])

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.strokeStyle = penColor
  }, [penColor])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    ctxRef.current.beginPath()
    ctxRef.current.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    ctxRef.current.lineTo(x, y)
    ctxRef.current.stroke()
  }

  const stopDrawing = () => {
    ctxRef.current.closePath()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return
    ctxRef.current.fillStyle = '#FAFAFA'
    ctxRef.current.fillRect(0, 0, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
  }

  // 🚀 REAL AI CHECKING LOGIC (Connected to Gemini Backend)
  const handleCheckDraw = async () => {
    if (!canvasRef.current) return

    setIsEvaluating(true) 
    setErrorMsg(null)

    // 1. Get drawing as Image Data (base64)
    const imageData = canvasRef.current.toDataURL('image/png')
    console.log("Sending Canvas Image to Backend...");

    try {
      // ⚠️ IMPORTANT: Agar aapka Node server kisi aur port par hai (e.g., 8000), toh URL update kar lena!
      const response = await fetch('http://localhost:5000/api/evaluate-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageData,
          expectedCategory: currentDrawTask?.name || "drawing"
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // 3. AI ka faisla UI par dikhayen!
      setIsEvaluating(false)
      
      // Agar AI kehta hai true hai ya score 60 se uper hai
      if (data.isCorrect || data.score >= 60) {
        setSuccess(true)
      } else {
        // AI ka feedback bachay ko dikhayen
        setErrorMsg(`AI says: ${data.feedback} Try again! 🎨`)
      }

    } catch (error) {
      console.error(error);
      setIsEvaluating(false)
      setErrorMsg("Network error! Make sure your Node.js server is running. 🔌")
    }
  }

  // ── SHARED RESET ──
  const handleReset = () => {
    setSuccess(false)
    if (taskMode === 'sort') {
      setUnassigned(ALL_ITEMS)
      setBins({ pets: [], food: [] })
    } else {
      clearCanvas()
      pickRandomTask() 
    }
    setTimeLeft(100)
    setErrorMsg(null)
  }

  return (
    <div className="visual-task-wrapper" style={{ 
      margin: '-32px', padding: '24px 16px', borderRadius: '32px', 
      background: 'linear-gradient(180deg, #FF7B89 0%, #FFD166 18%, #FF7B89 40%, #68488E 100%)', 
      minHeight: '700px', display: 'flex', flexDirection: 'column', position: 'relative' 
    }}>
      
      <style>{`
        @media (max-width: 768px) {
          .visual-task-wrapper { margin: -16px !important; padding: 16px 12px !important; border-radius: 24px !important; min-height: auto !important; }
          .modal-card { padding: 28px 20px !important; }
          .modal-buttons { flex-direction: column !important; gap: 10px !important; }
          .ipad-frame { padding: 8px !important; border-width: 2px !important; border-radius: 20px !important; }
          .canvas-area { min-height: 240px !important; padding: 12px 8px !important; }
          .progress-stat-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .mode-toggle { flex-direction: column; gap: 8px; }
        }
        @media (max-width: 480px) {
          .visual-task-wrapper { margin: -12px !important; }
          canvas { min-height: 300px !important; }
        }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* ── SUCCESS MODAL OVERLAY ── */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
          >
            <motion.div 
              className="modal-card"
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{ background: '#ffffff', borderRadius: 32, padding: '36px 24px', width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Trophy size={64} color="#FACC15" strokeWidth={1.5} />
              </div>
              <h2 className="modal-title" style={{ fontSize: 26, fontWeight: 900, color: '#1F2937', margin: '0 0 12px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
                Great Job!
              </h2>
              <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 8px', fontWeight: 600 }}>
                {taskMode === 'sort' ? "I think you sorted: Pets & Food perfectly!" : `Your ${currentDrawTask?.name} drawing looks fantastic!`}
              </p>
              <p style={{ fontSize: 20, color: '#22C55E', margin: '0 0 28px', fontWeight: 900, textShadow: '0 2px 4px rgba(34,197,94,0.2)' }}>
                +150 XP!
              </p>
              
              <div className="modal-buttons" style={{ display: 'flex', gap: 12 }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleReset}
                  style={{ flex: 1, padding: '14px 10px', background: '#FFEDD5', color: '#C2410C', borderRadius: 16, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", width: '100%' }}
                >
                  {taskMode === 'sort' ? 'Sort Again' : 'Draw Again'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete}
                  style={{ flex: 1, padding: '14px 10px', background: 'linear-gradient(90deg, #FDA4AF, #F43F5E)', color: '#fff', borderRadius: 16, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", boxShadow: '0 4px 12px rgba(244,63,94,0.3)', width: '100%' }}
                >
                  Next Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODE TOGGLE (Sort / Draw) ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, gap: 10 }} className="mode-toggle">
        <motion.button 
          whileTap={{ scale: 0.95 }} onClick={() => setTaskMode('sort')} disabled={isEvaluating}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, border: 'none', fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', background: taskMode === 'sort' ? '#09090B' : 'rgba(255,255,255,0.5)', color: taskMode === 'sort' ? '#fff' : '#09090B', boxShadow: taskMode === 'sort' ? '0 4px 14px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.3s' }}
        >
          <Grid3X3 size={18} /> Sorting Game
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }} onClick={() => setTaskMode('draw')} disabled={isEvaluating}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, border: 'none', fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', background: taskMode === 'draw' ? '#09090B' : 'rgba(255,255,255,0.5)', color: taskMode === 'draw' ? '#fff' : '#09090B', boxShadow: taskMode === 'draw' ? '0 4px 14px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.3s' }}
        >
          <Paintbrush size={18} /> Drawing Canvas
        </motion.button>
      </div>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 className="task-title" style={{ fontSize: 22, fontWeight: 900, color: '#1A1A1A', margin: '0 0 12px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>
          {taskMode === 'sort' ? 'Teach AI Categories' : `Draw a ${currentDrawTask?.name || '...'} ${currentDrawTask?.emoji || ''}`}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FDE68A', padding: '6px 16px', borderRadius: 99, width: 'fit-content', margin: '0 auto', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#92400E' }}>Time Left</span>
          <div style={{ width: 120, height: 10, background: '#FEF3C7', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
            <motion.div animate={{ width: `${timeLeft}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: '#572C07', borderRadius: 99 }} />
          </div>
        </div>
      </div>

      {/* ── GRAY IPAD WRAPPER ── */}
      <div className="ipad-frame" style={{ background: '#D1D5DB', padding: '12px', borderRadius: 28, marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '3px solid #9CA3AF', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ── WHITE CANVAS AREA ── */}
        <div className="canvas-area" style={{ background: '#FAFAFA', borderRadius: 20, padding: '16px 12px', minHeight: 280, position: 'relative', display: 'flex', flexDirection: 'column', border: '1.5px solid #E5E7EB', flex: 1, overflow: 'hidden' }}>
          
          {taskMode === 'sort' ? (
             // Sorting UI... 
            <div style={{textAlign: 'center', marginTop: '50px', fontWeight: 900}}>SORTING GAME UI GOES HERE</div>
          ) : (
            // ================== DRAWING UI ==================
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#A1A1AA' }}>Draw below:</span>
                <button onClick={clearCanvas} disabled={isEvaluating} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: isEvaluating ? 'not-allowed' : 'pointer' }}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
              
              {/* Overlay while AI is thinking */}
              {isEvaluating && (
                <div style={{position: 'absolute', inset: 0, background: 'rgba(250,250,250,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, backdropFilter: 'blur(2px)'}}>
                  <div style={{background: '#fff', padding: '12px 24px', borderRadius: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', gap: 10, alignItems: 'center', fontWeight: 800, color: '#09090B'}}>
                    <Loader2 size={18} className="spin-animation" color="#6366F1" /> AI is looking...
                  </div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                style={{ flex: 1, width: '100%', height: '100%', background: '#FAFAFA', borderRadius: 12, border: '2px dashed #E4E4E7', touchAction: 'none', cursor: 'crosshair' }}
              />
            </div>
          )}
        </div>
        
        {/* ── Dynamic Palette ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {taskMode === 'draw' ? (
            PALETTE_COLORS.map(color => (
              <motion.div key={color} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setPenColor(color)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: color, border: penColor === color ? '3px solid #6366F1' : '2px solid #E4E4E7', cursor: 'pointer', boxShadow: penColor === color ? '0 0 10px rgba(99,102,241,0.5)' : '0 2px 4px rgba(0,0,0,0.1)' }} 
              />
            ))
          ) : (
            PALETTE_COLORS.map(color => (
              <div key={color} style={{ width: 24, height: 24, borderRadius: '50%', background: color, boxShadow: '0 2px 4px rgba(0,0,0,0.15)', opacity: 0.5 }} />
            ))
          )}
        </div>
      </div>

      <div style={{ background: '#FFFBEB', padding: '10px 16px', borderRadius: 12, textAlign: 'center', marginBottom: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: errorMsg ? '#EF4444' : '#1A1A1A', fontWeight: 800, fontSize: 13, transition: 'color 0.3s' }}>
        {errorMsg || (taskMode === 'sort' ? "Hint: Cats and Dogs belong in the PETS bin!" : `Hint: Try your best to draw the ${currentDrawTask?.name}! 🎨`)}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} 
        onClick={taskMode === 'sort' ? handleCheckSort : handleCheckDraw}
        disabled={isEvaluating}
        style={{ width: '100%', padding: '14px', background: isEvaluating ? '#9CA3AF' : 'linear-gradient(90deg, #14B8A6, #047857)', color: '#fff', border: '2px solid #064E3B', borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: isEvaluating ? 'not-allowed' : 'pointer', fontFamily: "'Syne',sans-serif", fontStyle: 'italic', boxShadow: '0 6px 20px rgba(16,185,129,0.4)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        {isEvaluating ? (
          <><Loader2 size={16} className="spin-animation" /> Checking...</>
        ) : (
          <><Sparkles size={16} /> Let AI Check My {taskMode === 'sort' ? 'Sorting' : 'Drawing'}!</>
        )}
      </motion.button>
    </div>
  )
}