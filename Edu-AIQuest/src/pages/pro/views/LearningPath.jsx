import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitMerge, BookOpen, Code2, FlaskConical, Database, Cpu, Brain } from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { MODULES_DATA, TYPE_CFG } from '../data/constants'
import { ProgressBar, ModuleRow } from '../components/UI'

const TRACK_ICON = { Database, Cpu, Brain }
const TYPE_ICONS = { theory: BookOpen, coding: Code2, scenario: FlaskConical }

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 640)
  useEffect(() => { const h = () => setM(window.innerWidth < 640); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  return m
}

export default function LearningPath({ track, modules: modulesProp, onOpenWorkspace, onOpenWorkspaceDirect }) {
  const { C } = useTheme()
  const isMobile = useIsMobile()
  const modules = modulesProp?.length ? modulesProp : (MODULES_DATA[track.id] || MODULES_DATA.data_scientist)
  const done    = modules.filter(m => m.status === 'done').length

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: C.text, marginBottom: 3 }}>Learning Path</h1>
        <p style={{ fontSize: 12, color: C.muted }}>{track.title} · {done} of {modules.length} modules complete</p>
      </div>

      {/* Phase banner */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? '12px 14px' : '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${track.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GitMerge size={16} color={track.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Phase 3: Pro Career Learning (Age 16+)</div>
          <ProgressBar value={track.progress} color={track.accent} height={4} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: track.accent, flexShrink: 0 }}>{track.progress}%</span>
      </motion.div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
        {Object.entries(TYPE_CFG).map(([key, cfg]) => {
          const Icon = TYPE_ICONS[key]
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon size={12} color={cfg.color} />
              <span style={{ fontSize: 11, color: C.muted }}>{cfg.label}</span>
            </div>
          )
        })}
      </div>

      {/* Module list */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '6px' }}>
        {modules.map((m, i) => <ModuleRow key={m.id} mod={m} index={i} onStart={onOpenWorkspace} />)}
      </div>

      <div style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: C.faint }}>
        Complete the active module to unlock the next step
      </div>
    </div>
  )
}
