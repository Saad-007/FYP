/**
 * KidsDashboard.jsx — v4 "Butter Smooth" (Mobile + Desktop)
 * Route: /kids/dashboard
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Bot, Database, GitBranch, Brain, Eye, MessageSquare,
  Palette, Shield, Star, Flame, Navigation,
  Lock, X, Trophy, CheckCircle2, ChevronRight,
  Sparkles, LogOut, Zap, Map,
  Rocket, Search, Paintbrush, Mic, Puzzle,
  Award, Compass, ShieldCheck, Diamond, ShoppingBag
} from 'lucide-react'
import AIMascot from '../../components/kids/Shared/AIMascot'
import LivingMapBackground, { EnergyPulse, XPPopup } from '../../components/kids/Dashboard/LivingMapBackground'
import KidsShop from '../../components/kids/Dashboard/KidsShop'
import { ZONES_LIST, TASK_TYPES, ZONE_XP, XP_PER_LEVEL, zoneComplete, zoneUnlocked } from '../../data/kids/zoneData'
import LeaderboardModal from '../../components/kids/Dashboard/LeaderBoardModal'

// ── Icon maps ──────────────────────────────────────────────────────────────────
const ZONE_ICONS = {
  ai_explorer: Bot, data_detectives: Database, algorithm_logic: GitBranch,
  machine_learning: Brain, computer_vision: Eye, talking_bots: MessageSquare,
  creative_studio: Palette, hero_rules: Shield,
}
const ZONE_BADGE_ICONS = {
  ai_explorer: Rocket, data_detectives: Search, algorithm_logic: Zap,
  machine_learning: Brain, computer_vision: Eye, talking_bots: MessageSquare,
  creative_studio: Palette, hero_rules: ShieldCheck,
}
const TASK_ICONS = { visual: Paintbrush, story: Mic, logic: Puzzle }
const ZONE_DESCRIPTIONS = {
  ai_explorer:      'Discover what makes AI special! Learn how machines think differently from calculators.',
  data_detectives:  'Become a data detective! Learn how AI finds hidden patterns to make smart predictions.',
  algorithm_logic:  'Master logical thinking! Understand how decision trees and logic gates work.',
  machine_learning: 'Train your own AI! Learn how supervised learning turns examples into expertise.',
  computer_vision:  'Give AI eyes! Discover how machines convert images into grids and detect objects.',
  talking_bots:     'Unlock the power of language! Learn how AI understands speech and generates replies.',
  creative_studio:  'Unleash AI creativity! Explore how diffusion models generate art from text prompts.',
  hero_rules:       'Become an AI Hero! Understand deepfakes, bias, privacy, and responsible AI use.',
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSION PANEL
// ─────────────────────────────────────────────────────────────────────────────
function MissionPanel({ zone, completedTasks, onClose, onStartTask, themeColor }) {
  const Icon      = ZONE_ICONS[zone.id]
  const BadgeIcon = ZONE_BADGE_ICONS[zone.id]
  const allDone   = zoneComplete(zone.id, completedTasks)
  const tasksDone = TASK_TYPES.filter(t => completedTasks.includes(`${zone.id}_${t.id}`)).length

  return (
    <motion.div className="mission-panel"
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 36 }}>

      {/* Drag handle for mobile */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: '#E4E4E7' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 16, background: `${zone.color}12`, border: `2px solid ${zone.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} color={zone.color} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.6, marginBottom: 2 }}>Zone {zone.order} · Mission</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>{zone.label}</div>
            <div style={{ fontSize: 11, color: zone.color, fontWeight: 700, marginTop: 1 }}>{zone.sublabel}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: '#F4F4F5', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#71717A', flexShrink: 0, touchAction: 'manipulation' }}>
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#71717A' }}>Zone Progress</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: zone.color, fontFamily: "'DM Mono',monospace" }}>{tasksDone}/3</span>
        </div>
        <div style={{ height: 7, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(tasksDone / 3) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${zone.color}, ${themeColor})` }} />
        </div>
      </div>

      {/* Briefing */}
      <div style={{ background: `${zone.color}08`, border: `1px solid ${zone.color}20`, borderRadius: 14, padding: '12px 14px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={13} color={zone.color} />
          <span style={{ fontSize: 11, fontWeight: 800, color: zone.color, textTransform: 'uppercase', letterSpacing: 1.1 }}>Mission Briefing</span>
        </div>
        <p style={{ fontSize: 13, color: '#52525B', lineHeight: 1.6, margin: 0 }}>{ZONE_DESCRIPTIONS[zone.id]}</p>
      </div>

      {/* XP banner */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Trophy size={18} color="#D97706" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Complete All 3 Tasks</div>
          <div style={{ fontSize: 11, color: '#71717A', marginTop: 1 }}>
            Earn badge · {zone.order < 8 ? `Unlock Zone ${zone.order + 1}` : 'Complete the roadmap!'}
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#D97706', fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>+{ZONE_XP} XP</div>
      </div>

      {/* Task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TASK_TYPES.map((task, i) => {
          const TaskIcon = TASK_ICONS[task.id]
          const done     = completedTasks.includes(`${zone.id}_${task.id}`)
          const locked   = !done && i > 0 && !completedTasks.includes(`${zone.id}_${TASK_TYPES[i - 1].id}`)
          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: done ? task.bg : '#fff', border: `1.5px solid ${done ? task.color + '66' : locked ? '#F4F4F5' : '#E4E4E7'}`, borderRadius: 16, padding: '13px', opacity: locked ? 0.5 : 1, boxShadow: done ? `0 4px 16px ${task.color}18` : '0 1px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: done ? task.color : locked ? '#F4F4F5' : `${task.color}12`, border: `1.5px solid ${done ? task.color : locked ? '#E4E4E7' : task.color + '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done ? <CheckCircle2 size={20} color="#fff" /> : locked ? <Lock size={15} color="#C4C4C4" /> : <TaskIcon size={18} color={task.color} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: locked ? '#A1A1AA' : '#09090B', marginBottom: 1 }}>{task.label}</div>
                  <div style={{ fontSize: 11, color: locked ? '#C4C4C4' : task.color, fontWeight: 700 }}>{task.desc}</div>
                </div>
                <div style={{ background: done ? task.color : '#F4F4F5', color: done ? '#fff' : '#71717A', borderRadius: 99, padding: '3px 9px', fontSize: 11, fontWeight: 800, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>+{task.xp}XP</div>
              </div>
              <motion.button
                whileTap={!done && !locked ? { scale: 0.97 } : {}}
                onClick={() => !done && !locked && onStartTask(zone.id, task.id)}
                style={{ width: '100%', padding: '10px', background: done ? '#F0FDF4' : locked ? '#F9F9F9' : task.color, border: `1.5px solid ${done ? '#86EFAC' : locked ? '#E4E4E7' : 'transparent'}`, borderRadius: 11, fontSize: 13, fontWeight: 800, color: done ? '#16A34A' : locked ? '#A1A1AA' : '#fff', cursor: done || locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: "'Nunito',sans-serif", boxShadow: !done && !locked ? `0 4px 12px ${task.color}38` : 'none', touchAction: 'manipulation' }}>
                {done ? <><CheckCircle2 size={14} /> Completed!</> : locked ? <><Lock size={13} /> Complete previous task first</> : <>Start Task <ChevronRight size={14} /></>}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Badge unlock */}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ marginTop: 18, background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '2px solid #FDE68A', borderRadius: 18, padding: '20px 18px', textAlign: 'center', boxShadow: '0 8px 24px rgba(245,158,11,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#F59E0B', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                {(() => { const B = ZONE_BADGE_ICONS[zone.id]; return <B size={28} color="#fff" /> })()}
              </div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#92400E', fontFamily: "'Syne',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              Zone Badge Unlocked! <Award size={17} color="#D97706" />
            </div>
            <div style={{ fontSize: 12, color: '#78350F', marginTop: 4 }}>
              {zone.order < 8 ? `Zone ${zone.order + 1} is now unlocked!` : "You've completed the entire roadmap!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom safe area spacer */}
      <div style={{ height: 24 }} />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONE CIRCLE
// ─────────────────────────────────────────────────────────────────────────────
function ZoneCircle({ zone, unlocked, completed, isSelected, index, onClick, nodeRef }) {
  const Icon      = ZONE_ICONS[zone.id]
  const BadgeIcon = ZONE_BADGE_ICONS[zone.id]
  return (
    <motion.div
      ref={nodeRef}
      className="zone-circle"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
      onClick={onClick}
      style={{
        position: 'relative', width: 70, height: 70, borderRadius: '50%', zIndex: 10,
        background: completed ? `linear-gradient(135deg,${zone.color},${zone.color}bb)` : unlocked ? '#ffffff' : '#F4F4F5',
        border: `3.5px solid ${completed ? zone.color : isSelected ? zone.color : unlocked ? zone.color + '55' : '#E4E4E7'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: unlocked ? 'pointer' : 'default',
        touchAction: 'manipulation',
        boxShadow: completed ? `0 6px 22px ${zone.glow},0 0 0 6px ${zone.color}18` : isSelected ? `0 6px 20px ${zone.glow}` : unlocked ? '0 3px 14px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {isSelected && unlocked && (
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `2px solid ${zone.color}` }} />
      )}
      {completed ? <BadgeIcon size={28} color="#fff" /> : unlocked ? <Icon size={24} color={isSelected ? zone.color : zone.color + 'bb'} strokeWidth={1.8} /> : <Lock size={18} color="#C4C4C4" />}
      <div className="zone-number-badge" style={{ position: 'absolute', top: -5, left: -5, width: 22, height: 22, borderRadius: '50%', background: unlocked ? zone.color : '#D4D4D8', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: "'DM Mono',monospace" }}>{zone.order}</div>
      {completed && (
        <div className="zone-done-badge" style={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: '#10b981', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={11} color="#fff" strokeWidth={3} />
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ZoneCard({ zone, unlocked, completed, isSelected, completedTasks, onClick }) {
  const Icon      = ZONE_ICONS[zone.id]
  const BadgeIcon = ZONE_BADGE_ICONS[zone.id]
  const tasksDone = TASK_TYPES.filter(t => completedTasks.includes(`${zone.id}_${t.id}`)).length
  return (
    <motion.div
      initial={{ opacity: 0, x: zone.side === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: zone.order * 0.06 }}
      onClick={onClick}
      className="zone-card"
      style={{
        width: '100%', maxWidth: 220,
        background: completed ? `${zone.color}08` : isSelected ? `${zone.color}06` : '#fff',
        border: `2px solid ${completed ? zone.color + '44' : isSelected ? zone.color : unlocked ? '#E4E4E7' : '#F4F4F5'}`,
        borderRadius: 16, padding: '13px',
        cursor: unlocked ? 'pointer' : 'default',
        opacity: unlocked ? 1 : 0.42,
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: isSelected ? `0 8px 24px ${zone.glow}` : completed ? `0 4px 14px ${zone.color}14` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.25s',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <div className="zone-icon-wrap" style={{ width: 28, height: 28, borderRadius: 8, background: completed ? zone.color : `${zone.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {completed ? <BadgeIcon size={14} color="#fff" /> : <Icon size={14} color={unlocked ? zone.color : '#C4C4C4'} />}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="zone-card-label" style={{ fontSize: 11, fontWeight: 900, color: unlocked ? '#09090B' : '#A1A1AA', fontFamily: "'Syne',sans-serif", lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{zone.label}</div>
          <div className="zone-card-sub" style={{ fontSize: 9, color: unlocked ? zone.color : '#D4D4D8', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{zone.sublabel}</div>
        </div>
        {!unlocked && <Lock size={11} color="#D4D4D8" style={{ flexShrink: 0 }} />}
        {completed && (
          <div className="zone-done-pill" style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 99, padding: '1px 5px', flexShrink: 0 }}>
            <CheckCircle2 size={8} color="#065F46" /><span style={{ fontSize: 8, fontWeight: 800, color: '#065F46' }}>DONE</span>
          </div>
        )}
      </div>
      <div className="zone-progress-bars" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {TASK_TYPES.map(t => <div key={t.id} style={{ height: 4, flex: 1, borderRadius: 99, background: completedTasks.includes(`${zone.id}_${t.id}`) ? zone.color : unlocked ? '#E4E4E7' : '#F4F4F5', transition: 'background 0.3s' }} />)}
        <span className="zone-progress-count" style={{ fontSize: 8, color: '#A1A1AA', fontWeight: 700, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>{tasksDone}/3</span>
      </div>
      {unlocked && !completed && <div className="zone-card-cta" style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 2, color: zone.color }}><ChevronRight size={11} /><span style={{ fontSize: 9, fontWeight: 800 }}>Tap to open</span></div>}
      {completed && <div className="zone-card-cta" style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 2, color: '#10b981' }}><CheckCircle2 size={11} /><span style={{ fontSize: 9, fontWeight: 800 }}>+{ZONE_XP} XP earned</span></div>}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function KidsDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile]               = useState(null)
  const [loading, setLoading]               = useState(true)
  const [selectedZone, setSelectedZone]     = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])
  const [xp, setXp]                         = useState(0)
  const [level, setLevel]                   = useState(1)
  const [streak]                            = useState(5)

  const [ariaMode, setAriaMode] = useState('idle')
  const [ariaMsg,  setAriaMsg]  = useState(null)
  const [xpPops,   setXpPops]   = useState([])
  const [pulses,   setPulses]   = useState([])

  const [isShopOpen,       setIsShopOpen]       = useState(false)
  const [gems,             setGems]             = useState(5000)
  const [ownedItems,       setOwnedItems]       = useState([])
  const [activeFrame,      setActiveFrame]      = useState(null)
  const [activeTheme,      setActiveTheme]      = useState(null)
  const [isLeaderboardOpen,setIsLeaderboardOpen]= useState(false)

  const nodeRefs   = useRef({})
  const xpInLevel  = xp % XP_PER_LEVEL
  const xpPercent  = Math.round((xpInLevel / XP_PER_LEVEL) * 100)
  const completedZonesCount = ZONES_LIST.filter(z => zoneComplete(z.id, completedTasks)).length
  const themeColor  = activeTheme ? activeTheme.color : '#3B82F6'
  const isHotStreak = streak >= 3

  // ── Utilities ──────────────────────────────────────────────────────────────

  const triggerAria = useCallback((mode, msg = null, ms = 5000) => {
    setAriaMode(mode); setAriaMsg(msg)
    if (ms > 0) setTimeout(() => { setAriaMode('idle'); setAriaMsg(null) }, ms)
  }, [])

  const showXPPop = useCallback((amount, color = '#fbbf24', cx, cy) => {
    const id = Date.now() + Math.random()
    setXpPops(p => [...p, { id, amount, color, x: cx ?? window.innerWidth / 2, y: cy ?? window.innerHeight / 2 - 60 }])
  }, [])

  const saveShopProgress = useCallback((newGems, newOwned, newFrame, newTheme, userId) => {
    localStorage.setItem(`eduai_shop_${userId}`, JSON.stringify({ gems: newGems, ownedItems: newOwned, activeFrame: newFrame, activeTheme: newTheme }))
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleBuyItem = useCallback((item) => {
    if (gems >= item.price && !ownedItems.includes(item.id)) {
      const newGems = gems - item.price
      const newOwned = [...ownedItems, item.id]
      setGems(newGems); setOwnedItems(newOwned)
      if (profile) saveShopProgress(newGems, newOwned, activeFrame, activeTheme, profile.id)
      triggerAria('happy', `Awesome! You bought ${item.name}! 💎`, 4000)
    }
  }, [gems, ownedItems, activeFrame, activeTheme, profile, saveShopProgress, triggerAria])

  const handleEquipItem = useCallback((item) => {
    let newFrame = activeFrame, newTheme = activeTheme
    if (item.type === 'frame') { newFrame = item; setActiveFrame(item) }
    else if (item.type === 'theme') { newTheme = item; setActiveTheme(item) }
    if (profile) saveShopProgress(gems, ownedItems, newFrame, newTheme, profile.id)
    triggerAria('idle', `${item.name} equipped! ✨`, 3000)
  }, [activeFrame, activeTheme, gems, ownedItems, profile, saveShopProgress, triggerAria])

  const handleEasterEgg = useCallback((amount, cx, cy) => {
    setXp(x => x + amount); setGems(g => g + 10)
    showXPPop(amount, '#fbbf24', cx, cy)
    triggerAria('happy', `Hidden XP! +${amount} XP & 10 Gems! 💎`, 3000)
  }, [showXPPop, triggerAria])

  const handleLogout = async () => {
    triggerAria('sleep', 'See you next time!', 0)
    await new Promise(r => setTimeout(r, 1000))
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleStartTask = (zoneId, taskId) => {
    const task = TASK_TYPES.find(t => t.id === taskId)
    triggerAria('thinking', `Starting ${task?.label || 'task'}...`, 4000)
    setTimeout(() => navigate(`/kids/mission/${zoneId}/${taskId}`), 400)
  }

  const toggleZone = (zone) => {
    if (!zoneUnlocked(zone, completedTasks)) {
      triggerAria('alert', `Zone Locked! Complete Zone ${zone.order - 1} first.`, 3000)
      return
    }
    if (selectedZone?.id === zone.id) {
      setSelectedZone(null); triggerAria('idle', null, 0)
    } else {
      setSelectedZone(zone); triggerAria('thinking', `Briefing for ${zone.label} incoming...`, 4000)
    }
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return navigate('/login')
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
        const savedProgress = localStorage.getItem(`eduai_progress_${session.user.id}`)
        if (savedProgress) {
          const p = JSON.parse(savedProgress)
          setCompletedTasks(p.completedTasks || []); setXp(p.xp || 0); setLevel(p.level || 1)
        }
        const savedShop = localStorage.getItem(`eduai_shop_${session.user.id}`)
        if (savedShop) {
          const s = JSON.parse(savedShop)
          setGems(s.gems ?? 250); setOwnedItems(s.ownedItems ?? [])
          setActiveFrame(s.activeFrame ?? null); setActiveTheme(s.activeTheme ?? null)
        }
        triggerAria('idle', 'System initialized. Ready for your quest!', 6000)
      } catch { navigate('/login') }
      finally { setLoading(false) }
    }
    load()
  }, [navigate, triggerAria])

  const prevCompletedRef = useRef([])
  useEffect(() => {
    ZONES_LIST.forEach((zone, idx) => {
      const justCompleted = zoneComplete(zone.id, completedTasks)
      const wasCompleted  = ZONES_LIST.every((_, i) => i !== idx || prevCompletedRef.current.some(t => t.startsWith(zone.id)))
      if (justCompleted && !wasCompleted) {
        const nextZone = ZONES_LIST[idx + 1]
        if (nextZone) {
          const fromEl = nodeRefs.current[zone.id], toEl = nodeRefs.current[nextZone.id]
          if (fromEl && toEl) setPulses(p => [...p, { id: Date.now(), fromEl, toEl, color: nextZone.color }])
        }
        triggerAria('happy', `Zone ${zone.order} complete! Incredible!`, 6000)
        showXPPop(ZONE_XP, '#10b981', window.innerWidth / 2, window.innerHeight / 2 - 50)
      }
    })
    prevCompletedRef.current = [...completedTasks]
  }, [completedTasks, showXPPop, triggerAria])

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}>
        <Zap size={38} color={themeColor} fill={themeColor} />
      </motion.div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif", position: 'relative' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Smoother touch scrolling on iOS */
        body { -webkit-overflow-scrolling: touch; overscroll-behavior: none; }

        /* Remove tap highlight everywhere */
        * { -webkit-tap-highlight-color: transparent; }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 4px; }

        /* ── HINT BAR ── */
        .hint-bar {
          text-align: center; font-size: 11px; font-weight: 700;
          color: #A1A1AA; font-family: 'DM Mono', monospace; margin-bottom: 22px;
          animation: hint-blink 3s ease-in-out infinite;
        }
        @keyframes hint-blink { 0%,100%{opacity:0.5} 50%{opacity:1} }

        /* ── STREAK ANIMATIONS ── */
        @keyframes flame-glow {
          0%   { box-shadow: 0 0 10px #f9731640, inset 0 0 8px #f9731620; border-color: #f97316; }
          50%  { box-shadow: 0 0 18px #ef444480, inset 0 0 12px #ef444440; border-color: #ef4444; }
          100% { box-shadow: 0 0 10px #f9731640, inset 0 0 8px #f9731620; border-color: #f97316; }
        }
        @keyframes fire-flicker {
          0%, 100% { transform: scale(1) rotate(-5deg); }
          50%       { transform: scale(1.15) rotate(5deg); }
        }

        /* ── MISSION PANEL — desktop side drawer ── */
        .mission-panel {
          position: fixed; top: 0; right: 0; bottom: 0; width: 420px;
          background: rgba(255,255,255,0.98); backdrop-filter: blur(24px);
          border-left: 1px solid #E4E4E7;
          box-shadow: -24px 0 60px rgba(0,0,0,0.07);
          z-index: 100; padding: 24px 22px; overflow-y: auto;
          overscroll-behavior: contain;
        }

        /* ── Mobile XP strip — hidden on desktop ── */
        .mobile-xp-strip { display: none; }

        /* ══════════════════════════════════════════
            TABLET + MOBILE  ≤ 768px
        ══════════════════════════════════════════ */
        @media (max-width: 768px) {

          /* ── HUD ── */
          .hud-bar {
            height: auto !important;
            min-height: 54px !important;
            padding: 8px 14px !important;
            gap: 8px !important;
          }
          .hud-xp-section { display: none !important; }
          .hide-sm         { display: none !important; }
          .hud-right       { gap: 6px !important; }

          /* ── Mobile XP strip ── */
          .mobile-xp-strip {
            display: flex; align-items: center; gap: 10px;
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid #E4E4E7;
            padding: 8px 16px;
          }

          /* ── HUD badges compact ── */
          .streak-badge { padding: 4px 8px !important; gap: 4px !important; }
          .streak-badge span { font-size: 11px !important; }
          .xp-badge    { padding: 4px 7px !important; }
          .xp-badge span { font-size: 10px !important; }
          .gems-badge  { display: none !important; }
          .shop-btn    { padding: 6px 10px !important; font-size: 11px !important; gap: 4px !important; }
          .avatar-btn  { width: 30px !important; height: 30px !important; font-size: 12px !important; }

          /* ── Mission panel → full-width bottom sheet ── */
          .mission-panel {
            width: 100% !important;
            height: 90vh !important;
            top: auto !important; right: 0 !important; bottom: 0 !important;
            border-left: none !important;
            border-top: 1px solid #E4E4E7 !important;
            border-radius: 22px 22px 0 0 !important;
            padding: 16px 16px 0 !important;
            box-shadow: 0 -16px 48px rgba(0,0,0,0.12) !important;
          }

          /* ── Leaderboard banner ── */
          .leaderboard-banner {
            flex-direction: column !important;
            gap: 10px !important; padding: 14px 14px !important;
          }
          .lb-main-text { font-size: 13px !important; white-space: normal !important; line-height: 1.4 !important; }
          .lb-trophy    { padding: 9px !important; border-radius: 12px !important; }
          .lb-trophy svg { width: 20px !important; height: 20px !important; }
          .leaderboard-banner-btn { width: 100% !important; justify-content: center !important; }

          /* ── Roadmap grid — STRAIGHT LINE MOBILE MAP ── */
          .roadmap-row { 
            display: flex !important; 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 16px !important; 
            padding: 24px 0 !important; 
          }
          .roadmap-center { order: 1 !important; }
          .roadmap-side { 
            order: 2 !important; 
            width: 100% !important; 
            max-width: 280px !important; 
            justify-content: center !important; 
            padding: 0 !important; 
          }
          .empty-line { display: none !important; }
          .spine-line { left: 50% !important; transform: translateX(-50%) !important; }

          /* ── Zone circle ── */
          .zone-circle {
            width: 50px !important; height: 50px !important;
          }
          .zone-circle svg { width: 20px !important; height: 20px !important; }
          .zone-number-badge {
            width: 18px !important; height: 18px !important;
            font-size: 9px !important; top: -4px !important; left: -4px !important;
          }
          .zone-done-badge {
            width: 17px !important; height: 17px !important;
            bottom: -3px !important; right: -3px !important;
          }

          /* ── Zone card ── */
          .zone-card {
            max-width: 100% !important;
            padding: 12px !important; border-radius: 16px !important;
          }
          .zone-card-label  { font-size: 13px !important; letter-spacing: 0 !important; }
          .zone-card-sub    { display: block !important; font-size: 11px !important; margin-top: 2px !important; }
          .zone-card-cta    { display: flex !important; }
          .zone-done-pill   { display: flex !important; }
          .zone-icon-wrap   { width: 32px !important; height: 32px !important; border-radius: 8px !important; }
          .zone-icon-wrap svg { width: 16px !important; height: 16px !important; }
          .zone-progress-bars { gap: 4px !important; margin-top: 8px !important; }
          .zone-progress-bars > div { height: 4px !important; }
          .zone-progress-count { display: block !important; }

          /* ── Overall progress ── */
          .progress-zones { gap: 3px !important; }

          /* ── Bottom stats — 3 in one row, compact ── */
          .stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 7px !important; margin-top: 28px !important;
          }
          .stat-card      { padding: 10px 5px !important; border-radius: 11px !important; }
          .stat-icon-wrap { margin-bottom: 4px !important; }
          .stat-icon-wrap svg { width: 17px !important; height: 17px !important; }
          .stat-value     { font-size: 11px !important; }
          .stat-label     { font-size: 7.5px !important; margin-top: 2px !important; letter-spacing: 0 !important; }

          /* ── Map content ── */
          .map-content { padding: 16px 12px 80px !important; }

          /* ── Title ── */
          .roadmap-title h1 { font-size: 20px !important; }
        }

        /* ── Extra small ≤ 380px ── */
        @media (max-width: 380px) {
          .zone-circle { width: 44px !important; height: 44px !important; }
          .zone-circle svg { width: 18px !important; height: 18px !important; }
          .hud-bar { padding: 7px 10px !important; }
          .hud-right { gap: 4px !important; }
          .streak-badge span { display: none; }
        }
      `}</style>

      {/* ── LIVING BACKGROUND ── */}
      <LivingMapBackground onEasterEggFound={handleEasterEgg} />

      {/* ── ENERGY PULSES ── */}
      {pulses.map(p => (
        <EnergyPulse key={p.id} fromEl={p.fromEl} toEl={p.toEl} color={p.color}
          onDone={() => setPulses(prev => prev.filter(x => x.id !== p.id))} />
      ))}

      {/* ── XP POPUPS ── */}
      {xpPops.map(p => (
        <XPPopup key={p.id} xp={p.amount} x={p.x} y={p.y} color={p.color}
          onDone={() => setXpPops(prev => prev.filter(x => x.id !== p.id))} />
      ))}

      {/* ══════════════ TOP HUD ══════════════ */}
      <div className="hud-bar" style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 68, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
        background: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E4E4E7',
        gap: 14,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s', flexShrink: 0 }}>
            <Navigation size={16} color="#fff" />
          </div>
          <span className="hide-sm" style={{ fontSize: 17, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.4px' }}>
            EduAI<span style={{ color: themeColor, transition: 'color 0.3s' }}>Quest</span>
          </span>
        </div>

        {/* XP Bar — desktop only */}
        <div className="hud-xp-section" style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 7, padding: '4px 9px', flexShrink: 0 }}>
            <Star size={12} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>Lv.{level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 7, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${themeColor}, #06B6D4)`, transition: 'background 0.3s' }} />
            </div>
          </div>
          <span className="hide-sm" style={{ fontSize: 11, color: '#71717A', fontWeight: 700, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>{xpInLevel}/{XP_PER_LEVEL}</span>
        </div>

        {/* Right side */}
        <div className="hud-right" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Streak */}
          <div className="streak-badge" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: isHotStreak ? '#FFF7ED' : '#F4F4F5',
            border: `1.5px solid ${isHotStreak ? '#F97316' : '#E4E4E7'}`,
            borderRadius: 8, padding: '4px 10px',
            animation: isHotStreak ? 'flame-glow 1.5s infinite alternate ease-in-out' : 'none',
          }}>
            <div style={{ fontSize: 14, animation: isHotStreak ? 'fire-flicker 0.8s infinite' : 'none', filter: isHotStreak ? 'drop-shadow(0 2px 4px rgba(239,68,68,0.4))' : 'grayscale(100%)' }}>🔥</div>
            <span style={{ fontSize: 12, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: isHotStreak ? '#EA580C' : '#A1A1AA' }}>
              {streak} {isHotStreak ? 'HOT!' : 'Days'}
            </span>
          </div>
          {/* XP */}
          <div className="xp-badge" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 7, padding: '4px 9px' }}>
            <Trophy size={11} color="#10b981" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono',monospace" }}>{xp}XP</span>
          </div>
          {/* Gems */}
          <div className="gems-badge" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 7, padding: '4px 9px' }}>
            <Diamond size={11} color="#8B5CF6" fill="#8B5CF6" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#6D28D9', fontFamily: "'DM Mono',monospace" }}>{gems}</span>
          </div>
          {/* Shop */}
          <motion.button className="shop-btn" whileTap={{ scale: 0.95 }} onClick={() => setIsShopOpen(true)}
            style={{ background: '#8B5CF6', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12, boxShadow: '0 4px 10px rgba(139,92,246,0.3)', touchAction: 'manipulation' }}>
            <ShoppingBag size={14} /> <span className="hide-sm">Shop</span>
          </motion.button>
          {/* Avatar */}
          <div className="avatar-btn"
            onClick={() => navigate('/kids/profile', { state: { profile, xp, level, streak, gems, completedTasks, activeFrame } })}
            style={{ width: 34, height: 34, borderRadius: '50%', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', cursor: 'pointer', border: activeFrame ? `2.5px solid ${activeFrame.color}` : '2.5px solid transparent', boxShadow: activeFrame ? activeFrame.shadow : 'none', transition: 'all 0.3s', touchAction: 'manipulation' }}>
            {(profile?.username || 'U')[0].toUpperCase()}
          </div>
          {/* Logout */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
            style={{ background: '#F4F4F5', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#71717A', display: 'flex', touchAction: 'manipulation' }}>
            <LogOut size={14} />
          </motion.button>
        </div>
      </div>

      {/* ── MOBILE XP STRIP ── */}
      <div className="mobile-xp-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 7, padding: '4px 10px', flexShrink: 0 }}>
          <Star size={13} color="#D97706" fill="#D97706" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#92400E' }}>Lv.{level}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${themeColor}, #06B6D4)` }} />
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#71717A', fontWeight: 700, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>
          {xpInLevel}/{XP_PER_LEVEL} XP
        </span>
      </div>

      {/* ══════════════ MAP CONTENT ══════════════ */}
      <div className="map-content" style={{ maxWidth: 740, margin: '0 auto', padding: '24px 20px 80px', position: 'relative', zIndex: 10 }}>

        {/* ── LEADERBOARD WIDGET ── */}
        <motion.div className="leaderboard-banner"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,#1E1B4B,#3730A3)', border: '2px solid #4F46E5', borderRadius: 22, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, boxShadow: '0 12px 28px rgba(49,46,129,0.4)', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle,rgba(251,191,36,0.18) 0%,transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1, flex: 1, minWidth: 0 }}>
            <div className="lb-trophy" style={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', padding: 12, borderRadius: 14, boxShadow: '0 4px 10px rgba(251,191,36,0.3)', flexShrink: 0 }}>
              <Trophy size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#A5B4FC', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 3 }}>Weekly Leaderboard</div>
              <div className="lb-main-text" style={{ fontSize: 15, color: '#fff', fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1.3 }}>
                You're in the <span style={{ color: '#FCD34D', fontWeight: 900 }}>Top 10%</span> of Explorers! 🚀
              </div>
            </div>
          </div>
          <motion.button className="leaderboard-banner-btn"
            whileTap={{ scale: 0.95 }} onClick={() => setIsLeaderboardOpen(true)}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)', zIndex: 1, flexShrink: 0, whiteSpace: 'nowrap', touchAction: 'manipulation' }}>
            View Ranks <ChevronRight size={15} strokeWidth={3} />
          </motion.button>
        </motion.div>

        {/* ── TITLE ── */}
        <motion.div className="roadmap-title" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 99, padding: '4px 12px', marginBottom: 12 }}>
            <Map size={12} color={themeColor} />
            <span style={{ fontSize: 10, fontWeight: 800, color: themeColor, textTransform: 'uppercase', letterSpacing: 1.2 }}>AI Learning Roadmap</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px', lineHeight: 1.1, margin: '0 0 8px' }}>
            Welcome back, <span style={{ background: `linear-gradient(90deg,${themeColor},#8B5CF6)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@{profile?.username}</span>! 👋
          </h1>
          <p style={{ fontSize: 13, color: '#71717A', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {completedZonesCount === 0
              ? <>Start your AI adventure — tap Zone 1! <Rocket size={13} color={themeColor} /></>
              : `${completedZonesCount}/8 zones mastered · Keep going!`}
          </p>
        </motion.div>

        {/* Easter egg hint */}
        <div className="hint-bar">✦ hidden stars &amp; bugs scattered around — find them for bonus gems! ✦</div>

        {/* ── OVERALL PROGRESS ── */}
        <div style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 16, padding: '14px 18px', marginBottom: 36, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Overall Roadmap Progress</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: themeColor, fontFamily: "'DM Mono',monospace" }}>{completedZonesCount}/8 Zones</span>
          </div>
          <div style={{ height: 9, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden', marginBottom: 9 }}>
            <motion.div animate={{ width: `${(completedZonesCount / 8) * 100}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${themeColor},#8b5cf6,#ec4899,#f59e0b,#ef4444)` }} />
          </div>
          <div className="progress-zones" style={{ display: 'flex', gap: 5 }}>
            {ZONES_LIST.map(z => (
              <div key={z.id} title={z.label} style={{ flex: 1, height: 7, borderRadius: 99, background: zoneComplete(z.id, completedTasks) ? z.color : '#F4F4F5', border: `1px solid ${zoneComplete(z.id, completedTasks) ? z.color : '#E4E4E7'}`, transition: 'background 0.4s' }} />
            ))}
          </div>
        </div>

        {/* ── ZIGZAG MAP (Centered on Mobile) ── */}
        <div style={{ position: 'relative' }}>
          {/* Spine */}
          <div className="spine-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3, transform: 'translateX(-50%)', background: `linear-gradient(180deg,${themeColor},#8b5cf6,#0ea5e9,#ec4899,#10b981,#06b6d4,#f59e0b,#ef4444)`, opacity: 0.18, borderRadius: 99, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ZONES_LIST.map((zone, index) => {
              const unlocked   = zoneUnlocked(zone, completedTasks)
              const completed  = zoneComplete(zone.id, completedTasks)
              const isSelected = selectedZone?.id === zone.id
              const isLast     = index === ZONES_LIST.length - 1

              return (
                <div key={zone.id}>
                  <div className="roadmap-row" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '16px 0' }}>

                    {/* Left column */}
                    <div className="roadmap-side roadmap-left roadmap-col-pad-r" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 16 }}>
                      {zone.side === 'left'
                        ? <ZoneCard zone={zone} unlocked={unlocked} completed={completed} isSelected={isSelected} completedTasks={completedTasks} onClick={() => toggleZone(zone)} />
                        : <div className="empty-line" style={{ height: 3, width: '55%', background: unlocked ? `linear-gradient(270deg,${zone.color}44,transparent)` : '#F4F4F5', borderRadius: 99, alignSelf: 'center' }} />}
                    </div>

                    {/* Center */}
                    <div className="roadmap-center" style={{ display: 'flex', justifyContent: 'center' }}>
                      <ZoneCircle zone={zone} unlocked={unlocked} completed={completed}
                        isSelected={isSelected} index={index}
                        onClick={() => toggleZone(zone)}
                        nodeRef={el => { nodeRefs.current[zone.id] = el }} />
                    </div>

                    {/* Right column */}
                    <div className="roadmap-side roadmap-right roadmap-col-pad-l" style={{ paddingLeft: 16, display: 'flex', justifyContent: 'flex-start' }}>
                      {zone.side === 'right'
                        ? <ZoneCard zone={zone} unlocked={unlocked} completed={completed} isSelected={isSelected} completedTasks={completedTasks} onClick={() => toggleZone(zone)} />
                        : <div className="empty-line" style={{ height: 3, width: '55%', background: unlocked ? `linear-gradient(90deg,${zone.color}44,transparent)` : '#F4F4F5', borderRadius: 99, alignSelf: 'center' }} />}
                    </div>
                  </div>

                  {/* Connector */}
                  {!isLast && (
                    <div className="empty-line" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5, margin: '-4px 0' }}>
                      <div style={{ position: 'relative', width: 3, height: 32 }}>
                        <div style={{ position: 'absolute', inset: 0, background: '#F4F4F5', borderRadius: 99 }} />
                        {zoneUnlocked(ZONES_LIST[index + 1], completedTasks) && (
                          <motion.div animate={{ scaleY: [0, 1], originY: 0, opacity: [1, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeIn' }}
                            style={{ position: 'absolute', inset: 0, borderRadius: 99, background: `linear-gradient(180deg,${ZONES_LIST[index + 1].color},${ZONES_LIST[index + 1].color}00)` }} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── BOTTOM STATS ── */}
        <motion.div className="stats-grid"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 48 }}>
          {[
            { label: 'Zones Complete', value: `${completedZonesCount}/8`, Icon: Compass, color: themeColor },
            { label: 'Total XP',       value: `${xp} XP`,                Icon: Star,    color: '#D97706' },
            { label: 'Day Streak',     value: `${streak} days`,          Icon: Flame,   color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 16, padding: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div className="stat-icon-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: 7 }}>
                <s.Icon size={26} color={s.color} strokeWidth={2.5} />
              </div>
              <div className="stat-value" style={{ fontSize: 16, fontWeight: 900, color: s.color, fontFamily: "'DM Mono',monospace" }}>{s.value}</div>
              <div className="stat-label" style={{ fontSize: 9, color: '#71717A', fontWeight: 700, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── MISSION PANEL ── */}
      <AnimatePresence>
        {selectedZone && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSelectedZone(null); triggerAria('idle', null, 0) }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.22)', zIndex: 90, backdropFilter: 'blur(3px)' }} />
            <MissionPanel zone={selectedZone} completedTasks={completedTasks}
              onClose={() => { setSelectedZone(null); triggerAria('idle', null, 0) }}
              onStartTask={handleStartTask} themeColor={themeColor} />
          </>
        )}
      </AnimatePresence>

      {/* ── ARIA ── */}
      <AIMascot mode={ariaMode} customMessage={ariaMsg} isActive={!!selectedZone} />

      {/* ── SHOP ── */}
      <KidsShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)}
        gems={gems} onBuy={handleBuyItem} ownedItems={ownedItems}
        activeFrame={activeFrame} activeTheme={activeTheme} onEquip={handleEquipItem} />

      {/* ── LEADERBOARD ── */}
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)}
        profile={profile} currentXp={xp} currentStreak={streak} />

    </div>
  )
}