import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Bot, Cpu, Terminal, Puzzle, Network, Palette,
  Mic, Calculator, Star, Flame, Map, Navigation,
  Lock, X, Pencil, MessageCircle, Layers, Trophy,
  CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react'

// ─── ZONES ──────────────────────────────────────────────────────────────────
const ZONES = [
  { id: 'what_is_ai',      label: 'AI Fundamentals',    icon: Bot,      color: '#3B82F6', x: 350, y: 850, unlocked: true  },
  { id: 'robots',          label: 'Logic Gates',        icon: Cpu,      color: '#8B5CF6', x: 650, y: 720, unlocked: true  },
  { id: 'coding_basics',   label: 'Coding Basics',      icon: Terminal, color: '#0EA5E9', x: 350, y: 590, unlocked: true  },
  { id: 'pattern_puzzles', label: 'Pattern Puzzles',    icon: Puzzle,   color: '#EC4899', x: 650, y: 460, unlocked: false },
  { id: 'smart_machines',  label: 'Neural Networks',    icon: Network,  color: '#10B981', x: 350, y: 330, unlocked: false },
  { id: 'ai_art',          label: 'Creative AI',        icon: Palette,  color: '#F59E0B', x: 650, y: 200, unlocked: false },
  { id: 'voice_bots',      label: 'Voice Synthesis',    icon: Mic,      color: '#06B6D4', x: 500, y: 80,  unlocked: false },
]

// ─── 3 TASK TYPES per zone ───────────────────────────────────────────────────
const TASK_TYPES = [
  {
    id: 'visual',
    label: 'Visual Task',
    sublabel: 'Draw the AI Component',
    icon: Pencil,
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FBCFE8',
    description: 'Draw shapes and AI components on the canvas. TensorFlow.js checks your work live!',
    badge: '🎨',
    xp: 50,
  },
  {
    id: 'story',
    label: 'Story Task',
    sublabel: 'Talk to Bot Companion',
    icon: MessageCircle,
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    description: 'Have a voice chat with your AI buddy! Answer questions by speaking into the mic.',
    badge: '🎙️',
    xp: 75,
  },
  {
    id: 'logic',
    label: 'Logic Task',
    sublabel: 'Pattern Puzzle',
    icon: Layers,
    color: '#10B981',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    description: 'Drag and drop the correct pieces to solve the AI puzzle. Think carefully!',
    badge: '🧩',
    xp: 100,
  },
]

// ─── MAP NODE ────────────────────────────────────────────────────────────────
const MapNode = ({ zone, selected, userTopics, onClick, index }) => {
  const unlocked = zone.unlocked || userTopics.includes(zone.id)
  const Icon = zone.icon
  const cx = zone.x, cy = zone.y
  const isSelected = selected?.id === zone.id

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
      style={{ cursor: unlocked ? 'pointer' : 'default', transformOrigin: `${cx}px ${cy}px` }}
      onClick={() => unlocked && onClick(zone)}
      whileHover={unlocked ? { scale: 1.08 } : {}}
    >
      {/* Pulse ring on selected */}
      {isSelected && unlocked && (
        <motion.circle cx={cx} cy={cy} r={52}
          fill="none" stroke={zone.color} strokeWidth={2.5}
          animate={{ r: [48, 56, 48], opacity: [0.6, 0.2, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Shadow */}
      <circle cx={cx} cy={cy + 6} r={36} fill="rgba(0,0,0,0.05)" />

      {/* White base */}
      <circle cx={cx} cy={cy} r={44} fill="#ffffff" />

      {/* Colored ring */}
      <circle cx={cx} cy={cy} r={38}
        fill={unlocked ? `${zone.color}12` : '#F4F4F5'}
        stroke={unlocked ? zone.color : '#D4D4D8'}
        strokeWidth={isSelected ? 3.5 : 2}
      />

      {/* Icon */}
      <foreignObject x={cx - 20} y={cy - 20} width={40} height={40}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {unlocked
            ? <Icon size={22} color={zone.color} strokeWidth={2.5} />
            : <Lock size={18} color="#A1A1AA" />}
        </div>
      </foreignObject>

      {/* Label */}
      <foreignObject className="node-label" x={cx - 90} y={cy - 82} width={180} height={36}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: '#fff', border: `1px solid ${unlocked ? '#E4E4E7' : '#F4F4F5'}`,
            borderRadius: 99, padding: '5px 12px', fontSize: 12, fontWeight: 700,
            color: unlocked ? '#09090B' : '#A1A1AA', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Nunito',sans-serif",
            whiteSpace: 'nowrap'
          }}>
            {unlocked && <div style={{ width: 6, height: 6, borderRadius: '50%', background: zone.color }} />}
            {zone.label}
          </div>
        </div>
      </foreignObject>
    </motion.g>
  )
}

// ─── MISSION PANEL — 3 TASK TYPES ────────────────────────────────────────────
const MissionPanel = ({ zone, completedTasks, onClose, onStartTask }) => {
  const Icon = zone.icon
  const allDone = TASK_TYPES.every(t => completedTasks.includes(`${zone.id}_${t.id}`))

  return (
    <motion.div className="responsive-panel"
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', stiffness: 380, damping: 35 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${zone.color}15`, border: `2px solid ${zone.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={zone.color} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
              Learning Mission
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
              {zone.label}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: '#F4F4F5', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', color: '#71717A' }}>
          <X size={20} />
        </button>
      </div>

      {/* Mission intro story text */}
      <div style={{ background: `${zone.color}08`, border: `1px solid ${zone.color}22`, borderRadius: 16, padding: '16px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Sparkles size={16} color={zone.color} />
          <span style={{ fontSize: 13, fontWeight: 800, color: zone.color }}>Mission Briefing</span>
        </div>
        <p style={{ fontSize: 13, color: '#52525B', lineHeight: 1.6, margin: 0 }}>
          Complete all 3 tasks below to master <strong>{zone.label}</strong> and unlock your badge! Each task tests a different skill.
        </p>
      </div>

      {/* XP reward banner */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Trophy size={20} color="#D97706" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Complete All 3 Tasks</div>
          <div style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>Unlock badge + earn bonus XP</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#D97706', fontFamily: "'DM Mono',monospace" }}>
          +{TASK_TYPES.reduce((a, t) => a + t.xp, 0)} XP
        </div>
      </div>

      {/* ── 3 TASK CARDS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TASK_TYPES.map((task, i) => {
          const TaskIcon = task.icon
          const done = completedTasks.includes(`${zone.id}_${task.id}`)
          return (
            <motion.div key={task.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: done ? task.bg : '#ffffff',
                border: `1.5px solid ${done ? task.color : '#E4E4E7'}`,
                borderRadius: 18, padding: '16px',
                boxShadow: done ? `0 4px 16px ${task.color}20` : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.3s'
              }}>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Task icon */}
                <div style={{ width: 44, height: 44, borderRadius: 14, background: done ? task.color : '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                  {done
                    ? <CheckCircle2 size={22} color="#fff" />
                    : <TaskIcon size={20} color={task.color} />}
                </div>

                {/* Task info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#09090B' }}>{task.label}</span>
                    <span style={{ fontSize: 18 }}>{task.badge}</span>
                  </div>
                  <div style={{ fontSize: 12, color: task.color, fontWeight: 700, marginBottom: 6 }}>
                    {task.sublabel}
                  </div>
                  <div style={{ fontSize: 12, color: '#71717A', lineHeight: 1.55 }}>
                    {task.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#71717A', fontFamily: "'DM Mono',monospace" }}>
                      +{task.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Start/Done button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => !done && onStartTask(zone.id, task.id)}
                style={{
                  marginTop: 14, width: '100%', padding: '11px',
                  background: done ? '#ffffff' : task.color,
                  border: done ? `1.5px solid ${task.color}` : 'none',
                  borderRadius: 12, fontSize: 14, fontWeight: 800,
                  color: done ? task.color : '#ffffff',
                  cursor: done ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: "'Nunito',sans-serif",
                  boxShadow: done ? 'none' : `0 4px 14px ${task.color}40`
                }}>
                {done ? (
                  <><CheckCircle2 size={16} /> Completed!</>
                ) : (
                  <>Start Task <ChevronRight size={16} /></>
                )}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* All done — badge unlock message */}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ marginTop: 20, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '2px solid #F59E0B', borderRadius: 18, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏅</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#92400E', fontFamily: "'Syne',sans-serif" }}>
              Badge Unlocked!
            </div>
            <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>
              You mastered {zone.label}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function KidsDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])
  const [xp] = useState(1450)
  const [level] = useState(4)
  const [streak] = useState(5)
  const xpToNext = 2000
  const xpPercent = Math.round((xp / xpToNext) * 100)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return navigate('/login')
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (!data?.username) return navigate('/profile-setup')
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [navigate])

  const handleStartTask = (zoneId, taskId) => {
    // Navigate to task page
    navigate(`/kids/mission/${zoneId}/${taskId}`)
  }

  const renderPaths = () => {
    return ZONES.map((zone, i) => {
      if (i === 0) return null
      const prev = ZONES[i - 1]
      const midX = (prev.x + zone.x) / 2 + (i % 2 === 0 ? 60 : -60)
      const midY = (prev.y + zone.y) / 2
      const d = `M ${prev.x} ${prev.y} Q ${midX} ${midY}, ${zone.x} ${zone.y}`
      return (
        <motion.path key={`path-${i}`} d={d} fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.15 }}
          stroke={zone.unlocked ? '#3B82F6' : '#E4E4E7'}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={zone.unlocked ? 'none' : '10 14'}
          opacity={zone.unlocked ? 0.4 : 0.5}
        />
      )
    })
  }

  if (loading) return null

  const userTopics = profile?.topics || []
  const completedZones = ZONES.filter(z =>
    TASK_TYPES.every(t => completedTasks.includes(`${z.id}_${t.id}`))
  ).length

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }

        .responsive-panel {
          position: fixed; top: 0; right: 0; bottom: 0; width: 440px;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(24px);
          border-left: 1px solid #E4E4E7;
          box-shadow: -20px 0 60px rgba(0,0,0,0.06);
          z-index: 100; padding: 32px 28px; overflow-y: auto;
        }

        @media (max-width: 768px) {
          .responsive-panel {
            width: 100%; height: 85vh; top: auto; right: 0; bottom: 0;
            border-left: none; border-top: 1px solid #E4E4E7;
            border-radius: 24px 24px 0 0;
            padding: 24px 20px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
          }
          .node-label { display: none; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ── TOP HUD ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 72, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E4E4E7' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={18} color="#fff" />
          </div>
          <span className="hide-mobile" style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
            EduAIQuest
          </span>
        </div>

        {/* XP Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 480, margin: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '4px 10px' }}>
            <Star size={13} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#92400E' }}>Lvl {level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 7, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }} />
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#71717A', fontWeight: 700, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>
            {xp} / {xpToNext} XP
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '4px 10px' }}>
            <Flame size={13} color="#EF4444" fill="#EF4444" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#EF4444' }}>{streak} day</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
            {(profile?.username || 'U')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── MAP CANVAS ── */}
      <div style={{ paddingTop: 72, width: '100%', height: '100vh', position: 'relative' }}>

        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#E4E4E7 1px, transparent 1px), linear-gradient(90deg, #E4E4E7 1px, transparent 1px)', backgroundSize: '44px 44px', opacity: 0.45 }} />

        <svg width="100%" height="calc(100vh - 72px)" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <filter id="blur-shadow">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {renderPaths()}
          {ZONES.map((zone, i) => (
            <MapNode key={zone.id} index={i} zone={zone} selected={selectedZone}
              userTopics={userTopics} onClick={setSelectedZone} />
          ))}
        </svg>

        {/* ── BOTTOM LEFT STATS ── */}
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ position: 'absolute', bottom: 28, left: 28, display: 'flex', gap: 14, zIndex: 30, flexWrap: 'wrap' }}>

          <div style={{ background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 16, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#F4F4F5', padding: 8, borderRadius: 10 }}><Map size={18} color="#09090B" /></div>
            <div>
              <div className="hide-mobile" style={{ fontSize: 10, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Progress</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>{completedZones} / {ZONES.length} Zones</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 16, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#FFFBEB', padding: 8, borderRadius: 10 }}><Trophy size={18} color="#D97706" /></div>
            <div>
              <div className="hide-mobile" style={{ fontSize: 10, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Total XP</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#D97706', fontFamily: "'DM Mono',monospace" }}>{xp} XP</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── MISSION PANEL ── */}
      <AnimatePresence>
        {selectedZone && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedZone(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.25)', zIndex: 90, backdropFilter: 'blur(4px)' }} />
            <MissionPanel
              zone={selectedZone}
              completedTasks={completedTasks}
              onClose={() => setSelectedZone(null)}
              onStartTask={handleStartTask}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}