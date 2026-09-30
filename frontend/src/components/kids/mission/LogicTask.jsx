import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Trophy, X, RotateCcw, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

// ── Helper component for dynamic vector icons ──
const DynamicIcon = ({ name, size = 36, color = 'currentColor', fill = 'none', ...props }) => {
  const IconComponent = Icons[name] || Icons.Puzzle
  return <IconComponent size={size} color={color} fill={fill} {...props} />
}

// Fisher-Yates shuffle (stable per-mount via useMemo below)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LogicTask({ zone, data, onComplete }) {
  const taskType = data?.type || 'order'

  // ── ORDER STATE (blocks + targetOrder) ──
  const [available, setAvailable] = useState(data?.blocks || [])
  const [answer, setAnswer] = useState([])

  // ── MATCH / CONDITION STATE (pairs / rules → unified pairs) ──
  // `condition` reuses the same left→right connecting mechanic as `match`,
  // just framed as If → Then instead of Question → Source.
  const unifiedPairs = useMemo(() => {
    if (taskType === 'match') return data?.pairs || []
    if (taskType === 'condition') {
      return (data?.rules || []).map(r => ({
        id: r.id, leftIcon: r.ifIcon, leftLabel: r.ifLabel, rightIcon: r.thenIcon, rightLabel: r.thenLabel
      }))
    }
    return []
  }, [data, taskType])

  const shuffledRight = useMemo(() => shuffle(unifiedPairs), [unifiedPairs])
  const [selectedLeftId, setSelectedLeftId] = useState(null)
  const [matchedIds, setMatchedIds] = useState([])
  const [wrongRightId, setWrongRightId] = useState(null)

  // ── FIND STATE (grid + targetCount) ──
  const [foundIds, setFoundIds] = useState([])
  const [wrongFindId, setWrongFindId] = useState(null)

  // ── SLIDER STATE (min/max/target) ──
  const [sliderValue, setSliderValue] = useState(data?.min ?? 0)
  const [sliderHint, setSliderHint] = useState(null)

  // ── SELECT STATE (choose N items) ──
  const [selectedIds, setSelectedIds] = useState([])
  const [selectHint, setSelectHint] = useState(null)

  // ── SORT STATE (bins + items, e.g. Healthy Sorting) ──
  const [activeBin, setActiveBin] = useState(data?.bins?.[0]?.id)
  const [sortUnassigned, setSortUnassigned] = useState(data?.items || [])
  const [sortBins, setSortBins] = useState({})
  const [sortHint, setSortHint] = useState(null)

  const [showError, setShowError] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  // Single shared "correct!" path for every logic sub-type — shows an
  // inline banner (no full-screen modal, no button) and auto-advances.
  // This is the ONLY completion feedback inside the task itself; the
  // celebratory "Task Completed" screen + Next Task button lives one
  // level up in KidMissionPage, so we don't show two "complete" screens.
  const triggerAutoComplete = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => onComplete(), 1200)
  }

  // ── RESET whenever the zone/task changes ──
  useEffect(() => {
    setAvailable(data?.blocks || [])
    setAnswer([])
    setSelectedLeftId(null)
    setMatchedIds([])
    setWrongRightId(null)
    setFoundIds([])
    setWrongFindId(null)
    setSliderValue(data?.min ?? 0)
    setSliderHint(null)
    setSelectedIds([])
    setSelectHint(null)
    if (data?.bins) {
      const initialBins = data.bins.reduce((acc, bin) => ({ ...acc, [bin.id]: [] }), {})
      setSortBins(initialBins)
      setActiveBin(data.bins[0].id)
      setSortUnassigned(data.items || [])
    }
    setSortHint(null)
    setShowError(false)
    setSuccessMsg(null)
  }, [data])

  // ── ORDER LOGIC ──
  const handleSelect = (block) => {
    const targetLength = data?.targetOrder?.length || 4
    if (answer.length >= targetLength) return
    setAvailable(prev => prev.filter(b => b.id !== block.id))
    setAnswer(prev => [...prev, block])
  }
  const handleDeselect = (block) => {
    setAnswer(prev => prev.filter(b => b.id !== block.id))
    setAvailable(prev => [...prev, block])
  }
  const handleCheckOrder = () => {
    const targetLength = data?.targetOrder?.length || 4
    if (answer.length < targetLength) { setShowError(true); return }
    const isCorrect = answer.every((block, index) => block.id === data.targetOrder[index])
    if (isCorrect) triggerAutoComplete('Brilliant! Pattern cracked! 🎯')
    else setShowError(true)
  }
  const handleRetryOrder = () => {
    setAvailable(data?.blocks || [])
    setAnswer([])
    setShowError(false)
  }

  // ── MATCH / CONDITION LOGIC ──
  const handleLeftTap = (pairId) => {
    if (matchedIds.includes(pairId)) return
    setSelectedLeftId(pairId)
  }
  const handleRightTap = (rightItem) => {
    if (!selectedLeftId || matchedIds.includes(rightItem.id)) return
    if (rightItem.id === selectedLeftId) {
      const next = [...matchedIds, rightItem.id]
      setMatchedIds(next)
      setSelectedLeftId(null)
      if (next.length === unifiedPairs.length) {
        setTimeout(() => triggerAutoComplete('All connected — nicely done! ✨'), 400)
      }
    } else {
      setWrongRightId(rightItem.id)
      setTimeout(() => { setWrongRightId(null); setSelectedLeftId(null) }, 700)
    }
  }

  // ── FIND LOGIC ──
  const handleFindTap = (item) => {
    if (foundIds.includes(item.id)) return
    if (item.isTarget) {
      const next = [...foundIds, item.id]
      setFoundIds(next)
      if (next.length >= (data?.targetCount || 1)) {
        setTimeout(() => triggerAutoComplete('Sharp eyes! Found it! 🔍'), 400)
      }
    } else {
      setWrongFindId(item.id)
      setTimeout(() => setWrongFindId(null), 700)
    }
  }

  // ── SLIDER LOGIC ──
  const handleCheckSlider = () => {
    const target = data?.target ?? 100
    if (sliderValue >= target) {
      triggerAutoComplete('Target reached! 🎯')
    } else {
      setSliderHint(`Keep going — aim for ${target}${data?.unit ? ` ${data.unit}` : ''}!`)
      setTimeout(() => setSliderHint(null), 1800)
    }
  }

  const xpEarned = XP_MAP.logic

  // ── SELECT LOGIC ──
  const handleSelectToggle = (item) => {
    setSelectedIds(prev => {
      if (prev.includes(item.id)) return prev.filter(id => id !== item.id)
      if (prev.length >= (data?.requiredCount || 1)) return prev
      return [...prev, item.id]
    })
    setSelectHint(null)
  }
  const handleCheckSelect = () => {
    const requiredCount = data?.requiredCount || 1
    if (selectedIds.length < requiredCount) {
      setSelectHint(`Pick ${requiredCount} item${requiredCount > 1 ? 's' : ''} first!`)
      setTimeout(() => setSelectHint(null), 1800)
      return
    }
    if (Array.isArray(data?.correctIds) && data.correctIds.length) {
      const correctSet = new Set(data.correctIds)
      const selectedSet = new Set(selectedIds)
      const isCorrect = correctSet.size === selectedSet.size && [...correctSet].every(id => selectedSet.has(id))
      if (!isCorrect) {
        setSelectHint('Not quite — try again! 🧐')
        setTimeout(() => { setSelectedIds([]); setSelectHint(null) }, 1800)
        return
      }
    }
    triggerAutoComplete('Nice pick! ✨')
  }

  // ── SORT LOGIC (bins + items) ──
  const handleSortItemTap = (item, source) => {
    if (source === 'unassigned') {
      setSortUnassigned(prev => prev.filter(i => i.id !== item.id))
      setSortBins(prev => ({ ...prev, [activeBin]: [...prev[activeBin], item] }))
    } else {
      setSortBins(prev => ({ ...prev, [source]: prev[source].filter(i => i.id !== item.id) }))
      setSortUnassigned(prev => [...prev, item])
    }
    setSortHint(null)
  }
  const handleCheckSort = () => {
    if (sortUnassigned.length > 0) {
      setSortHint('Sort all items first! 🌟')
      setTimeout(() => setSortHint(null), 1800)
      return
    }
    const isCorrect = data.bins.every(bin =>
      sortBins[bin.id].every(item => item.type === bin.id || item.type === 'any')
    )
    if (isCorrect) {
      triggerAutoComplete('Perfect sorting! 🎯')
    } else {
      setSortHint('Oops! Try checking the categories again. 🧐')
      setTimeout(() => {
        setSortUnassigned(data.items)
        const initialBins = data.bins.reduce((acc, bin) => ({ ...acc, [bin.id]: [] }), {})
        setSortBins(initialBins)
        setSortHint(null)
      }, 1800)
    }
  }

  return (
    <div className="logic-task-wrapper" style={{
      margin: '-32px',
      padding: '24px 20px',
      borderRadius: '32px',
      background: '#98D8D8',
      minHeight: '750px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: "'Nunito', sans-serif"
    }}>

      <style>{`
        @media (max-width: 768px) {
          .logic-task-wrapper { margin: -16px !important; padding: 16px 12px !important; border-radius: 24px !important; min-height: 85vh !important; }
          .task-header { font-size: 22px !important; margin: 8px 0 !important; }
          .instruction-box { padding: 12px !important; margin-bottom: 16px !important; }
          .instruction-title { font-size: 16px !important; }
          .instruction-hint { font-size: 11px !important; }
          .drop-zone { min-height: 200px !important; padding: 16px 12px !important; margin-bottom: 16px !important; }
          .drop-zone-title { font-size: 16px !important; margin: 0 0 16px !important; }
          .shape-block { width: 54px !important; height: 54px !important; border-width: 2px !important; }
          .shape-block svg { width: 28px !important; height: 28px !important; }
          .blocks-container { gap: 8px !important; }
          .check-btn { padding: 14px 28px !important; font-size: 16px !important; }
          .modal-card { padding: 28px 20px !important; max-width: 90% !important; }
          .modal-title { font-size: 22px !important; }
          .match-col { gap: 8px !important; }
          .match-card { padding: 10px 12px !important; font-size: 12px !important; }
        }
        @media (max-width: 480px) {
          .logic-task-wrapper { margin: -12px !important; }
          .shape-block { width: 48px !important; height: 48px !important; }
          .shape-block svg { width: 24px !important; height: 24px !important; }
          .task-header { font-size: 20px !important; }
        }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .shake { animation: shake 0.35s ease; }
      `}</style>

      {/* ── INLINE SUCCESS BANNER (no full-screen modal — avoids a duplicate
           "complete, go next" screen since KidMissionPage shows the real one) ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: 99, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(16,185,129,0.2)' }}>
            <Trophy size={16} color="#16A34A" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#166534' }}>{successMsg} +{xpEarned} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ERROR MODAL (order type only) ── */}
      <AnimatePresence>
        {showError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
            <motion.div className="modal-card" initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ background: '#ffffff', borderRadius: 32, padding: '36px 24px', width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ background: '#FEE2E2', padding: 16, borderRadius: '50%' }}>
                  <X size={48} color="#EF4444" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="modal-title" style={{ fontSize: 26, fontWeight: 900, color: '#1F2937', margin: '0 0 12px', fontFamily: "'Syne',sans-serif" }}>Incorrect!</h2>
              <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 28px', fontWeight: 700 }}>That's not the right pattern.<br />Let's do it again! 🔄</p>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRetryOrder}
                style={{ width: '100%', padding: '16px 10px', background: '#FECACA', color: '#B91C1C', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <RotateCcw size={18} /> Try Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 className="task-header" style={{ fontSize: 24, fontWeight: 900, color: '#1A1A1A', margin: '16px 0', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
          {data?.title || 'Pattern Puzzle Challenge!'}
        </h2>
      </div>

      {/* ── Instruction Box ── */}
      <div className="instruction-box" style={{ background: '#ffffff', padding: '16px', borderRadius: 16, width: '100%', margin: '0 auto 20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div className="instruction-title" style={{ fontSize: 18, fontWeight: 900, color: '#000', marginBottom: 8 }}>
          {data?.instruction || 'Arrange the blocks in order! 🎯'}
        </div>
        <div className="instruction-hint" style={{ fontSize: 12, fontWeight: 700, color: '#71717A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {data?.hint || 'Drag and drop items in sequence.'}
        </div>
      </div>

      {/* ================== ORDER ================== */}
      {taskType === 'order' && (
        <>
          <div className="drop-zone" style={{ background: '#F3F4F6', borderRadius: 16, padding: '20px 16px', minHeight: 260, position: 'relative', display: 'flex', flexDirection: 'column', border: '2px solid #E5E7EB', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02)', marginBottom: 24 }}>
            <h3 className="drop-zone-title" style={{ textAlign: 'center', margin: '0 0 20px', fontSize: 18, fontWeight: 900, color: '#000' }}>Your Answer:</h3>
            <div className="blocks-container" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', flex: 1, alignContent: 'center' }}>
              {answer.map((block) => (
                <motion.div className="shape-block" layoutId={block.id} key={block.id} onClick={() => handleDeselect(block)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 64, height: 64, background: block.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${block.color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <DynamicIcon name={block.icon} size={36} color={block.color} fill={block.color} />
                </motion.div>
              ))}
            </div>
            {answer.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 11, fontWeight: 700, marginTop: 'auto', fontStyle: 'italic' }}>
                Click blocks below to add them here
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 900, color: '#1A1A1A' }}>Available Blocks</h3>
            <div className="blocks-container" style={{ display: 'flex', justifyContent: 'center', gap: 12, minHeight: 70, flexWrap: 'wrap' }}>
              {available.map((block) => (
                <motion.div className="shape-block" layoutId={block.id} key={block.id} onClick={() => handleSelect(block)}
                  whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 64, height: 64, background: block.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${block.color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <DynamicIcon name={block.icon} size={36} color={block.color} fill={block.color} />
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
            <motion.button className="check-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCheckOrder}
              style={{ padding: '16px 40px', background: '#C4B5FD', color: '#000', border: '2px solid #000', borderRadius: 99, fontSize: 18, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 0 #000', display: 'flex', alignItems: 'center', gap: 8 }}>
              Check Answer ✓
            </motion.button>
          </div>
        </>
      )}

      {/* ================== MATCH / CONDITION ================== */}
      {(taskType === 'match' || taskType === 'condition') && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ background: '#ffffff', borderRadius: 99, padding: '6px 16px', fontSize: 12, fontWeight: 800, color: '#0F766E', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              {matchedIds.length}/{unifiedPairs.length} connected
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {/* LEFT column */}
            <div className="match-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {unifiedPairs.map(p => {
                const isMatched = matchedIds.includes(p.id)
                const isSelected = selectedLeftId === p.id
                return (
                  <motion.button key={p.id} className="match-card"
                    whileHover={!isMatched ? { scale: 1.03 } : {}} whileTap={!isMatched ? { scale: 0.97 } : {}}
                    onClick={() => handleLeftTap(p.id)} disabled={isMatched}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, minWidth: 200,
                      background: isMatched ? '#DCFCE7' : isSelected ? '#EEF2FF' : '#ffffff',
                      border: `2.5px solid ${isMatched ? '#16A34A' : isSelected ? '#6366F1' : '#E4E4E7'}`,
                      cursor: isMatched ? 'default' : 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', fontWeight: 800, fontSize: 13, color: '#1A1A1A'
                    }}>
                    {isMatched ? <CheckCircle2 size={20} color="#16A34A" /> : <DynamicIcon name={p.leftIcon} size={20} color={isSelected ? '#4F46E5' : '#71717A'} />}
                    {p.leftLabel}
                  </motion.button>
                )
              })}
            </div>

            {/* Center arrow */}
            <div style={{ display: 'flex', alignItems: 'center', color: '#0F766E', opacity: 0.5 }}>
              <ArrowRight size={26} />
            </div>

            {/* RIGHT column (shuffled) */}
            <div className="match-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {shuffledRight.map(p => {
                const isMatched = matchedIds.includes(p.id)
                const isWrong = wrongRightId === p.id
                return (
                  <motion.button key={p.id} className={`match-card ${isWrong ? 'shake' : ''}`}
                    whileHover={!isMatched ? { scale: 1.03 } : {}} whileTap={!isMatched ? { scale: 0.97 } : {}}
                    onClick={() => handleRightTap(p)} disabled={isMatched}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, minWidth: 200,
                      background: isMatched ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#ffffff',
                      border: `2.5px solid ${isMatched ? '#16A34A' : isWrong ? '#EF4444' : '#E4E4E7'}`,
                      cursor: isMatched ? 'default' : 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', fontWeight: 800, fontSize: 13, color: '#1A1A1A'
                    }}>
                    {isMatched ? <CheckCircle2 size={20} color="#16A34A" /> : <DynamicIcon name={p.rightIcon} size={20} color={isWrong ? '#DC2626' : '#71717A'} />}
                    {p.rightLabel}
                  </motion.button>
                )
              })}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 24, fontSize: 12, fontWeight: 700, color: '#0F766E' }}>
            Tap a card on the left, then its match on the right.
          </div>
        </div>
      )}

      {/* ================== SORT ================== */}
      {taskType === 'sort' && data?.bins && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.bins.length}, 1fr)`, gap: 10, marginBottom: 20 }}>
            {data.bins.map(bin => (
              <motion.div
                key={bin.id} whileTap={{ scale: 0.96 }} onClick={() => setActiveBin(bin.id)}
                style={{ background: activeBin === bin.id ? bin.activeBg : '#ffffff', border: `2px solid ${activeBin === bin.id ? bin.borderColor : '#E4E4E7'}`, borderRadius: 14, padding: '10px', textAlign: 'center', cursor: 'pointer', boxShadow: activeBin === bin.id ? `0 4px 12px ${bin.borderColor}40` : '0 2px 4px rgba(0,0,0,0.03)', minHeight: 80, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginBottom: 8 }}>{bin.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 'auto' }}>
                  {sortBins[bin.id]?.map(item => (
                    <motion.div layoutId={item.id} key={item.id} onClick={(e) => { e.stopPropagation(); handleSortItemTap(item, bin.id) }}
                      style={{ width: 32, height: 32, background: item.color || '#E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', cursor: 'pointer', border: `1px solid ${item.iconColor || '#9CA3AF'}40` }}>
                      <DynamicIcon name={item.icon} size={18} color={item.iconColor || '#4B5563'} strokeWidth={2.5} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 2, margin: '0 10px 16px' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', flex: 1, alignContent: 'center' }}>
            {sortUnassigned.map((item) => (
              <motion.button layoutId={item.id} key={item.id} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleSortItemTap(item, 'unassigned')}
                style={{ width: 52, height: 52, borderRadius: 14, background: item.color || '#ffffff', border: `2px solid ${item.iconColor || '#9CA3AF'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', outline: 'none' }}>
                <DynamicIcon name={item.icon} size={26} color={item.iconColor || '#4B5563'} strokeWidth={2} />
              </motion.button>
            ))}
          </div>

          {sortHint && (
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 12, color: '#B91C1C', marginTop: 12 }}>{sortHint}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
            <motion.button className="check-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCheckSort}
              style={{ padding: '14px 36px', background: '#C4B5FD', color: '#000', border: '2px solid #000', borderRadius: 99, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 0 #000' }}>
              Check Answer ✓
            </motion.button>
          </div>
        </div>
      )}

      {/* ================== SELECT ================== */}
      {taskType === 'select' && data?.items && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#0F766E' }}>
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
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 20px', borderRadius: 16,
                    background: isSelected ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    border: `2.5px solid ${isSelected ? '#7C3AED' : 'transparent'}`,
                    cursor: 'pointer', boxShadow: isSelected ? '0 4px 14px rgba(124,58,237,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
                    fontWeight: 800, fontSize: 14, color: '#1A1A1A'
                  }}>
                  {item.icon && <DynamicIcon name={item.icon} size={22} color={isSelected ? '#7C3AED' : '#374151'} />}
                  {item.label}
                </motion.button>
              )
            })}
          </div>
          {selectHint && (
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 12, color: '#B91C1C' }}>{selectHint}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <motion.button className="check-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCheckSelect}
              style={{ padding: '14px 36px', background: '#C4B5FD', color: '#000', border: '2px solid #000', borderRadius: 99, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 0 #000' }}>
              Check Answer ✓
            </motion.button>
          </div>
        </div>
      )}

      {/* ================== SLIDER ================== */}
      {taskType === 'slider' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 99, padding: '6px 16px' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 320, fontSize: 11, fontWeight: 700, color: '#0F766E' }}>
            <span>{data?.min ?? 0}</span>
            <span>Target: {data?.target ?? 100}{data?.unit ? ` ${data.unit}` : ''}</span>
            <span>{data?.max ?? 100}</span>
          </div>
          {sliderHint && (
            <div style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: 12, padding: '8px 16px', borderRadius: 99 }}>
              {sliderHint}
            </div>
          )}
          <motion.button className="check-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCheckSlider}
            style={{ padding: '14px 36px', background: '#C4B5FD', color: '#000', border: '2px solid #000', borderRadius: 99, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 0 #000' }}>
            Check Answer ✓
          </motion.button>
        </div>
      )}

      {/* ================== FIND ================== */}
      {taskType === 'find' && data?.grid && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ background: '#ffffff', borderRadius: 99, padding: '6px 16px', fontSize: 12, fontWeight: 800, color: '#0F766E', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
            {foundIds.length}/{data.targetCount || 1} found
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.grid.length, 4)}, 1fr)`, gap: 16 }}>
            {data.grid.map(item => {
              const isFound = foundIds.includes(item.id)
              const isWrong = wrongFindId === item.id
              return (
                <motion.button key={item.id} className={isWrong ? 'shake' : ''}
                  whileHover={!isFound ? { scale: 1.08 } : {}} whileTap={!isFound ? { scale: 0.92 } : {}}
                  onClick={() => handleFindTap(item)} disabled={isFound}
                  style={{
                    width: 72, height: 72, borderRadius: 18,
                    background: isFound ? '#DCFCE7' : isWrong ? '#FEE2E2' : '#ffffff',
                    border: `2.5px solid ${isFound ? '#16A34A' : isWrong ? '#EF4444' : `${item.color}40`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isFound ? 'default' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                  }}>
                  {isFound ? <CheckCircle2 size={30} color="#16A34A" /> : <DynamicIcon name={item.icon} size={30} color={item.color} strokeWidth={2} />}
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}