import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Flame, Database, Cpu, Brain, Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { CAREER_TRACKS } from '../data/constants'
import { Badge, ProgressBar } from './UI'

const ICON_MAP = { Database, Cpu, Brain }

function TrackDropdown({ current, onSelect, onClose }) {
  const { C } = useTheme()
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.14 }}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 999,
        background: C.raised, border: `1px solid ${C.border}`,
        borderRadius: 12, overflow: 'hidden', minWidth: 270,
        boxShadow: '0 20px 48px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ padding: '9px 14px 7px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Switch Track</span>
      </div>
      {CAREER_TRACKS.map((t, i) => {
        const Icon = ICON_MAP[t.iconName]
        const isCurrent = current.id === t.id
        return (
          <div key={t.id} onClick={() => { onSelect(t); onClose() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
              cursor: 'pointer', background: isCurrent ? C.border : 'transparent',
              borderBottom: i < CAREER_TRACKS.length - 1 ? `1px solid ${C.border}` : 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = C.surface }}
            onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${t.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {Icon && <Icon size={15} color={t.accent} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.title}</span>
                <Badge label={t.level} color={t.accent} bg={`${t.accent}18`} />
              </div>
              <ProgressBar value={t.progress} color={t.accent} height={3} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: C.muted }}>{t.progress}%</span>
              {isCurrent && <CheckCircle2 size={13} color={C.green} />}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

export default function Topbar({ track, trackOpen, setTrackOpen, onTrackSelect, xp, xpMax, streak, level, onMobileMenuOpen, isMobile }) {
  const { C, isDark, toggle } = useTheme()
  const Icon = ICON_MAP[track.iconName]
  const xpPercent = Math.round((xp / xpMax) * 100)

  return (
    <div style={{
      height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0,
    }}>
      {/* Mobile hamburger */}
      {isMobile && (
        <button onClick={onMobileMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 4, borderRadius: 6, marginRight: 4 }}>
          <Menu size={20} />
        </button>
      )}

      {/* Track selector */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setTrackOpen(p => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: C.raised, border: `1px solid ${C.border}`,
            borderRadius: 9, padding: '6px 11px',
            cursor: 'pointer', color: C.text, fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', maxWidth: isMobile ? 150 : 'none',
          }}
        >
          {Icon && <Icon size={14} color={track.accent} style={{ flexShrink: 0 }} />}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</span>
          <ChevronDown size={13} color={C.muted} style={{ transform: trackOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
        </button>
        <AnimatePresence>
          {trackOpen && <TrackDropdown current={track} onSelect={onTrackSelect} onClose={() => setTrackOpen(false)} />}
        </AnimatePresence>
      </div>

      {/* XP bar — hidden on small mobile */}
      {!isMobile && (
        <>
          <div style={{ width: 1, height: 20, background: C.border, flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 320 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>LVL {level}</span>
            <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                style={{ height: '100%', background: C.accent, borderRadius: 99 }}
              />
            </div>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {xp.toLocaleString()} / {xpMax.toLocaleString()}
            </span>
          </div>
        </>
      )}

      {/* Right controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${C.red}18`, border: `1px solid ${C.red}28`, borderRadius: 7, padding: '5px 9px' }}>
          <Flame size={13} color={C.red} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>{streak}d</span>
        </div>

        {/* Theme toggle (topbar — mobile only) */}
        {isMobile && (
          <button
            onClick={toggle}
            style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {isDark ? <Sun size={14} color={C.muted} /> : <Moon size={14} color={C.muted} />}
          </button>
        )}
      </div>
    </div>
  )
}
