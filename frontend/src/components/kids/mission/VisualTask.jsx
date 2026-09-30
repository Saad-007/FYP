import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Sparkles, Trash2, Loader2, Target, SlidersHorizontal, CheckCircle2 } from 'lucide-react'

// ── Helper component for dynamic vector icons ──
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle
  return <IconComponent size={size} color={color} {...props} />
}

// 🌟 DYNAMIC DRAWING CATEGORIES (For Drawing Mode — used when data.type === 'draw')
const DRAWING_CATEGORIES = [
  { id: 'airplane', name: 'Airplane', emoji: '✈️' },
  { id: 'apple', name: 'Apple', emoji: '🍎' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'bus', name: 'Bus', emoji: '🚌' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓' },
  { id: 'clock', name: 'Clock', emoji: '⏰' }
]

const PALETTE_COLORS = ['#EF4444', '#A3E635', '#0EA5E9', '#10B981', '#D946EF', '#09090B', '#ffffff']

export default function VisualTask({ zone, data, onComplete }) {
  // ── MODE is fully data-driven now: sort | draw | find | select | slider ──
  const taskMode = data?.type || 'sort'

  // ── SORT STATE ──
  const [activeBin, setActiveBin] = useState(data?.bins?.[0]?.id)
  const [unassigned, setUnassigned] = useState(data?.items || [])
  const [bins, setBins] = useState({})

  // ── DRAW STATE ──
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState('#09090B')
  const [currentDrawTask, setCurrentDrawTask] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // ── FIND STATE ──
  const [foundIds, setFoundIds] = useState([])
  const [wrongTapId, setWrongTapId] = useState(null)

  // ── SELECT STATE ──
  const [selectedIds, setSelectedIds] = useState([])

  // ── SLIDER STATE ──
  const [sliderValue, setSliderValue] = useState(data?.min ?? 0)

  // ── SHARED STATE ──
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [timeLeft, setTimeLeft] = useState(100)

  // ── Data Sync: reset everything whenever a new zone/task loads ──
  useEffect(() => {
    if (data?.bins) {
      const initialBins = data.bins.reduce((acc, bin) => ({ ...acc, [bin.id]: [] }), {})
      setBins(initialBins)
      setActiveBin(data.bins[0].id)
      setUnassigned(data.items || [])
    }
    setFoundIds([])
    setWrongTapId(null)
    setSelectedIds([])
    setSliderValue(data?.min ?? 0)
    setSuccess(false)
    setErrorMsg(null)
    setTimeLeft(100)
    if (taskMode === 'draw') pickRandomTask()
  }, [data])

  // ── Timer Logic ──
  useEffect(() => {
    if (success) return
    const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 0.5)), 500)
    return () => clearInterval(timer)
  }, [success])

  const pickRandomTask = () => {
    const randomTask = DRAWING_CATEGORIES[Math.floor(Math.random() * DRAWING_CATEGORIES.length)]
    setCurrentDrawTask(randomTask)
  }

  // ── SORT LOGIC ──
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

    // 'any' bin type (e.g. load-balancing tasks) accepts any bin as correct;
    // otherwise item.type must equal the bin it landed in.
    const isCorrect = data.bins.every(bin =>
      bins[bin.id].every(item => item.type === bin.id || item.type === 'any')
    )

    if (isCorrect) {
      setSuccess(true)
      setErrorMsg("Perfect Sorting! 🎯")
      setTimeout(() => onComplete(), 1000)
    } else {
      setErrorMsg("Hint: Oops! Try checking the categories again. 🧐")
      setTimeout(() => {
        setUnassigned(data.items)
        const initialBins = data.bins.reduce((acc, bin) => ({ ...acc, [bin.id]: [] }), {})
        setBins(initialBins)
        setErrorMsg(null)
      }, 2000)
    }
  }

  // ── FIND LOGIC ──
  const handleFindTap = (item) => {
    if (success || foundIds.includes(item.id)) return
    if (item.isTarget) {
      const next = [...foundIds, item.id]
      setFoundIds(next)
      setErrorMsg(null)
      if (next.length >= (data.targetCount || 1)) {
        setSuccess(true)
        setTimeout(() => onComplete(), 1000)
      }
    } else {
      setWrongTapId(item.id)
      setErrorMsg('Not quite — try another one! 🔍')
      setTimeout(() => { setWrongTapId(null); setErrorMsg(null) }, 900)
    }
  }

  // ── SELECT LOGIC ──
  const handleSelectToggle = (item) => {
    if (success) return
    setSelectedIds(prev => {
      if (prev.includes(item.id)) return prev.filter(id => id !== item.id)
      if (prev.length >= (data.requiredCount || 1)) return prev
      return [...prev, item.id]
    })
    setErrorMsg(null)
  }

  const handleCheckSelect = () => {
    const requiredCount = data.requiredCount || 1
    if (selectedIds.length < requiredCount) {
      setErrorMsg(`Pick ${requiredCount} item${requiredCount > 1 ? 's' : ''} first! ✨`)
      setTimeout(() => setErrorMsg(null), 2000)
      return
    }

    // If the zone defines a fixed correct set, validate against it.
    // Otherwise (creative/combination tasks) any full selection is valid.
    if (Array.isArray(data.correctIds) && data.correctIds.length) {
      const correctSet = new Set(data.correctIds)
      const selectedSet = new Set(selectedIds)
      const isCorrect = correctSet.size === selectedSet.size && [...correctSet].every(id => selectedSet.has(id))
      if (!isCorrect) {
        setErrorMsg("Hint: Not quite — try a different combination! 🧐")
        setTimeout(() => { setSelectedIds([]); setErrorMsg(null) }, 2000)
        return
      }
    }

    setSuccess(true)
    setErrorMsg('Great choice! ✨')
    setTimeout(() => onComplete(), 1000)
  }

  // ── SLIDER LOGIC ──
  const handleCheckSlider = () => {
    const target = data.target ?? 100
    if (sliderValue >= target) {
      setSuccess(true)
      setErrorMsg('Target reached! 🎯')
      setTimeout(() => onComplete(), 1000)
    } else {
      setErrorMsg(`Keep going — aim for ${target}${data.unit ? ` ${data.unit}` : ''}!`)
      setTimeout(() => setErrorMsg(null), 1800)
    }
  }

  // ── DRAW LOGIC ──
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
  }, [taskMode, data])

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

  // 🚀 REAL AI CHECKING LOGIC (Connected to backend)
  const handleCheckDraw = async () => {
    if (!canvasRef.current) return

    setIsEvaluating(true)
    setErrorMsg(null)

    const imageData = canvasRef.current.toDataURL('image/png')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/evaluate-drawing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageData,
          expectedCategory: currentDrawTask?.name || "drawing"
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error);

      setIsEvaluating(false)

      if (resData.isCorrect || resData.score >= 60) {
        setSuccess(true)
        setTimeout(() => onComplete(), 1500)
      } else {
        setErrorMsg(`AI says: ${resData.feedback} Try again! 🎨`)
      }

    } catch (error) {
      console.error(error);
      setIsEvaluating(false)
      setErrorMsg("Network error! Make sure your server is running. 🔌")
    }
  }

  // ── Which "check" handler + label applies to the active mode ──
  const checkHandlers = {
    sort: handleCheckSort,
    draw: handleCheckDraw,
    find: null,   // completion happens automatically on last correct tap
    select: handleCheckSelect,
    slider: handleCheckSlider,
  }
  const checkLabels = {
    sort: 'Sorting',
    draw: 'Drawing',
    find: 'Targets',
    select: 'Choice',
    slider: 'Progress',
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
        }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .shake { animation: shake 0.35s ease; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 className="task-title" style={{ fontSize: 22, fontWeight: 900, color: '#1A1A1A', margin: '0 0 12px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>
          {taskMode === 'draw' ? `Draw a ${currentDrawTask?.name || '...'} ${currentDrawTask?.emoji || ''}` : data?.title || 'Visual Task'}
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

        <div className="canvas-area" style={{ background: '#FAFAFA', borderRadius: 20, padding: '16px 12px', minHeight: 280, position: 'relative', display: 'flex', flexDirection: 'column', border: '1.5px solid #E5E7EB', flex: 1, overflow: 'hidden' }}>

          {/* ================== SORT ================== */}
          {taskMode === 'sort' && data?.bins && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.bins.length}, 1fr)`, gap: 10, marginBottom: 20 }}>
                {data.bins.map(bin => (
                  <motion.div
                    key={bin.id} whileTap={{ scale: 0.96 }} onClick={() => setActiveBin(bin.id)}
                    style={{ background: activeBin === bin.id ? bin.activeBg : '#ffffff', border: `2px solid ${activeBin === bin.id ? bin.borderColor : '#E4E4E7'}`, borderRadius: 14, padding: '10px', textAlign: 'center', cursor: 'pointer', boxShadow: activeBin === bin.id ? `0 4px 12px ${bin.borderColor}40` : '0 2px 4px rgba(0,0,0,0.03)', transition: 'all 0.2s', minHeight: 80, display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginBottom: 8 }}>{bin.label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 'auto' }}>
                      {bins[bin.id]?.map(item => (
                        <motion.div layoutId={item.id} key={item.id} onClick={(e) => { e.stopPropagation(); handleItemTap(item, bin.id) }}
                          style={{ width: 32, height: 32, background: item.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', cursor: 'pointer', border: `1px solid ${item.iconColor}40` }}>
                          <DynamicIcon name={item.icon} size={18} color={item.iconColor} strokeWidth={2.5} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ height: 2, background: '#F4F4F5', borderRadius: 2, margin: '0 10px 16px' }} />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', flex: 1, alignContent: 'center' }}>
                {unassigned.map((item) => (
                  <motion.button layoutId={item.id} key={item.id} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleItemTap(item, 'unassigned')}
                    style={{ width: 52, height: 52, borderRadius: 14, background: item.color, border: `2px solid ${item.iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', outline: 'none' }}
                  >
                    <DynamicIcon name={item.icon} size={26} color={item.iconColor} strokeWidth={2} />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ================== DRAW ================== */}
          {taskMode === 'draw' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#A1A1AA' }}>Draw below:</span>
                <button onClick={clearCanvas} disabled={isEvaluating} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: isEvaluating ? 'not-allowed' : 'pointer' }}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>

              {isEvaluating && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,250,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, backdropFilter: 'blur(2px)' }}>
                  <div style={{ background: '#fff', padding: '12px 24px', borderRadius: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', gap: 10, alignItems: 'center', fontWeight: 800, color: '#09090B' }}>
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

          {/* ================== FIND ================== */}
          {taskMode === 'find' && data?.grid && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 99, padding: '6px 14px' }}>
                <Target size={14} color="#2563EB" />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#2563EB' }}>{foundIds.length}/{data.targetCount || 1} found</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.grid.length, 4)}, 1fr)`, gap: 16 }}>
                {data.grid.map(item => {
                  const isFound = foundIds.includes(item.id)
                  const isWrong = wrongTapId === item.id
                  return (
                    <motion.button
                      key={item.id}
                      className={isWrong ? 'shake' : ''}
                      whileHover={!isFound ? { scale: 1.08 } : {}}
                      whileTap={!isFound ? { scale: 0.92 } : {}}
                      onClick={() => handleFindTap(item)}
                      disabled={isFound}
                      style={{
                        width: 72, height: 72, borderRadius: 18,
                        background: isFound ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#ffffff',
                        border: `2.5px solid ${isFound ? '#16A34A' : isWrong ? '#EF4444' : `${item.color}40`}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: isFound ? 'default' : 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)', transition: 'all 0.2s'
                      }}>
                      {isFound ? <CheckCircle2 size={30} color="#16A34A" /> : <DynamicIcon name={item.icon} size={30} color={item.color} strokeWidth={2} />}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================== SELECT ================== */}
          {taskMode === 'select' && data?.items && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 20 }}>
              <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#71717A' }}>
                {selectedIds.length}/{data.requiredCount || 1} selected
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {data.items.map(item => {
                  const isSelected = selectedIds.includes(item.id)
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectToggle(item)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        padding: '14px 18px', borderRadius: 16,
                        background: isSelected ? '#EEF2FF' : '#ffffff',
                        border: `2px solid ${isSelected ? '#6366F1' : '#E4E4E7'}`,
                        cursor: 'pointer', boxShadow: isSelected ? '0 4px 14px rgba(99,102,241,0.2)' : '0 2px 6px rgba(0,0,0,0.04)'
                      }}>
                      <DynamicIcon name={item.icon} size={26} color={isSelected ? '#4F46E5' : '#71717A'} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? '#4F46E5' : '#52525B', textAlign: 'center' }}>{item.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================== SLIDER ================== */}
          {taskMode === 'slider' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 99, padding: '6px 16px' }}>
                <SlidersHorizontal size={14} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#7C3AED', fontFamily: "'DM Mono',monospace" }}>
                  {sliderValue}{data?.unit ? ` ${data.unit}` : ''}
                </span>
              </div>
              <input
                type="range"
                min={data?.min ?? 0}
                max={data?.max ?? 100}
                step={data?.step ?? 1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                style={{ width: '100%', maxWidth: 320, accentColor: '#7C3AED', height: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 320, fontSize: 11, fontWeight: 700, color: '#A1A1AA' }}>
                <span>{data?.min ?? 0}</span>
                <span>Target: {data?.target ?? 100}{data?.unit ? ` ${data.unit}` : ''}</span>
                <span>{data?.max ?? 100}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Palette (drawing mode only) ── */}
        {taskMode === 'draw' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {PALETTE_COLORS.map(color => (
              <motion.div key={color} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setPenColor(color)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: color, border: penColor === color ? '3px solid #6366F1' : '2px solid #E4E4E7', cursor: 'pointer', boxShadow: penColor === color ? '0 0 10px rgba(99,102,241,0.5)' : '0 2px 4px rgba(0,0,0,0.1)' }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#FFFBEB', padding: '10px 16px', borderRadius: 12, textAlign: 'center', marginBottom: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: errorMsg ? '#EF4444' : '#1A1A1A', fontWeight: 800, fontSize: 13, transition: 'color 0.3s' }}>
        {errorMsg || data?.instruction || data?.hint || (taskMode === 'draw' ? `Hint: Try your best to draw the ${currentDrawTask?.name}! 🎨` : 'Complete the challenge!')}
      </div>

      {/* Find mode has no manual check button — it completes on the last correct tap */}
      {taskMode !== 'find' && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
          onClick={checkHandlers[taskMode]}
          disabled={isEvaluating}
          style={{ width: '100%', padding: '14px', background: isEvaluating ? '#9CA3AF' : 'linear-gradient(90deg, #14B8A6, #047857)', color: '#fff', border: '2px solid #064E3B', borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: isEvaluating ? 'not-allowed' : 'pointer', fontFamily: "'Syne',sans-serif", fontStyle: 'italic', boxShadow: '0 6px 20px rgba(16,185,129,0.4)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          {isEvaluating ? (
            <><Loader2 size={16} className="spin-animation" /> Checking...</>
          ) : (
            <><Sparkles size={16} /> Let AI Check My {checkLabels[taskMode]}!</>
          )}
        </motion.button>
      )}
    </div>
  )
}