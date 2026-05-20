/**
 * KidsDashboard.jsx  —  Edu AI-Quest (Kids Mode)
 * Route: /kids/dashboard
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Bot, Database, GitBranch, Brain, Eye, MessageSquare,
  Palette, Shield, Star, Flame, Navigation,
  Lock, X, Trophy, CheckCircle2, ChevronRight,
  Sparkles, LogOut, Zap, ArrowDown, Map,
  Rocket, Search, Paintbrush, Mic, Puzzle,
  Award, Medal, Compass, ShieldCheck
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// CURRICULUM ROADMAP — Premium Icons Replaced Emojis
// ─────────────────────────────────────────────────────────────────────────────
const ZONES = [
  {
    id: 'ai_explorer',
    order: 1,
    label: 'AI Explorer',
    sublabel: 'What is AI?',
    description: 'Discover what makes AI special! Learn how machines think differently from calculators and understand the magic behind learning algorithms.',
    icon: Bot,
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.28)',
    badgeIcon: Rocket, // Replaced emoji
    side: 'left',
  },
  {
    id: 'data_detectives',
    order: 2,
    label: 'Data Detectives',
    sublabel: 'Pattern Recognition',
    description: 'Become a data detective! Learn how AI finds hidden patterns in mountains of data to make smart predictions about the world.',
    icon: Database,
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.28)',
    badgeIcon: Search, // Replaced emoji
    side: 'right',
  },
  {
    id: 'algorithm_logic',
    order: 3,
    label: 'Algorithm Logic',
    sublabel: 'Step-by-step Thinking',
    description: 'Master logical thinking! Understand how data flows through decision trees and logic gates that power all intelligent systems.',
    icon: GitBranch,
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.28)',
    badgeIcon: Zap, // Replaced emoji
    side: 'left',
  },
  {
    id: 'machine_learning',
    order: 4,
    label: 'Machine Learning',
    sublabel: 'Training the AI',
    description: 'Train your own AI! Learn how supervised learning works — feeding examples to a machine until it becomes a true expert.',
    icon: Brain,
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.28)',
    badgeIcon: Brain, // Replaced emoji
    side: 'right',
  },
  {
    id: 'computer_vision',
    order: 5,
    label: 'Computer Vision',
    sublabel: 'How AI Sees',
    description: 'Give AI eyes! Discover how machines convert images into pixel grids, detect edges, and recognize faces and objects in photos.',
    icon: Eye,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.28)',
    badgeIcon: Eye, // Replaced emoji
    side: 'left',
  },
  {
    id: 'talking_bots',
    order: 6,
    label: 'Talking Bots',
    sublabel: 'NLP & Voice',
    description: 'Unlock the power of language! Learn how AI understands human speech, detects sentiment, and generates smart conversational replies.',
    icon: MessageSquare,
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.28)',
    badgeIcon: MessageSquare, // Replaced emoji
    side: 'right',
  },
  {
    id: 'creative_studio',
    order: 7,
    label: 'Creative Studio',
    sublabel: 'Generative AI',
    description: 'Unleash AI creativity! Explore how diffusion models generate stunning art, music, and text from a simple text prompt.',
    icon: Palette,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.28)',
    badgeIcon: Palette, // Replaced emoji
    side: 'left',
  },
  {
    id: 'hero_rules',
    order: 8,
    label: 'Hero Rules',
    sublabel: 'AI Ethics',
    description: 'Become an AI Hero! Understand deepfakes, algorithmic bias, data privacy, and how to use AI responsibly for a better world.',
    icon: Shield,
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.28)',
    badgeIcon: ShieldCheck, // Replaced emoji
    side: 'right',
  },
]

const TASK_TYPES = [
  { id: 'visual', label: 'Visual Task',  badgeIcon: Paintbrush, color: '#EC4899', bg: '#FDF2F8', xp: 50,  desc: 'Drag & Drop Challenge' },
  { id: 'story',  label: 'Story Task',   badgeIcon: Mic,        color: '#3B82F6', bg: '#EFF6FF', xp: 75,  desc: 'Voice & Chat Mission'  },
  { id: 'logic',  label: 'Logic Task',   badgeIcon: Puzzle,     color: '#10B981', bg: '#F0FDF4', xp: 100, desc: 'Puzzle & Flowchart'     },
]

const ZONE_XP = TASK_TYPES.reduce((a, t) => a + t.xp, 0) // 225 per zone
const XP_PER_LEVEL = 500

// ─── helpers ─────────────────────────────────────────────────────────────────
const zoneComplete = (id, done) => TASK_TYPES.every(t => done.includes(`${id}_${t.id}`))
const zoneUnlocked = (zone, done) => {
  if (zone.order === 1) return true
  const prev = ZONES.find(z => z.order === zone.order - 1)
  return zoneComplete(prev.id, done)
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSION PANEL
// ─────────────────────────────────────────────────────────────────────────────
function MissionPanel({ zone, completedTasks, onClose, onStartTask }) {
  const Icon = zone.icon
  const BadgeIcon = zone.badgeIcon
  const allDone = zoneComplete(zone.id, completedTasks)
  const tasksDone = TASK_TYPES.filter(t => completedTasks.includes(`${zone.id}_${t.id}`)).length

  return (
    <motion.div className="mission-panel"
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '110%' }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 17, background: `${zone.color}12`, border: `2px solid ${zone.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={26} color={zone.color} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 3 }}>
              Zone {zone.order} · Mission
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.4px', lineHeight: 1.15 }}>
              {zone.label}
            </div>
            <div style={{ fontSize: 12, color: zone.color, fontWeight: 700, marginTop: 2 }}>{zone.sublabel}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: '#F4F4F5', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#71717A', flexShrink: 0 }}>
          <X size={18} />
        </button>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#71717A' }}>Zone Progress</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: zone.color, fontFamily: "'DM Mono',monospace" }}>{tasksDone}/3 Tasks</span>
        </div>
        <div style={{ height: 7, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(tasksDone / 3) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${zone.color},${zone.color}88)` }} />
        </div>
      </div>

      {/* Briefing */}
      <div style={{ background: `${zone.color}08`, border: `1px solid ${zone.color}20`, borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <Sparkles size={14} color={zone.color} />
          <span style={{ fontSize: 11, fontWeight: 800, color: zone.color, textTransform: 'uppercase', letterSpacing: 1.2 }}>Mission Briefing</span>
        </div>
        <p style={{ fontSize: 13, color: '#52525B', lineHeight: 1.65, margin: 0 }}>{zone.description}</p>
      </div>

      {/* XP Banner */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 13, padding: '11px 15px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Trophy size={19} color="#D97706" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Complete All 3 Tasks</div>
          <div style={{ fontSize: 11, color: '#71717A', marginTop: 1 }}>
            Earn badge · {zone.order < 8 ? `Unlock Zone ${zone.order + 1}` : 'Complete the roadmap!'}
          </div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 900, color: '#D97706', fontFamily: "'DM Mono',monospace" }}>+{ZONE_XP} XP</div>
      </div>

      {/* 3 Task Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TASK_TYPES.map((task, i) => {
          const TaskBadgeIcon = task.badgeIcon
          const done = completedTasks.includes(`${zone.id}_${task.id}`)
          const locked = !done && i > 0 && !completedTasks.includes(`${zone.id}_${TASK_TYPES[i - 1].id}`)

          return (
            <motion.div key={task.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: done ? task.bg : '#fff',
                border: `1.5px solid ${done ? task.color + '66' : locked ? '#F4F4F5' : '#E4E4E7'}`,
                borderRadius: 18, padding: '15px',
                opacity: locked ? 0.5 : 1,
                boxShadow: done ? `0 4px 18px ${task.color}18` : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.25s',
              }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, background: done ? task.color : locked ? '#F4F4F5' : `${task.color}12`, border: `1.5px solid ${done ? task.color : locked ? '#E4E4E7' : task.color + '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done ? <CheckCircle2 size={21} color="#fff" /> : locked ? <Lock size={16} color="#C4C4C4" /> : <TaskBadgeIcon size={20} color={task.color} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: locked ? '#A1A1AA' : '#09090B', marginBottom: 2 }}>{task.label}</div>
                  <div style={{ fontSize: 12, color: locked ? '#C4C4C4' : task.color, fontWeight: 700 }}>{task.desc}</div>
                </div>
                <div style={{ background: done ? task.color : '#F4F4F5', color: done ? '#fff' : '#71717A', borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 800, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>
                  +{task.xp}XP
                </div>
              </div>

              <motion.button
                whileHover={!done && !locked ? { scale: 1.02 } : {}}
                whileTap={!done && !locked ? { scale: 0.97 } : {}}
                onClick={() => !done && !locked && onStartTask(zone.id, task.id)}
                style={{ width: '100%', padding: '11px', background: done ? '#F0FDF4' : locked ? '#F9F9F9' : task.color, border: `1.5px solid ${done ? '#86EFAC' : locked ? '#E4E4E7' : 'transparent'}`, borderRadius: 12, fontSize: 14, fontWeight: 800, color: done ? '#16A34A' : locked ? '#A1A1AA' : '#fff', cursor: done || locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Nunito',sans-serif", boxShadow: !done && !locked ? `0 4px 14px ${task.color}38` : 'none', transition: 'all 0.2s' }}>
                {done ? <><CheckCircle2 size={15} /> Completed!</>
                  : locked ? <><Lock size={14} /> Complete previous task first</>
                    : <>Start Task <ChevronRight size={15} /></>}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Badge unlock */}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ marginTop: 20, background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '2px solid #FDE68A', borderRadius: 20, padding: '24px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(245,158,11,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F59E0B', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                <BadgeIcon size={32} color="#fff" />
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#92400E', fontFamily: "'Syne',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              Zone Badge Unlocked! <Award size={18} color="#D97706" />
            </div>
            <div style={{ fontSize: 13, color: '#78350F', marginTop: 5 }}>
              {zone.order < 8 ? `Zone ${zone.order + 1} is now unlocked!` : "You've completed the entire roadmap!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONE CIRCLE — center node on the path
// ─────────────────────────────────────────────────────────────────────────────
function ZoneCircle({ zone, unlocked, completed, isSelected, index, onClick }) {
  const Icon = zone.icon
  const BadgeIcon = zone.badgeIcon
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
      onClick={onClick}
      whileHover={unlocked ? { scale: 1.1 } : {}}
      style={{
        position: 'relative', width: 70, height: 70, borderRadius: '50%', zIndex: 10,
        background: completed ? `linear-gradient(135deg,${zone.color},${zone.color}BB)` : unlocked ? '#fff' : '#F4F4F5',
        border: `3.5px solid ${completed ? zone.color : isSelected ? zone.color : unlocked ? zone.color + '55' : '#E4E4E7'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: unlocked ? 'pointer' : 'default',
        boxShadow: completed ? `0 6px 22px ${zone.glow}, 0 0 0 6px ${zone.color}14` : isSelected ? `0 6px 20px ${zone.glow}` : unlocked ? '0 3px 14px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s',
      }}>

      {isSelected && unlocked && (
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `2px solid ${zone.color}` }} />
      )}

      {/* Completed Icon replacing emoji */}
      {completed ? <BadgeIcon size={30} color="#fff" />
        : unlocked ? <Icon size={26} color={isSelected ? zone.color : zone.color + 'BB'} strokeWidth={1.8} />
          : <Lock size={20} color="#C4C4C4" />}

      {/* order chip */}
      <div style={{ position: 'absolute', top: -5, left: -5, width: 22, height: 22, borderRadius: '50%', background: unlocked ? zone.color : '#D4D4D8', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: "'DM Mono',monospace" }}>
        {zone.order}
      </div>

      {completed && (
        <div style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: '#10B981', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={12} color="#fff" strokeWidth={3} />
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONE CARD — the info card left or right of the center node
// ─────────────────────────────────────────────────────────────────────────────
function ZoneCard({ zone, unlocked, completed, isSelected, completedTasks, onClick }) {
  const Icon = zone.icon
  const BadgeIcon = zone.badgeIcon
  const tasksDone = TASK_TYPES.filter(t => completedTasks.includes(`${zone.id}_${t.id}`)).length

  return (
    <motion.div
      initial={{ opacity: 0, x: zone.side === 'left' ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: zone.order * 0.06 }}
      onClick={onClick}
      whileHover={unlocked ? { scale: 1.03, y: -2 } : {}}
      style={{
        width: '100%', maxWidth: 230,
        background: completed ? `${zone.color}08` : isSelected ? `${zone.color}06` : '#fff',
        border: `2px solid ${completed ? zone.color + '44' : isSelected ? zone.color : unlocked ? '#E4E4E7' : '#F4F4F5'}`,
        borderRadius: 18, padding: '15px',
        cursor: unlocked ? 'pointer' : 'default',
        opacity: unlocked ? 1 : 0.42,
        boxShadow: isSelected ? `0 8px 26px ${zone.glow}` : completed ? `0 4px 16px ${zone.color}14` : '0 2px 10px rgba(0,0,0,0.04)',
        transition: 'all 0.25s',
      }}>

      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: completed ? zone.color : `${zone.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Replaced emoji with premium Icon */}
            {completed ? <BadgeIcon size={16} color="#fff" /> : <Icon size={15} color={unlocked ? zone.color : '#C4C4C4'} />}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: unlocked ? '#09090B' : '#A1A1AA', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.2px', lineHeight: 1.2 }}>{zone.label}</div>
            <div style={{ fontSize: 10, color: unlocked ? zone.color : '#D4D4D8', fontWeight: 700 }}>{zone.sublabel}</div>
          </div>
        </div>
        {!unlocked && <Lock size={13} color="#D4D4D8" />}
        {completed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 99, padding: '2px 7px' }}>
            <CheckCircle2 size={10} color="#065F46" />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#065F46' }}>DONE</span>
          </div>
        )}
      </div>

      {/* task progress pips */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {TASK_TYPES.map(t => (
          <div key={t.id}
            style={{ height: 5, flex: 1, borderRadius: 99, background: completedTasks.includes(`${zone.id}_${t.id}`) ? zone.color : unlocked ? '#E4E4E7' : '#F4F4F5', transition: 'background 0.3s' }} />
        ))}
        <span style={{ fontSize: 9, color: '#A1A1AA', fontWeight: 700, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>{tasksDone}/3</span>
      </div>

      {/* CTA */}
      {unlocked && !completed && (
        <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 3, color: zone.color }}>
          <ChevronRight size={12} />
          <span style={{ fontSize: 10, fontWeight: 800 }}>Tap to open</span>
        </div>
      )}
      {completed && (
        <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 3, color: '#10B981' }}>
          <CheckCircle2 size={12} />
          <span style={{ fontSize: 10, fontWeight: 800 }}>+{ZONE_XP} XP earned</span>
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function KidsDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak] = useState(5)

  const xpInLevel = xp % XP_PER_LEVEL
  const xpPercent = Math.round((xpInLevel / XP_PER_LEVEL) * 100)
  const completedZonesCount = ZONES.filter(z => zoneComplete(z.id, completedTasks)).length

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return navigate('/login')
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (!data?.username) return navigate('/profile-setup')
        setProfile(data)
        // Load progress (localStorage until Supabase user_progress table is ready)
        const saved = localStorage.getItem(`eduai_progress_${session.user.id}`)
        if (saved) {
          const p = JSON.parse(saved)
          setCompletedTasks(p.completedTasks || [])
          setXp(p.xp || 0)
          setLevel(p.level || 1)
        }
      } catch { navigate('/login') }
      finally { setLoading(false) }
    }
    load()
  }, [navigate])

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login') }
  const handleStartTask = (zoneId, taskId) => navigate(`/kids/mission/${zoneId}/${taskId}`)

  const toggleZone = (zone) => {
    if (!zoneUnlocked(zone, completedTasks)) return
    setSelectedZone(prev => prev?.id === zone.id ? null : zone)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}>
        <Zap size={38} color="#3B82F6" fill="#3B82F6" />
      </motion.div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }

        .mission-panel {
          position: fixed; top: 0; right: 0; bottom: 0; width: 420px;
          background: rgba(255,255,255,0.98); backdrop-filter: blur(24px);
          border-left: 1px solid #E4E4E7;
          box-shadow: -24px 0 60px rgba(0,0,0,0.07);
          z-index: 100; padding: 28px 24px; overflow-y: auto;
        }

        @media (max-width: 700px) {
          .mission-panel {
            width: 100%; height: 88vh; top: auto; right: 0; bottom: 0;
            border-left: none; border-top: 1px solid #E4E4E7;
            border-radius: 24px 24px 0 0; padding: 20px 18px;
            box-shadow: 0 -16px 48px rgba(0,0,0,0.12);
          }
          .hide-sm { display: none !important; }
          .roadmap-row { grid-template-columns: 1fr !important; }
          .roadmap-spacer { display: none !important; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 4px; }
      `}</style>

      {/* ══ TOP HUD ════════════════════════════════════════════════════════ */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E4E4E7', gap: 14 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={16} color="#fff" />
          </div>
          <span className="hide-sm" style={{ fontSize: 17, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.4px' }}>
            EduAI<span style={{ color: '#3B82F6' }}>Quest</span>
          </span>
        </div>

        {/* XP bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 7, padding: '4px 9px', flexShrink: 0 }}>
            <Star size={12} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>Lv.{level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 7, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#3B82F6,#06B6D4)' }} />
            </div>
          </div>
          <span className="hide-sm" style={{ fontSize: 11, color: '#71717A', fontWeight: 700, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>
            {xpInLevel}/{XP_PER_LEVEL}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '4px 9px' }}>
            <Flame size={12} color="#EF4444" fill="#EF4444" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#EF4444' }}>{streak}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 7, padding: '4px 9px' }}>
            <Trophy size={11} color="#16A34A" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', fontFamily: "'DM Mono',monospace" }}>{xp}XP</span>
          </div>
          <div style={{ width: 33, height: 33, borderRadius: 9, background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', cursor: 'pointer' }}>
            {(profile?.username || 'U')[0].toUpperCase()}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
            style={{ background: '#F4F4F5', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#71717A', display: 'flex' }}>
            <LogOut size={14} />
          </motion.button>
        </div>
      </div>

      {/* ══ SCROLLABLE MAP ════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 99, padding: '5px 14px', marginBottom: 14 }}>
            <Map size={13} color="#3B82F6" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 1.2 }}>AI Learning Roadmap</span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.6px', lineHeight: 1.1, margin: '0 0 10px' }}>
            Welcome back,{' '}
            <span style={{ background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              @{profile?.username}
            </span>! 👋
          </h1>
          <p style={{ fontSize: 13, color: '#71717A', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {completedZonesCount === 0
              ? <>Start your AI adventure — tap Zone 1 to begin! <Rocket size={14} color="#3B82F6" /></>
              : `${completedZonesCount}/8 zones mastered · Keep going!`}
          </p>
        </motion.div>

        {/* Overall progress */}
        <div style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 18, padding: '16px 20px', marginBottom: 44, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Overall Roadmap Progress</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6', fontFamily: "'DM Mono',monospace" }}>{completedZonesCount}/8 Zones</span>
          </div>
          <div style={{ height: 10, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
            <motion.div animate={{ width: `${(completedZonesCount / 8) * 100}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#3B82F6,#8B5CF6,#EC4899,#F59E0B,#EF4444)' }} />
          </div>
          {/* Zone pip row */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {ZONES.map(z => (
              <div key={z.id} title={z.label} style={{ flex: 1, height: 8, borderRadius: 99, background: zoneComplete(z.id, completedTasks) ? z.color : '#F4F4F5', border: `1px solid ${zoneComplete(z.id, completedTasks) ? z.color : '#E4E4E7'}`, transition: 'background 0.4s', cursor: 'default' }} />
            ))}
          </div>
        </div>

        {/* ══ ZIGZAG ZONE ROWS ════════════════════════════════════════════ */}
        <div style={{ position: 'relative' }}>

          {/* Center spine */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3, transform: 'translateX(-50%)', background: 'linear-gradient(180deg,#3B82F6,#8B5CF6,#0EA5E9,#EC4899,#10B981,#06B6D4,#F59E0B,#EF4444)', opacity: 0.15, borderRadius: 99, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ZONES.map((zone, index) => {
              const unlocked = zoneUnlocked(zone, completedTasks)
              const completed = zoneComplete(zone.id, completedTasks)
              const isSelected = selectedZone?.id === zone.id
              const isLast = index === ZONES.length - 1

              return (
                <div key={zone.id}>
                  {/* ROW */}
                  <div className="roadmap-row" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '18px 0' }}>

                    {/* LEFT slot */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 18 }}>
                      {zone.side === 'left' ? (
                        <ZoneCard zone={zone} unlocked={unlocked} completed={completed} isSelected={isSelected} completedTasks={completedTasks} onClick={() => toggleZone(zone)} />
                      ) : (
                        /* connector stub */
                        <div style={{ height: 3, width: '60%', background: unlocked ? `linear-gradient(270deg,${zone.color}44,transparent)` : '#F4F4F5', borderRadius: 99, alignSelf: 'center' }} />
                      )}
                    </div>

                    {/* CENTER node */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ZoneCircle zone={zone} unlocked={unlocked} completed={completed} isSelected={isSelected} index={index} onClick={() => toggleZone(zone)} />
                    </div>

                    {/* RIGHT slot */}
                    <div style={{ paddingLeft: 18 }}>
                      {zone.side === 'right' ? (
                        <ZoneCard zone={zone} unlocked={unlocked} completed={completed} isSelected={isSelected} completedTasks={completedTasks} onClick={() => toggleZone(zone)} />
                      ) : (
                        <div style={{ height: 3, width: '60%', background: unlocked ? `linear-gradient(90deg,${zone.color}44,transparent)` : '#F4F4F5', borderRadius: 99, alignSelf: 'center' }} />
                      )}
                    </div>
                  </div>

                  {/* Arrow between zones */}
                  {!isLast && (
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5, margin: '-4px 0' }}>
                      <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ color: zoneUnlocked(ZONES[index + 1], completedTasks) ? ZONES[index + 1].color : '#D4D4D8', opacity: 0.65 }}>
                        <ArrowDown size={15} />
                      </motion.div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom stats - Emojis Replaced by Premium Icons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 52 }}>
          {[
            { label: 'Zones Complete', value: `${completedZonesCount}/8`, IconComponent: Compass, color: '#3B82F6' },
            { label: 'Total XP',       value: `${xp} XP`,                IconComponent: Star,    color: '#D97706' },
            { label: 'Day Streak',     value: `${streak} days`,          IconComponent: Flame,   color: '#EF4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 18, padding: '16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <s.IconComponent size={28} color={s.color} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: "'DM Mono',monospace" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#71717A', fontWeight: 700, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══ MISSION PANEL ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedZone && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedZone(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.2)', zIndex: 90, backdropFilter: 'blur(3px)' }} />
            <MissionPanel zone={selectedZone} completedTasks={completedTasks} onClose={() => setSelectedZone(null)} onStartTask={handleStartTask} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}