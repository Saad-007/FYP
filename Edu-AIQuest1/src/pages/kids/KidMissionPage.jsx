import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowLeft, Star, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'

import VisualTask        from '../../components/kids/mission/VisualTask'
import StoryTask         from '../../components/kids/mission/StoryTask'
import LogicTask         from '../../components/kids/mission/LogicTask'
import BadgeCelebration  from '../../components/kids/mission/BadgeCelebration'
import TaskTabBar        from '../../components/kids/Shared/TaskTabBar'
import AIMascot          from '../../components/kids/Shared/AIMascot'
import { ZONE_CURRICULUM, XP_MAP, TASK_TYPES } from '../../data/kids/zoneData'

// Helper component for dynamic vector icons
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle
  return <IconComponent size={size} color={color} {...props} />
}

const ORDER = ['visual', 'story', 'logic']

export default function KidMissionPage() {
  const { zoneId, taskType } = useParams()
  const navigate = useNavigate()
  const zone = ZONE_CURRICULUM[zoneId]

  const [userId, setUserId]         = useState(null)
  const [activeTask, setActiveTask] = useState(ORDER.includes(taskType) ? taskType : 'visual')
  const [completed, setCompleted]   = useState([])
  const [totalXp, setTotalXp]       = useState(0) // Total XP session mein kamayi
  const [showBadge, setShowBadge]   = useState(false)

  // ── ARIA Mascot State Controller ──
  const [ariaMode, setAriaMode] = useState('idle')
  const [ariaMsg, setAriaMsg]   = useState(null)
  const ariaTimerRef = useRef(null)

  const triggerAria = useCallback((mode, msg, revertTime = 4000) => {
    setAriaMode(mode)
    setAriaMsg(msg)
    if (ariaTimerRef.current) clearTimeout(ariaTimerRef.current)
    if (revertTime) {
      ariaTimerRef.current = setTimeout(() => {
        setAriaMode('idle')
        setAriaMsg(null)
      }, revertTime)
    }
  }, [])

  // Initial Entry ARIA Greeting & Load User Data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        
        // Pehle se complete kiye hue tasks is zone ke load karo taake progress strip theek dikhe
        const savedProgress = localStorage.getItem(`eduai_progress_${session.user.id}`)
        if (savedProgress) {
          const p = JSON.parse(savedProgress)
          // Find tasks that belong to this zone
          const thisZoneTasks = (p.completedTasks || [])
            .filter(t => t.startsWith(`${zoneId}_`))
            .map(t => t.replace(`${zoneId}_`, ''))
          
          setCompleted(thisZoneTasks)
        }
      }
      if (zone) {
        triggerAria('thinking', `Briefing incoming for ${zone.label}...`, 4000)
      }
    }
    init()
  }, [zone, zoneId, triggerAria])

  // Sync Active Task from URL
  useEffect(() => {
    if (taskType && ORDER.includes(taskType)) {
      setActiveTask(taskType)
      const taskMeta = TASK_TYPES.find(t => t.id === taskType)
      triggerAria('idle', `Let's tackle the ${taskMeta?.label}!`, 4000)
    }
  }, [taskType, triggerAria])

  // ── GLOBAL SAVE LOGIC ──
  const saveProgressGlobally = useCallback((taskId, earnedXp) => {
    if (!userId) return;
    
    // 1. Save XP and Task to Dashboard Progress
    const progressKey = `eduai_progress_${userId}`
    let currentProgress = { xp: 0, level: 1, completedTasks: [] }
    
    try {
      const saved = localStorage.getItem(progressKey)
      if (saved) currentProgress = JSON.parse(saved)
    } catch(e){}

    const fullTaskId = `${zoneId}_${taskId}`
    if (!currentProgress.completedTasks.includes(fullTaskId)) {
      currentProgress.completedTasks.push(fullTaskId)
      currentProgress.xp += earnedXp
      
      // Basic Leveling Logic (1000 XP = 1 Level)
      currentProgress.level = Math.floor(currentProgress.xp / 1000) + 1
      
      localStorage.setItem(progressKey, JSON.stringify(currentProgress))
    }

    // 2. Add Bonus Gems to Shop Economy
    const shopKey = `eduai_shop_${userId}`
    let currentShop = { gems: 250, ownedItems: [], activeFrame: null, activeTheme: null }
    try {
      const savedShop = localStorage.getItem(shopKey)
      if (savedShop) currentShop = JSON.parse(savedShop)
    } catch(e){}

    // Every task gives 15 Gems!
    currentShop.gems = (currentShop.gems || 0) + 15
    localStorage.setItem(shopKey, JSON.stringify(currentShop))

  }, [userId, zoneId])


  const handleComplete = useCallback(() => {
    const xpEarned = XP_MAP[activeTask]
    setTotalXp(p => p + xpEarned)
    
    // Save to LocalStorage immediately
    saveProgressGlobally(activeTask, xpEarned)

    // ARIA Reacts to Task Completion
    triggerAria('happy', `+${xpEarned} XP & 15 Gems earned! You're on fire!`, 4000)

    setCompleted(prev => {
      const next = prev.includes(activeTask) ? prev : [...prev, activeTask]
      
      // If all 3 tasks are done!
      if (next.length === ORDER.length) {
        setTimeout(() => {
          setShowBadge(true)
          // ARIA Reacts to Full Zone Completion
          triggerAria('happy', "Zone complete! You're a true AI Hero!", 8000)
        }, 400)
      } else {
        // Move to next available task
        const nextTask = ORDER.find(t => !next.includes(t))
        if (nextTask) setTimeout(() => setActiveTask(nextTask), 500)
      }
      return next
    })
  }, [activeTask, triggerAria, saveProgressGlobally])

  // Fallback if Zone is missing
  if (!zone) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito',sans-serif", background: '#FAFAFA' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🚀</div>
        <button onClick={() => navigate('/kids/dashboard')}
          style={{ padding: '14px 28px', background: '#09090B', color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', fontWeight: 800 }}>
          ← Back to Map
        </button>
      </div>
    </div>
  )

  const meta = TASK_TYPES.find(t => t.id === activeTask)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif" }}>
      {/* ── 100% RESPONSIVE CSS INJECTED HERE ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');
        
        /* Responsive Overrides */
        @media (max-width: 768px) {
          .top-bar-container { padding: 0 12px !important; gap: 8px !important; }
          .top-bar-subtitle { display: none !important; } /* Hide extra text on mobile */
          .top-bar-title { font-size: 14px !important; }
          .top-bar-back-btn { padding: 6px 10px !important; font-size: 12px !important; gap: 4px !important; }
          .top-bar-xp { padding: 6px 10px !important; font-size: 11px !important; gap: 4px !important; }
          
          .main-content { padding: 20px 12px 80px !important; }
          .task-container { padding: 20px 16px !important; border-radius: 24px !important; }
          
          .task-header-meta { flex-wrap: wrap; gap: 8px !important; margin-bottom: 16px !important; }
          .task-xp-badge { margin-left: 0 !important; } /* Stack nicely on very small screens */
          
          .instruction-box { flex-direction: column !important; gap: 8px !important; padding: 12px 16px !important; }
          .instruction-box svg { display: none !important; } /* Hide icon to save space */
          
          .progress-strip { flex-wrap: wrap !important; gap: 12px !important; padding: 12px 16px !important; border-radius: 16px !important; }
        }

        @media (max-width: 480px) {
          .progress-label-text { display: none !important; } /* Hide 'PROGRESS' text on tiny screens */
          .progress-strip { gap: 8px !important; justify-content: space-around !important; }
          .progress-strip span { font-size: 10px !important; }
        }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="top-bar-container" style={{ position: 'sticky', top: 0, zIndex: 50, height: 70, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: 'rgba(250,250,250,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E4E4E7', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <motion.button className="top-bar-back-btn" whileTap={{ scale: 0.93 }} onClick={() => navigate('/kids/dashboard')}
          style={{ background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 12, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#52525B', fontWeight: 800, fontSize: 14, fontFamily: "'Nunito',sans-serif", flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Map
        </motion.button>
        <div style={{ flex: 1 }}>
          <div className="top-bar-title" style={{ fontSize: 16, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>{zone.label}</div>
          <div className="top-bar-subtitle" style={{ fontSize: 12, color: '#71717A', fontWeight: 700 }}>Complete all 3 tasks to earn your badge</div>
        </div>
        {totalXp > 0 && (
          <motion.div className="top-bar-xp" initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(217,119,6,0.1)' }}>
            <Star size={14} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#92400E', fontFamily: "'DM Mono',monospace" }}>+{totalXp} XP Session</span>
          </motion.div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="main-content" style={{ maxWidth: 780, margin: '0 auto', padding: '32px 20px 80px' }}>
        
        {/* Tab bar */}
        <TaskTabBar activeTask={activeTask} completed={completed} onSelect={(id) => {
           setActiveTask(id)
           triggerAria('idle', `Switched to ${TASK_TYPES.find(t=>t.id===id).label}`, 3000)
        }} zoneId={zoneId} />

        {/* Task Container */}
        <motion.div className="task-container" key={activeTask} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 32, padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>

          {/* Task Header */}
          <div style={{ marginBottom: 28 }}>
            <div className="task-header-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ background: `${meta.color}15`, padding: 10, borderRadius: 14 }}>
                <DynamicIcon name={meta.icon || meta.badgeIcon} size={22} color={meta.color} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6, color: meta.color }}>{meta.label}</span>
              <div className="task-xp-badge" style={{ marginLeft: 'auto', background: `${meta.color}0D`, border: `1px solid ${meta.color}30`, borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 900, color: meta.color, fontFamily: "'DM Mono',monospace" }}>+{meta.xp} XP</div>
            </div>
            
            <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              {zone[activeTask]?.title || "Task Title"}
            </h2>
            
            {(zone[activeTask]?.instruction || zone[activeTask]?.scenario) && (
              <div className="instruction-box" style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 16, padding: '16px 20px', fontSize: 14, color: '#52525B', lineHeight: 1.6, display: 'flex', gap: 12, fontWeight: 600 }}>
                <Sparkles size={18} color={meta.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{zone[activeTask].instruction || zone[activeTask].scenario}</span>
              </div>
            )}
          </div>

          {/* Task Interactive Body */}
          <AnimatePresence mode="wait">
            {completed.includes(activeTask) ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '6px solid #DCFCE7', boxShadow: '0 10px 30px rgba(16,185,129,0.2)' }}>
                  <CheckCircle2 size={44} color="#ffffff" strokeWidth={3} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>Task Completed!</div>
                <div style={{ fontSize: 15, color: '#71717A', fontWeight: 600 }}>You earned <span style={{ color: '#10B981', fontWeight: 800 }}>+{XP_MAP[activeTask]} XP</span></div>
                
                {completed.length < 3 && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTask(ORDER.find(t => !completed.includes(t)))}
                    style={{ marginTop: 32, padding: '18px 36px', background: zone.color, color: '#ffffff', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: `0 10px 25px ${zone.glow}` }}>
                    Next Task <ChevronRight size={18} strokeWidth={3} />
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

        {/* Progress Strip */}
        <div className="progress-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24, padding: '18px 24px', background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <span className="progress-label-text" style={{ fontSize: 13, fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1 }}>Progress</span>
          {ORDER.map(tid => {
            const tMeta = TASK_TYPES.find(t => t.id === tid)
            return (
              <div key={tid} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: completed.includes(tid) ? '#10B981' : activeTask === tid ? tMeta.color : '#F4F4F5', border: `2px solid ${completed.includes(tid) ? '#10B981' : activeTask === tid ? tMeta.color : '#E4E4E7'}`, transition: 'all 0.3s' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: completed.includes(tid) ? '#10B981' : activeTask === tid ? tMeta.color : '#A1A1AA' }}>
                  {tMeta.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {showBadge && <BadgeCelebration zone={zone} totalXp={totalXp} onDone={() => navigate('/kids/dashboard')} />}
      </AnimatePresence>

      {/* ── ARIA MASCOT ── */}
      <AIMascot mode={ariaMode} customMessage={ariaMsg} isActive={ariaMode === 'happy'} />

    </div>
  )
}