import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, Square, Diamond, Star, Trophy, X, RotateCcw } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

// ── Strict Pattern Rules ──
// Correct Order: Circle -> Square -> Diamond -> Star
const TARGET_ORDER = ['circle', 'square', 'diamond', 'star']

const INITIAL_BLOCKS = [
  { id: 'circle',  icon: Circle,  color: '#E11D48', bg: '#FB7185', shape: 'Circle' },   // Red Circle, Pink BG
  { id: 'square',  icon: Square,  color: '#1D4ED8', bg: '#60A5FA', shape: 'Square' },   // Dark Blue Square, Light Blue BG
  { id: 'diamond', icon: Diamond, color: '#EA580C', bg: '#FB923C', shape: 'Diamond' },  // Orange Diamond, Light Orange BG
  { id: 'star',    icon: Star,    color: '#EAB308', bg: '#2DD4BF', shape: 'Star' },     // Yellow Star, Teal/Green BG
]

export default function LogicTask({ zone, onComplete }) {
  const [available, setAvailable] = useState(INITIAL_BLOCKS)
  const [answer, setAnswer] = useState([])
  
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Move block from Available to Answer Dropzone
  const handleSelect = (block) => {
    if (answer.length >= 4) return // Max 4 blocks allowed
    setAvailable(prev => prev.filter(b => b.id !== block.id))
    setAnswer(prev => [...prev, block])
  }

  // Move block back from Answer to Available
  const handleDeselect = (block) => {
    setAnswer(prev => prev.filter(b => b.id !== block.id))
    setAvailable(prev => [...prev, block])
  }

  // Check the pattern logic
  const handleCheck = () => {
    if (answer.length < 4) {
      setShowError(true)
      return
    }

    const isCorrect = answer.every((block, index) => block.id === TARGET_ORDER[index])

    if (isCorrect) {
      setShowSuccess(true)
    } else {
      setShowError(true)
    }
  }

  // Reset the puzzle after an error
  const handleRetry = () => {
    setAvailable(INITIAL_BLOCKS)
    setAnswer([])
    setShowError(false)
  }

  return (
    // ── Negative Margins & Mint Background (Like Image) ──
    <div className="logic-task-wrapper" style={{ 
      margin: '-32px', 
      padding: '24px 20px', 
      borderRadius: '32px', 
      background: '#98D8D8', // Mint/Teal background
      minHeight: '750px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: "'Nunito', sans-serif"
    }}>

      {/* ── 100% RESPONSIVE CSS INJECTED HERE ── */}
      <style>{`
        /* Desktop styles are inline, here are the Mobile overrides */
        @media (max-width: 768px) {
          .logic-task-wrapper {
            margin: -16px !important;
            padding: 16px 12px !important;
            border-radius: 24px !important;
            min-height: 85vh !important;
          }
          .task-header {
            font-size: 22px !important;
            margin: 8px 0 !important;
          }
          .instruction-box {
            padding: 12px !important;
            margin-bottom: 16px !important;
          }
          .instruction-title {
            font-size: 16px !important;
          }
          .instruction-hint {
            font-size: 11px !important;
          }
          .drop-zone {
            min-height: 200px !important;
            padding: 16px 12px !important;
            margin-bottom: 16px !important;
          }
          .drop-zone-title {
            font-size: 16px !important;
            margin: 0 0 16px !important;
          }
          
          /* Resize blocks for smaller screens */
          .shape-block {
            width: 54px !important;
            height: 54px !important;
            border-width: 2px !important;
          }
          .shape-block svg {
            width: 28px !important;
            height: 28px !important;
          }
          
          .blocks-container {
            gap: 8px !important;
          }
          .check-btn {
            padding: 14px 28px !important;
            font-size: 16px !important;
          }
          
          /* Modals */
          .modal-card {
            padding: 28px 20px !important;
            max-width: 90% !important;
          }
          .modal-title {
            font-size: 22px !important;
          }
        }

        @media (max-width: 480px) {
          .logic-task-wrapper {
            margin: -12px !important;
          }
          .shape-block {
            width: 48px !important;
            height: 48px !important;
          }
          .shape-block svg {
            width: 24px !important;
            height: 24px !important;
          }
          .task-header {
            font-size: 20px !important;
          }
        }
      `}</style>

      {/* ── SUCCESS MODAL ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
            <motion.div className="modal-card" initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ background: '#ffffff', borderRadius: 32, padding: '36px 24px', width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Trophy size={64} color="#FACC15" strokeWidth={1.5} />
              </div>
              <h2 className="modal-title" style={{ fontSize: 26, fontWeight: 900, color: '#1F2937', margin: '0 0 12px', fontFamily: "'Syne',sans-serif" }}>Brilliant!</h2>
              <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 8px', fontWeight: 700 }}>You cracked the pattern!</p>
              <p style={{ fontSize: 20, color: '#22C55E', margin: '0 0 28px', fontWeight: 900 }}>+{XP_MAP.logic} XP!</p>
              
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete}
                style={{ width: '100%', padding: '16px 10px', background: '#98D8D8', color: '#000', border: '2px solid #000', borderRadius: 99, fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 0 #000' }}>
                Back to Worldmap
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ERROR/INCORRECT MODAL ── */}
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
              <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 28px', fontWeight: 700 }}>That's not the right pattern.<br/>Let's do it again! 🔄</p>
              
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRetry}
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
          Pattern Puzzle Challenge!
        </h2>
      </div>

      {/* ── Instruction Box ── */}
      <div className="instruction-box" style={{ background: '#ffffff', padding: '16px', borderRadius: 16, width: '100%', margin: '0 auto 20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div className="instruction-title" style={{ fontSize: 18, fontWeight: 900, color: '#000', marginBottom: 8 }}>Arrange the blocks in order! 🎯</div>
        <div className="instruction-hint" style={{ fontSize: 12, fontWeight: 700, color: '#71717A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span>Drag and drop:</span> <span style={{ color: '#EF4444' }}>🔴</span> → <span style={{ color: '#3B82F6' }}>🟦</span> → <span style={{ color: '#F97316' }}>🔶</span> → <span style={{ color: '#EAB308' }}>⭐</span>
        </div>
      </div>

      {/* ── Drop Zone (Your Answer) ── */}
      <div className="drop-zone" style={{ background: '#F3F4F6', borderRadius: 16, padding: '20px 16px', minHeight: 260, position: 'relative', display: 'flex', flexDirection: 'column', border: '2px solid #E5E7EB', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02)', marginBottom: 24 }}>
        <h3 className="drop-zone-title" style={{ textAlign: 'center', margin: '0 0 20px', fontSize: 18, fontWeight: 900, color: '#000' }}>Your Answer:</h3>
        
        <div className="blocks-container" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', flex: 1, alignContent: 'center' }}>
          {answer.map((block) => (
            <motion.div className="shape-block" layoutId={block.id} key={block.id} onClick={() => handleDeselect(block)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ width: 64, height: 64, background: block.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${block.color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <block.icon size={36} color={block.color} fill={block.color} />
            </motion.div>
          ))}
        </div>

        {answer.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 11, fontWeight: 700, marginTop: 'auto', fontStyle: 'italic' }}>
            Click blocks below to add them here
          </div>
        )}
      </div>

      {/* ── Available Blocks ── */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 900, color: '#1A1A1A' }}>Available Blocks</h3>
        <div className="blocks-container" style={{ display: 'flex', justifyContent: 'center', gap: 12, minHeight: 70, flexWrap: 'wrap' }}>
          {available.map((block) => (
            <motion.div className="shape-block" layoutId={block.id} key={block.id} onClick={() => handleSelect(block)}
              whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}
              style={{ width: 64, height: 64, background: block.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${block.color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <block.icon size={36} color={block.color} fill={block.color} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Purple Check Button ── */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
        <motion.button 
          className="check-btn"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCheck}
          style={{ padding: '16px 40px', background: '#C4B5FD', color: '#000', border: '2px solid #000', borderRadius: 99, fontSize: 18, fontWeight: 900, cursor: 'pointer', fontFamily: "'Syne',sans-serif", boxShadow: '0 4px 0 #000', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Check Answer ✓
        </motion.button>
      </div>

    </div>
  )
}