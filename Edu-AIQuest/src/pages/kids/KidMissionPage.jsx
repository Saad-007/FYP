import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'

import VisualTask        from '../../components/kids/mission/VisualTask'
import StoryTask         from '../../components/kids/mission/StoryTask'
import LogicTask         from '../../components/kids/mission/LogicTask'
import BadgeCelebration  from '../../components/kids/mission/BadgeCelebration'
import TaskTabBar from '../../components/kids/Shared/TaskTabBar'
import { ZONE_CURRICULUM, XP_MAP } from '../../data/kids/zoneData'

const TASK_META = {
  visual: { label: 'Visual Task', emoji: '🎨', color: '#EC4899', xp: 50  },
  story:  { label: 'Story Task',  emoji: '🎙️', color: '#3B82F6', xp: 75  },
  logic:  { label: 'Logic Task',  emoji: '🧩', color: '#10B981', xp: 100 },
}
const ORDER = ['visual', 'story', 'logic']

export default function KidsMissionPage() {
  const { zoneId, taskType } = useParams()
  const navigate = useNavigate()
  const zone = ZONE_CURRICULUM[zoneId]

  const [activeTask, setActiveTask] = useState(ORDER.includes(taskType) ? taskType : 'visual')
  const [completed, setCompleted]   = useState([])
  const [totalXp, setTotalXp]       = useState(0)
  const [showBadge, setShowBadge]   = useState(false)

  useEffect(() => {
    if (taskType && ORDER.includes(taskType)) setActiveTask(taskType)
  }, [taskType])

  const handleComplete = useCallback(() => {
    setTotalXp(p => p + XP_MAP[activeTask])
    setCompleted(prev => {
      const next = prev.includes(activeTask) ? prev : [...prev, activeTask]
      if (next.length === ORDER.length) {
        setTimeout(() => setShowBadge(true), 400)
      } else {
        const nextTask = ORDER.find(t => !next.includes(t))
        if (nextTask) setTimeout(() => setActiveTask(nextTask), 500)
      }
      return next
    })
  }, [activeTask])

  if (!zone) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🤔</div>
        <button onClick={() => navigate('/kids/dashboard')}
          style={{ padding: '12px 24px', background: '#09090B', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>
          ← Back to Map
        </button>
      </div>
    </div>
  )

  const meta = TASK_META[activeTask]

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');*{box-sizing:border-box}`}</style>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', background: 'rgba(250,250,250,0.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E4E4E7' }}>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => navigate('/kids/dashboard')}
          style={{ background: '#F4F4F5', border: 'none', borderRadius: 10, padding: '7px 13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#52525B', fontWeight: 700, fontSize: 13, fontFamily: "'Nunito',sans-serif", flexShrink: 0 }}>
          <ArrowLeft size={15} /> Map
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>{zone.label}</div>
          <div style={{ fontSize: 11, color: '#71717A', fontWeight: 600 }}>Complete all 3 tasks to earn your badge</div>
        </div>
        {totalXp > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 99, padding: '5px 13px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Star size={12} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E', fontFamily: "'DM Mono',monospace" }}>+{totalXp} XP</span>
          </motion.div>
        )}
      </div>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '28px 20px 64px' }}>

        {/* Tab bar — component */}
        <TaskTabBar activeTask={activeTask} completed={completed} onSelect={setActiveTask} />

        {/* Task card */}
        <motion.div key={activeTask} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 26, padding: '28px 26px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>

          {/* Task header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <span style={{ fontSize: 22 }}>{meta.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.6, color: meta.color }}>{meta.label}</span>
              <div style={{ marginLeft: 'auto', background: `${meta.color}10`, border: `1px solid ${meta.color}30`, borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: meta.color, fontFamily: "'DM Mono',monospace" }}>+{meta.xp} XP</div>
            </div>
            <h2 style={{ fontSize: 'clamp(18px,3vw,22px)', fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>
              {zone[activeTask].title}
            </h2>
            {(zone[activeTask].instruction || zone[activeTask].scenario) && (
              <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 12, padding: '11px 14px', fontSize: 13, color: '#52525B', lineHeight: 1.6, display: 'flex', gap: 8 }}>
                <Sparkles size={14} color={meta.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{zone[activeTask].instruction || zone[activeTask].scenario}</span>
              </div>
            )}
          </div>

          {/* Task body */}
          <AnimatePresence mode="wait">
            {completed.includes(activeTask) ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>Task Completed!</div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 6 }}>You earned +{XP_MAP[activeTask]} XP</div>
                {completed.length < 3 && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTask(ORDER.find(t => !completed.includes(t)))}
                    style={{ marginTop: 18, padding: '12px 26px', background: zone.color, color: '#fff', border: 'none', borderRadius: 13, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    Next Task <ChevronRight size={15} />
                  </motion.button>
                )}
              </motion.div>
            ) : activeTask === 'visual' ? (
              <VisualTask key={`v-${zoneId}`} zone={zone} data={zone.visual} onComplete={handleComplete} />
            ) : activeTask === 'story' ? (
              <StoryTask  key={`s-${zoneId}`} zone={zone} data={zone.story}  onComplete={handleComplete} />
            ) : (
              <LogicTask  key={`l-${zoneId}`} zone={zone} data={zone.logic}  onComplete={handleComplete} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20, padding: '14px 20px', background: '#fff', border: '1px solid #E4E4E7', borderRadius: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#71717A' }}>Progress:</span>
          {ORDER.map(tid => (
            <div key={tid} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: completed.includes(tid) ? '#10B981' : activeTask === tid ? TASK_META[tid].color : '#E4E4E7', transition: 'background 0.3s' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: completed.includes(tid) ? '#10B981' : activeTask === tid ? TASK_META[tid].color : '#A1A1AA' }}>
                {TASK_META[tid].label}
              </span>
            </div>
          ))}
          <span style={{ fontSize: 12, fontWeight: 800, color: '#09090B', fontFamily: "'DM Mono',monospace" }}>{completed.length}/3</span>
        </div>
      </div>

      <AnimatePresence>
        {showBadge && <BadgeCelebration zone={zone} totalXp={totalXp} onDone={() => navigate('/kids/dashboard')} />}
      </AnimatePresence>
    </div>
  )
}