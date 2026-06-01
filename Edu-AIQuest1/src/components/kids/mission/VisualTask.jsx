import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, Dog, Cat, Rabbit, Apple, Carrot, Cherry, Paintbrush, Grid3X3, Trash2 } from 'lucide-react'

// ── Game Data with Lucide Icons ───────────────────────────────────────────
const ALL_ITEMS = [
  { id: 'cat',    icon: Cat,    type: 'pets', color: '#FEF3C7', iconColor: '#D97706' },
  { id: 'dog',    icon: Dog,    type: 'pets', color: '#D1FAE5', iconColor: '#059669' },
  { id: 'rabbit', icon: Rabbit, type: 'pets', color: '#E0E7FF', iconColor: '#4F46E5' },
  { id: 'apple',  icon: Apple,  type: 'food', color: '#FEE2E2', iconColor: '#DC2626' },
  { id: 'carrot', icon: Carrot, type: 'food', color: '#FFEDD5', iconColor: '#EA580C' },
  { id: 'cherry', icon: Cherry, type: 'food', color: '#FCE7F3', iconColor: '#DB2777' },
]

const PALETTE_COLORS = ['#EF4444', '#A3E635', '#0EA5E9', '#10B981', '#D946EF', '#09090B', '#ffffff']

export default function VisualTask({ zone, onComplete }) {
  // ── DUAL MODE STATE ──
  const [taskMode, setTaskMode] = useState('sort') // 'sort' or 'draw'

  // ── SORTING STATE ──
  const [activeBin, setActiveBin] = useState('pets')
  const [unassigned, setUnassigned] = useState(ALL_ITEMS)
  const [bins, setBins] = useState({ pets: [], food: [] })
  
  // ── DRAWING STATE ──
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState('#09090B')

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
      // Retina display support for sharp drawing
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 6
      
      // Fill white background
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

  const handleCheckDraw = () => {
    setSuccess(true)
  }

  // ── SHARED RESET ──
  const handleReset = () => {
    setSuccess(false)
    if (taskMode === 'sort') {
      setUnassigned(ALL_ITEMS)
      setBins({ pets: [], food: [] })
    } else {
      clearCanvas()
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
      
      {/* ── 100% RESPONSIVE CSS INJECTED HERE ── */}
      <style>{`
        @media (max-width: 768px) {
          .visual-task-wrapper { margin: -16px !important; padding: 16px 12px !important; border-radius: 24px !important; min-height: auto !important; }
          .modal-card { padding: 28px 20px !important; }
          .modal-buttons { flex-direction: column !important; gap: 10px !important; }
          
          .ipad-frame { padding: 8px !important; border-width: 2px !important; border-radius: 20px !important; }
          .canvas-area { min-height: 240px !important; padding: 12px 8px !important; }
          .bins-grid { gap: 8px !important; margin-bottom: 16px !important; }
          .bin-box { min-height: 70px !important; padding: 8px !important; }
          .bin-item-icon { width: 28px !important; height: 28px !important; }
          .bin-item-icon svg { width: 16px !important; height: 16px !important; }
          
          .unassigned-pool { gap: 8px !important; }
          .item-btn { width: 44px !important; height: 44px !important; border-radius: 12px !important; }
          .item-btn svg { width: 22px !important; height: 22px !important; }
          
          .progress-stat-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .progress-bar-container { width: 100% !important; max-width: none !important; }
          .mode-toggle { flex-direction: column; gap: 8px; }
        }

        @media (max-width: 480px) {
          .visual-task-wrapper { margin: -12px !important; }
          .task-title { font-size: 18px !important; }
          .item-btn { width: 40px !important; height: 40px !important; }
          .item-btn svg { width: 20px !important; height: 20px !important; }
          .modal-title { font-size: 22px !important; }
          
          /* Canvas mobile adjustments */
          canvas { min-height: 300px !important; }
        }
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
                {taskMode === 'sort' ? "I think you sorted: Pets & Food perfectly!" : "Your AI Component drawing looks fantastic!"}
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
          whileTap={{ scale: 0.95 }} onClick={() => setTaskMode('sort')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, border: 'none', fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', background: taskMode === 'sort' ? '#09090B' : 'rgba(255,255,255,0.5)', color: taskMode === 'sort' ? '#fff' : '#09090B', boxShadow: taskMode === 'sort' ? '0 4px 14px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.3s' }}
        >
          <Grid3X3 size={18} /> Sorting Game
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }} onClick={() => setTaskMode('draw')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, border: 'none', fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', background: taskMode === 'draw' ? '#09090B' : 'rgba(255,255,255,0.5)', color: taskMode === 'draw' ? '#fff' : '#09090B', boxShadow: taskMode === 'draw' ? '0 4px 14px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.3s' }}
        >
          <Paintbrush size={18} /> Drawing Canvas
        </motion.button>
      </div>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 className="task-title" style={{ fontSize: 20, fontWeight: 900, color: '#1A1A1A', margin: '0 0 12px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>
          {taskMode === 'sort' ? 'Teach AI Categories' : 'Draw an AI Robot'}
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
            // ================== SORTING UI ==================
            <>
              <div className="bins-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {/* PETS BIN */}
                <motion.div className="bin-box" whileTap={{ scale: 0.96 }} onClick={() => setActiveBin('pets')}
                  style={{ background: activeBin === 'pets' ? '#FEF3C7' : '#ffffff', border: `2px solid ${activeBin === 'pets' ? '#F59E0B' : '#E4E4E7'}`, borderRadius: 14, padding: '10px', textAlign: 'center', cursor: 'pointer', boxShadow: activeBin === 'pets' ? '0 4px 12px rgba(245,158,11,0.15)' : '0 2px 4px rgba(0,0,0,0.03)', transition: 'all 0.2s', minHeight: 80, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginBottom: 8 }}>PETS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 'auto' }}>
                    {bins.pets.map(item => (
                      <motion.div className="bin-item-icon" layoutId={item.id} key={item.id} onClick={(e) => { e.stopPropagation(); handleItemTap(item, 'pets') }}
                        style={{ width: 32, height: 32, background: item.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', cursor: 'pointer', border: `1px solid ${item.iconColor}40` }}>
                        <item.icon size={18} color={item.iconColor} strokeWidth={2.5} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* FOOD BIN */}
                <motion.div className="bin-box" whileTap={{ scale: 0.96 }} onClick={() => setActiveBin('food')}
                  style={{ background: activeBin === 'food' ? '#FEE2E2' : '#ffffff', border: `2px solid ${activeBin === 'food' ? '#EF4444' : '#E4E4E7'}`, borderRadius: 14, padding: '10px', textAlign: 'center', cursor: 'pointer', boxShadow: activeBin === 'food' ? '0 4px 12px rgba(239,68,68,0.15)' : '0 2px 4px rgba(0,0,0,0.03)', transition: 'all 0.2s', minHeight: 80, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginBottom: 8 }}>FOOD</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 'auto' }}>
                    {bins.food.map(item => (
                      <motion.div className="bin-item-icon" layoutId={item.id} key={item.id} onClick={(e) => { e.stopPropagation(); handleItemTap(item, 'food') }}
                        style={{ width: 32, height: 32, background: item.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', cursor: 'pointer', border: `1px solid ${item.iconColor}40` }}>
                        <item.icon size={18} color={item.iconColor} strokeWidth={2.5} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div style={{ height: 2, background: '#F4F4F5', borderRadius: 2, margin: '0 10px 16px' }} />

              <div className="unassigned-pool" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', flex: 1, alignContent: 'center' }}>
                {unassigned.map((item) => (
                  <motion.button className="item-btn" layoutId={item.id} key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleItemTap(item, 'unassigned')}
                    style={{ width: 52, height: 52, borderRadius: 14, background: item.color, border: `2px solid ${item.iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', outline: 'none' }}>
                    <item.icon size={26} color={item.iconColor} strokeWidth={2} />
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            // ================== DRAWING UI ==================
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#A1A1AA' }}>Draw below:</span>
                <button onClick={clearCanvas} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
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
        {errorMsg || (taskMode === 'sort' ? "Hint: Cats and Dogs belong in the PETS bin!" : "Hint: Use colors to draw eyes and sensors!")}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={taskMode === 'sort' ? handleCheckSort : handleCheckDraw}
        style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #14B8A6, #047857)', color: '#fff', border: '2px solid #064E3B', borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontStyle: 'italic', boxShadow: '0 6px 20px rgba(16,185,129,0.4)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        <Sparkles size={16} /> Let AI Check My {taskMode === 'sort' ? 'Sorting' : 'Drawing'}!
      </motion.button>

      {/* Bottom Progress Stats */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Trophy size={16} color="#F59E0B" />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#000' }}>Your Progress</span>
        </div>
        
        <div className="progress-stat-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#52525B' }}>Activities Today</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <div className="progress-bar-container" style={{ width: 100, height: 8, background: '#E4E4E7', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: '#09090B', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#10B981' }}>3/5</span>
          </div>
        </div>

        <div className="progress-stat-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#52525B' }}>Accuracy</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <div className="progress-bar-container" style={{ width: 100, height: 8, background: '#E4E4E7', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: '#09090B', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#D946EF' }}>85%</span>
          </div>
        </div>
      </div>

    </div>
  )
}