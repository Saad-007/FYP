import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { GripVertical, CheckCircle2, X, Zap, RotateCcw, ChevronRight, Puzzle, Trophy } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

// Helper component to render icons from strings
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle
  return <IconComponent size={size} color={color} {...props} />
}

export default function LogicTask({ zone, data, onComplete }) {
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
  const [steps, setSteps]     = useState(() => shuffle(data.steps))
  const [dragIdx, setDragIdx] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const onDragOver = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const arr = [...steps]
    const [m] = arr.splice(dragIdx, 1)
    arr.splice(i, 0, m)
    setSteps(arr)
    setDragIdx(i)
    setChecked(false)
    setCorrect(false)
  }

  const check = () => {
    const ok = steps.every((s, i) => s.order === i)
    setChecked(true)
    setCorrect(ok)
    setAttempts(p => p + 1)
  }

  const reset = () => { 
    setSteps(shuffle(data.steps))
    setChecked(false)
    setCorrect(false) 
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* ── Header ── */}
      <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 20, border: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ background: '#F4F4F5', padding: 8, borderRadius: 12 }}>
          <GripVertical size={18} color="#71717A" />
        </div>
        <div style={{ fontSize: 14, color: '#52525B', fontWeight: 700 }}>
          Drag the blocks to build the correct logical sequence (Top to Bottom).
        </div>
      </div>

      {/* ── Draggable Flowchart Steps ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((step, i) => {
          const isRight = checked && step.order === i
          const isWrong = checked && !correct && step.order !== i
          
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
              
              {/* Vertical Timeline Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                {i > 0 && <div style={{ width: 3, flex: 1, background: isRight ? '#10B981' : isWrong ? '#FECACA' : '#E4E4E7', borderRadius: 99, margin: '2px 0' }} />}
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: '50%', 
                  background: isRight ? '#10B981' : isWrong ? '#EF4444' : '#ffffff', 
                  border: `2px solid ${isRight ? '#10B981' : isWrong ? '#EF4444' : zone.color + '66'}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 12, 
                  fontWeight: 900, 
                  color: isRight || isWrong ? '#ffffff' : zone.color, 
                  fontFamily: "'DM Mono',monospace",
                  boxShadow: isRight || isWrong ? 'none' : '0 2px 6px rgba(0,0,0,0.05)'
                }}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div style={{ width: 3, flex: 1, background: isRight ? '#10B981' : isWrong ? '#FECACA' : '#E4E4E7', borderRadius: 99, margin: '2px 0' }} />}
              </div>

              {/* Draggable Card */}
              <motion.div layout animate={isWrong ? { x: [-5,5,-5,5,0] } : {}} transition={{ duration: 0.35 }}
                draggable onDragStart={() => setDragIdx(i)} onDragOver={e => onDragOver(e, i)} onDragEnd={() => setDragIdx(null)}
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 14, 
                  background: isRight ? '#F0FDF4' : isWrong ? '#FEF2F2' : '#ffffff', 
                  border: `2px solid ${isRight ? '#86EFAC' : isWrong ? '#FECACA' : dragIdx === i ? zone.color : '#E4E4E7'}`, 
                  borderRadius: 18, 
                  padding: '14px 18px', 
                  cursor: 'grab', 
                  userSelect: 'none', 
                  boxShadow: dragIdx === i ? `0 12px 30px ${zone.glow}` : '0 4px 12px rgba(0,0,0,0.03)', 
                  transition: 'background 0.25s, border-color 0.25s',
                  zIndex: dragIdx === i ? 10 : 1,
                  margin: '4px 0'
                }}>
                
                {/* Dynamic Vector Icon */}
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isRight ? '#DCFCE7' : isWrong ? '#FEE2E2' : step.bg || '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DynamicIcon name={step.icon} size={18} color={isRight ? '#16A34A' : isWrong ? '#EF4444' : step.color || '#52525B'} />
                </div>
                
                <span style={{ fontSize: 15, fontWeight: 800, color: '#09090B', flex: 1 }}>{step.text}</span>
                
                {/* Status Indicator */}
                <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                  {isRight ? <CheckCircle2 size={20} color="#10B981" /> : isWrong ? <X size={20} color="#EF4444" /> : <GripVertical size={18} color="#D4D4D8" />}
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* ── Controls ── */}
      {!correct && (
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={check}
            style={{ flex: 1, padding: '16px', background: zone.color, color: '#ffffff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 8px 24px ${zone.glow}` }}>
            <Zap size={18} fill="currentColor" /> Check Sequence
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={reset}
            style={{ padding: '16px 22px', background: '#ffffff', color: '#52525B', border: '2px solid #E4E4E7', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <RotateCcw size={18} /> Reset
          </motion.button>
        </div>
      )}

      {/* ── Error Feedback ── */}
      {checked && !correct && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#EF4444', borderRadius: '50%', padding: 4 }}>
             <X size={14} color="#ffffff" strokeWidth={3} />
          </div>
          <div>
             <div style={{ fontSize: 14, color: '#991B1B', fontWeight: 800 }}>Not quite right!</div>
             <div style={{ fontSize: 12, color: '#B91C1C', fontWeight: 600 }}>Attempt #{attempts} — The red steps are out of order. Try again!</div>
          </div>
        </motion.div>
      )}

      {/* ── Success Celebration ── */}
      <AnimatePresence>
        {correct && (
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{ background: `${zone.color}08`, border: `2px solid ${zone.color}40`, borderRadius: 24, padding: '32px', textAlign: 'center', boxShadow: `0 12px 40px ${zone.glow}`, marginTop: 10 }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                <Puzzle size={36} color="#ffffff" />
              </div>
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>
              Logic Master!
            </div>
            <div style={{ fontSize: 15, color: '#52525B', marginBottom: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              Solved in {attempts} attempt{attempts !== 1 ? 's' : ''}. Earned <Trophy size={16} color="#D97706" /> <strong style={{ color: '#D97706' }}>+{XP_MAP.logic} XP</strong>
            </div>
            
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#ffffff', border: 'none', borderRadius: 16, padding: '16px 36px', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: `0 8px 24px ${zone.glow}` }}>
              Claim XP & Continue <ChevronRight size={20} strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}