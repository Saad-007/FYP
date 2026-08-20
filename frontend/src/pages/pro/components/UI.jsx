import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Play, Lock, Clock, Zap, ArrowRight } from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { TYPE_CFG } from '../data/constants'

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color, bg }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, padding: '2px 7px',
    borderRadius: 5, color, background: bg,
    letterSpacing: '0.02em', whiteSpace: 'nowrap', display: 'inline-block',
  }}>
    {label}
  </span>
)

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, color, height = 4 }) => {
  const { C } = useTheme()
  return (
    <div style={{ width: '100%', height, background: C.border, borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%', background: color || C.accent, borderRadius: 99 }}
      />
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, Icon, accent, delay = 0 }) => {
  const { C } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28 }}
      style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
            {label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>{sub}</div>}
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} color={accent} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export const SectionHeader = ({ title, sub, action, onAction }) => {
  const { C } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} style={{ fontSize: 12, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}>
          {action}
        </button>
      )}
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, padding = '18px' }) => {
  const { C } = useTheme()
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding, ...style }}>
      {children}
    </div>
  )
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider = ({ my = 0 }) => {
  const { C } = useTheme()
  return <div style={{ width: '100%', height: 1, background: C.border, margin: `${my}px 0` }} />
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 22 }) => {
  const { C } = useTheme()
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
      style={{ width: size, height: size, border: `2px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%' }}
    />
  )
}

// ─── MODULE ROW ───────────────────────────────────────────────────────────────
export const ModuleRow = ({ mod, index, onStart }) => {
  const { C } = useTheme()
  const cfg      = TYPE_CFG[mod.type]
  const isDone   = mod.status === 'done'
  const isActive = mod.status === 'active'
  const isLocked = mod.status === 'locked'
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.22 }}
      onMouseEnter={() => !isLocked && setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => !isLocked && onStart(mod)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px',
        background: isActive ? C.raised : hov ? C.raised : 'transparent',
        border: `1px solid ${isActive ? C.borderL : hov ? C.border : 'transparent'}`,
        borderLeft: `2px solid ${isActive ? C.accent : 'transparent'}`,
        borderRadius: 10, cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.35 : 1, transition: 'all 0.15s', marginBottom: 2,
      }}
    >
      <div style={{ flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>
        {isDone   && <CheckCircle2 size={18} color={C.green} strokeWidth={2} />}
        {isActive && <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={8} color="#fff" fill="#fff" /></div>}
        {isLocked && <Lock size={15} color={C.faint} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isLocked ? C.faint : C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mod.title}
          </span>
          <Badge label={cfg.label} color={cfg.color} bg={cfg.bg} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {mod.dur}</span>
          <span style={{ fontSize: 11, color: C.amber, display: 'flex', alignItems: 'center', gap: 3 }}><Zap size={10} /> {mod.xp} XP</span>
        </div>
      </div>
      {isActive && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: C.accent, color: '#fff', padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600 }}>
          Continue <ArrowRight size={12} />
        </div>
      )}
    </motion.div>
  )
}
