/**
 * LandingPage.jsx — EduAIQuest v2 "Apex Edition"
 * World-class premium SaaS landing page
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  BrainCircuit, Gamepad2, TerminalSquare, Mic,
  Map, Puzzle, Bot, PenTool, ArrowRight, Star,
  Code2, Sparkles, UserPlus, Split, Target, TrendingUp, Play,
  Zap, Shield, Trophy, Globe, ChevronRight, CheckCircle,
  Cpu, Database, GitBranch, Flame
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────────────────────────────────────
const KIDS_FEATURES = [
  { icon: Map, label: 'World Map', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  { icon: Bot, label: 'AI Buddy', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
  { icon: Puzzle, label: 'Logic Blocks', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  { icon: PenTool, label: 'Draw Mode', color: '#10B981', bg: '#F0FDF4', border: '#BBF7D0' },
]

const QUEST_TASKS = [
  { icon: Bot, name: 'Fix the Robot', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
  { icon: Mic, name: 'Voice AI Buddy', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
  { icon: Puzzle, name: 'Logic Blocks', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
]

const PRO_SKILLS = [
  { name: 'Python', p: 85, c: '#3B82F6' },
  { name: 'Vector DBs', p: 60, c: '#8B5CF6' },
  { name: 'RAG Logic', p: 92, c: '#10B981' },
  { name: 'Transformers', p: 74, c: '#F59E0B' },
]

const WORKFLOW_STEPS = [
  { step: '01', icon: UserPlus, title: 'Identity', desc: 'Secure profile creation with age detection rules engine powering the dynamic split.' },
  { step: '02', icon: Split, title: 'Router Split', desc: 'Dynamic UI rendering based on demographic bracket — two realities, one platform.' },
  { step: '03', icon: Database, title: 'RAG Pipeline', desc: 'Langchain fetches verified AI concepts via Pinecone for contextual accuracy.' },
  { step: '04', icon: TrendingUp, title: 'Elo Adjust', desc: 'Algorithm calculates response quality and tweaks difficulty live in real time.' },
]

const TESTIMONIALS = [
  { name: 'Zara A.', role: 'Age 13 · Kids Mode', text: 'I built my first neural network quest without even realising I was coding!', stars: 5, avatar: 'ZA', color: '#EC4899' },
  { name: 'Hamza R.', role: 'Age 19 · Pro Mode', text: 'The Elo system is genuinely addictive. My RAG skills jumped 3 levels in a week.', stars: 5, avatar: 'HR', color: '#3B82F6' },
  { name: 'Sara K.', role: 'Age 11 · Kids Mode', text: 'ARIA is the coolest AI mascot ever. She explains everything perfectly!', stars: 5, avatar: 'SK', color: '#10B981' },
]

const PLATFORM_STATS = [
  { val: 'RAG', label: 'AI Architecture', icon: Database, color: '#3B82F6' },
  { val: 'Elo', label: 'Rating Algorithm', icon: TrendingUp, color: '#8B5CF6' },
  { val: '2', label: 'Distinct Interfaces', icon: Split, color: '#EC4899' },
  { val: '∞', label: 'Learning Paths', icon: GitBranch, color: '#10B981' },
]

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Stagger container
// ─────────────────────────────────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function MagneticButton({ children, style, onClick, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ ...style, x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const AuroraBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#FAFAFA' }}>
    {/* Fine grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)'
    }} />
    {/* Aurora blobs */}
    <motion.div
      animate={{ x: ['-8%', '8%', '-8%'], y: ['-8%', '8%', '-8%'], scale: [1, 1.1, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 65%)', filter: 'blur(90px)', borderRadius: '50%' }}
    />
    <motion.div
      animate={{ x: ['6%', '-6%', '6%'], y: ['6%', '-6%', '6%'], scale: [1, 1.12, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: '5%', right: '-12%', width: '65vw', height: '65vw', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%)', filter: 'blur(110px)', borderRadius: '50%' }}
    />
    <motion.div
      animate={{ x: ['0%', '12%', '0%'], y: ['12%', '0%', '12%'] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '35%', left: '25%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%)', filter: 'blur(100px)', borderRadius: '50%' }}
    />
    <motion.div
      animate={{ x: ['-5%', '5%', '-5%'], y: ['5%', '-5%', '5%'] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '60%', left: '50%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', filter: 'blur(80px)', borderRadius: '50%' }}
    />
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PARTICLES
// ─────────────────────────────────────────────────────────────────────────────
function Particles({ side }) {
  const isKids = side === 'kids'
  const colors = isKids
    ? ['#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA']
    : ['#60A5FA', '#A78BFA', '#38BDF8', '#818CF8', '#34D399']
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const size = 4 + (i % 5)
        const x = 5 + (i * 7) % 90
        const delay = (i * 0.37) % 6
        const dur = 10 + (i * 1.1) % 10
        return (
          <motion.div key={i}
            style={{ position: 'absolute', left: `${x}%`, bottom: '-8%', width: size, height: size, borderRadius: '50%', background: colors[i % colors.length], opacity: isKids ? 0.45 : 0.2 }}
            animate={{ y: [0, -420], opacity: [0, 0.7, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
          />
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED XP BAR (Kids)
// ─────────────────────────────────────────────────────────────────────────────
function XPBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, marginBottom: 5 }}>
        <span style={{ color: '#52525B' }}>{label}</span>
        <span style={{ color, fontFamily: "'DM Mono',monospace" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RADIAL DONUT CHART (Kids level progress)
// ─────────────────────────────────────────────────────────────────────────────
function DonutChart({ percent, color, label }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#F4F4F5" strokeWidth="7" />
        <motion.circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ - dash }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text x="44" y="48" textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily="'DM Mono',monospace">{percent}%</text>
      </svg>
      <span style={{ fontSize: 11, color: '#71717A', fontWeight: 700 }}>{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY XP BAR CHART (Pro)
// ─────────────────────────────────────────────────────────────────────────────
function WeeklyXPChart() {
  const data = [
    { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 280 }, { day: 'Wed', xp: 195 },
    { day: 'Thu', xp: 340 }, { day: 'Fri', xp: 260 }, { day: 'Sat', xp: 410 }, { day: 'Sun', xp: 180 },
  ]
  const max = 450
  return (
    <div>
      <div style={{ fontSize: 10, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, fontFamily: "'DM Mono',monospace" }}>Weekly XP</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 70 }}>
        {data.map((d, i) => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: '100%', borderRadius: '3px 3px 0 0', overflow: 'hidden', height: 54 }}>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(d.xp / max) * 54}px` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                style={{ width: '100%', background: i === 5 ? 'linear-gradient(180deg,#60A5FA,#3B82F6)' : '#1F2937', borderRadius: '3px 3px 0 0', position: 'absolute', bottom: 0 }}
              />
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.xp / max) * 54}px` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                  style={{ width: '100%', background: i === 5 ? 'linear-gradient(180deg,#60A5FA,#3B82F6)' : '#27272A', borderRadius: '3px 3px 0 0', boxShadow: i === 5 ? '0 0 10px rgba(96,165,250,0.4)' : 'none' }}
                />
              </div>
            </div>
            <span style={{ fontSize: 9, color: '#52525B', fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// KIDS MODE PREVIEW CARD
// ─────────────────────────────────────────────────────────────────────────────
function ChildModePreview() {
  const [activeTask, setActiveTask] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActiveTask(p => (p + 1) % QUEST_TASKS.length), 2600)
    return () => clearInterval(t)
  }, [])
  const TaskIcon = QUEST_TASKS[activeTask].icon

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
      style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 24, padding: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FCA5A5','#FDE047','#86EFAC'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF9C3', padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 900, color: '#A16207', border: '1px solid #FDE68A' }}>
          <Star size={12} fill="#F59E0B" color="#F59E0B" /> 2,450 XP
        </div>
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
        {KIDS_FEATURES.map(f => (
          <motion.div key={f.label} whileHover={{ scale: 1.04, y: -2 }}
            style={{ background: f.bg, border: `1.5px solid ${f.border}`, borderRadius: 16, padding: '13px', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'default' }}>
            <f.icon size={20} color={f.color} />
            <span style={{ fontSize: 11, fontWeight: 800, color: f.color }}>{f.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress donuts */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16, background: '#FAFAFA', borderRadius: 16, padding: '12px 8px', border: '1px solid #F4F4F5' }}>
        <DonutChart percent={72} color="#3B82F6" label="Zones" />
        <DonutChart percent={58} color="#EC4899" label="Badges" />
        <DonutChart percent={91} color="#10B981" label="Streak" />
      </div>

      {/* Current quest */}
      <div style={{ fontSize: 10, fontWeight: 900, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 7 }}>Current Quest</div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTask}
          initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.28 }}
          style={{ display: 'flex', alignItems: 'center', gap: 11, background: QUEST_TASKS[activeTask].bg, border: `1.5px solid ${QUEST_TASKS[activeTask].border}`, borderRadius: 14, padding: '13px 14px', fontSize: 14, fontWeight: 900, color: '#09090B', cursor: 'default' }}
        >
          <div style={{ background: '#fff', padding: 7, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0 }}>
           
<TaskIcon size={16} color={QUEST_TASKS[activeTask].color} />
          </div>
          {QUEST_TASKS[activeTask].name}
          <ChevronRight size={14} color="#D4D4D8" style={{ marginLeft: 'auto' }} />
        </motion.div>
      </AnimatePresence>

      {/* XP progress bars */}
      <div style={{ marginTop: 16 }}>
        <XPBar label="AI Explorer" value={6} max={8} color="#3B82F6" />
        <XPBar label="Data Detective" value={3} max={5} color="#EC4899" />
        <XPBar label="Logic Master" value={4} max={6} color="#F59E0B" />
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRO MODE PREVIEW CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProModePreview() {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
      style={{ position: 'relative', zIndex: 2, background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(24px)', border: '1px solid #27272A', borderRadius: 24, padding: 22, boxShadow: '0 30px 60px rgba(0,0,0,0.35)' }}
    >
      {/* File header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#18181B', border: '1px solid #27272A', padding: '5px 7px', borderRadius: 7 }}><Code2 size={14} color="#71717A" /></div>
          <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: '#D4D4D8', fontWeight: 600 }}>AI_Engineer.py</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 9px', borderRadius: 7 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 7px #10B981' }} /> Elo: 1640
        </div>
      </div>

      {/* Skill distribution bars */}
      <div style={{ marginBottom: 18 }}>
        {PRO_SKILLS.map((s, i) => (
          <div key={s.name} style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#71717A', marginBottom: 5 }}>
              <span>{s.name}</span>
              <span style={{ color: s.c, fontWeight: 700 }}>{s.p}%</span>
            </div>
            <div style={{ background: '#18181B', height: 4, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.p}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.12, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${s.c}88, ${s.c})`, boxShadow: `0 0 8px ${s.c}66` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly XP Chart */}
      <WeeklyXPChart />

      {/* Code snippet */}
      <div style={{ marginTop: 16, background: '#000000', borderRadius: 14, padding: '14px 16px', border: '1px solid #1C1C1E', fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.75, color: '#D4D4D8' }}>
        <span style={{ color: '#F472B6' }}>from</span>
        <span style={{ color: '#60A5FA' }}> langchain </span>
        <span style={{ color: '#F472B6' }}>import</span>
        <span> RAGChain</span><br />
        <span style={{ color: '#F472B6' }}>def</span>
        <span style={{ color: '#FDE047' }}> update_elo</span>
        <span>(score):</span><br />
        <span style={{ color: '#71717A', marginLeft: 16 }}>  # Elo convergence</span><br />
        <span style={{ marginLeft: 16, color: '#F472B6' }}>  return</span>
        <span> base + score * </span>
        <span style={{ color: '#A78BFA' }}>32</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.85 }}
          style={{ display: 'inline-block', width: 7, height: 14, background: '#60A5FA', marginLeft: 4, verticalAlign: 'middle', borderRadius: 1 }}
        />
      </div>

      {/* Bottom stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
        {[{ label: 'Rank', val: '#24', color: '#FBBF24' }, { label: 'Streak', val: '12d', color: '#EF4444' }, { label: 'Modules', val: '7/12', color: '#60A5FA' }].map(s => (
          <div key={s.label} style={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 10, padding: '9px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: s.color, fontFamily: "'DM Mono',monospace", marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: '#52525B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIAL CARD
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialCard({ t, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 24, padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
      </div>
      <p style={{ fontSize: 15, color: '#3F3F46', lineHeight: 1.65, fontWeight: 600, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#09090B' }}>{t.name}</div>
          <div style={{ fontSize: 12, color: '#71717A', fontWeight: 700 }}>{t.role}</div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      style={{
        position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
        width: '94%', maxWidth: 1200, height: 66, borderRadius: 99,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px',
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: scrolled ? '0 12px 36px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.04)',
        transition: 'background 0.35s, box-shadow 0.35s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 280, height: 196, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'transparent' }}>
    {/* Bina import kiye direct public folder ka path */}
    <img 
      src="/logo.png" 
      alt="EduAIQuest Logo" 
      style={{ width: '180%', height: '150%', objectFit: 'contain' }} 
    />
  </div>
        {/* <span style={{ fontSize: 21, fontWeight: 900, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.6px', color: '#09090B' }}>EduAIQuest.</span> */}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'transparent', border: 'none', color: '#52525B', fontWeight: 800, padding: '9px 18px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontSize: 15, transition: 'color 0.2s' }}
        >
          Log in
        </button>
        <MagneticButton
          onClick={() => navigate('/register')}
          style={{ background: '#09090B', border: 'none', color: '#fff', fontWeight: 900, padding: '11px 24px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontSize: 15, boxShadow: '0 8px 20px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Get Started <ArrowRight size={15} />
        </MagneticButton>
      </div>
    </motion.nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div style={{ minHeight: '100vh', color: '#09090B', fontFamily: "'Nunito',sans-serif", overflowX: 'hidden', position: 'relative' }}>

      <AuroraBackground />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:rgba(59,130,246,0.25);color:#09090B}
        html{scroll-behavior:smooth}

        .beam-border {
          position:absolute; inset:-1px; border-radius:42px; z-index:-1;
          background:conic-gradient(from 0deg, transparent 60%, rgba(59,130,246,0.6) 75%, rgba(236,72,153,0.6) 90%, transparent 100%);
          animation:spin 5s linear infinite;
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude; -webkit-mask-composite:xor;
          padding:1px;
        }
        @keyframes spin{100%{transform:rotate(360deg)}}

        .tag-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.75); backdrop-filter:blur(12px);
          border:1px solid rgba(59,130,246,0.25); border-radius:99px;
          padding:7px 18px; font-size:13px; font-weight:800; color:#1D4ED8;
          box-shadow:0 2px 10px rgba(59,130,246,0.1);
        }
        .section-tag {
          display:inline-block; background:#F4F4F5; padding:7px 16px;
          border-radius:99px; font-size:12px; color:#52525B;
          font-family:'DM Mono',monospace; letter-spacing:2px;
          text-transform:uppercase; font-weight:700; border:1px solid #E4E4E7;
        }
        .check-item {
          display:flex; align-items:center; gap:9px;
          font-size:14px; font-weight:700; color:#3F3F46;
        }

        @media(max-width:768px){
          .hero-title { font-size: 52px !important; letter-spacing: -2px !important; }
          .dual-grid { flex-direction: column !important; }
          .workflow-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .cta-title { font-size: 40px !important; }
          .hide-mobile { display: none !important; }
        }
        @media(max-width:480px){
          .workflow-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <Navbar navigate={navigate} />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 6% 80px', textAlign: 'center', position: 'relative', zIndex: 10 }}
      >
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.55, type: 'spring' }} style={{ marginBottom: 32 }}>
          <span className="tag-pill"><Sparkles size={14} fill="#3B82F6" color="#3B82F6" /> The Next-Gen EdTech Experience</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 'clamp(52px, 8.5vw, 112px)', fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1.04, letterSpacing: '-3px', marginBottom: 28, color: '#09090B' }}
        >
          Master AI.<br />
          <span style={{ color: '#C4C4C4' }}>Built for your</span>{' '}
          <span style={{ background: 'linear-gradient(135deg,#3B82F6 0%,#8B5CF6 50%,#EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>mind.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
          style={{ fontSize: 20, color: '#52525B', lineHeight: 1.65, maxWidth: 620, margin: '0 auto 52px', fontWeight: 600 }}
        >
          One intelligent platform, two entirely different realities. The Dynamic Engine transforms the UI, difficulty, and tone based entirely on who you are.
        </motion.p>

        <motion.div
          initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}
        >
          <MagneticButton
            onClick={() => navigate('/register')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: '#09090B', border: 'none', color: '#fff', padding: '17px 40px', borderRadius: 99, fontSize: 17, fontWeight: 900, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', boxShadow: '0 16px 36px rgba(0,0,0,0.22)' }}
          >
            Start the Quest <Play size={16} fill="#fff" color="#fff" />
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById('modes')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1.5px solid #E4E4E7', color: '#09090B', padding: '17px 40px', borderRadius: 99, fontSize: 17, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
          >
            Explore Architecture
          </MagneticButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex' }}>
            {['#3B82F6','#EC4899','#10B981','#F59E0B'].map((c, i) => (
              <div key={c} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0, zIndex: 4 - i, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>
                {['ZA','HR','SK','AM'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 14, color: '#71717A', fontWeight: 700 }}>
            Loved by <strong style={{ color: '#09090B' }}>1,200+ learners</strong> · FYP 2025
          </span>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array(5).fill(0).map((_, i) => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
          </div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          DUAL MODE CARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section id="modes" style={{ padding: '100px 6%', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <span className="section-tag">Dynamic Engine</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 62px)', fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-2px', color: '#09090B', marginTop: 20, marginBottom: 16 }}>
            Two perfectly crafted modes.
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', maxWidth: 520, margin: '0 auto', fontWeight: 600, lineHeight: 1.6 }}>
            Same platform, entirely different realities. The system detects who you are and adapts everything — from colors to code complexity.
          </p>
        </motion.div>

        <div className="dual-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', maxWidth: 1220, margin: '0 auto' }}>

          {/* KIDS CARD */}
          <motion.div
            initial={{ y: 48, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
            style={{ flex: '1 1 480px', position: 'relative', borderRadius: 40, padding: '44px 38px', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 52px rgba(0,0,0,0.06)', overflow: 'hidden' }}
          >
            <Particles side="kids" />
            <div style={{ position: 'relative', zIndex: 2, marginBottom: 36 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FDF2F8', color: '#DB2777', padding: '8px 16px', borderRadius: 99, fontSize: 14, fontWeight: 900, marginBottom: 18, border: '1px solid #FBCFE8' }}>
                <Gamepad2 size={17} /> Age 10–15 · Kids Mode
              </div>
              <h3 style={{ fontSize: 40, fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 14, color: '#09090B' }}>Kids Adventure</h3>
              <p style={{ fontSize: 16, color: '#52525B', lineHeight: 1.65, fontWeight: 600, marginBottom: 22 }}>
                Soft, bouncy, highly interactive. Complex AI theories taught through visual canvases, voice chats, and gamified zone mechanics.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['8 unlockable zones with XP & badges', 'ARIA mascot guides every step', 'Visual + story + logic tasks'].map(f => (
                  <div key={f} className="check-item">
                    <CheckCircle size={15} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} /> {f}
                  </div>
                ))}
              </div>
            </div>
            <ChildModePreview />
          </motion.div>

          {/* PRO CARD */}
          <motion.div
            initial={{ y: 48, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ flex: '1 1 480px', position: 'relative', borderRadius: 40, padding: '44px 38px', background: '#09090B', border: '1px solid #27272A', boxShadow: '0 40px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}
          >
            <div className="beam-border" />
            <Particles side="pro" />
            <div style={{ position: 'relative', zIndex: 2, marginBottom: 36 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1E1B4B', color: '#818CF8', padding: '8px 16px', borderRadius: 99, fontSize: 14, fontWeight: 900, marginBottom: 18, border: '1px solid #312E81' }}>
                <TerminalSquare size={17} /> Age 16+ · Pro Mode
              </div>
              <h3 style={{ fontSize: 40, fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-1.5px', color: '#ffffff', marginBottom: 14 }}>Pro IDE Mode</h3>
              <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.65, fontWeight: 500, marginBottom: 22 }}>
                Minimalist dark mode. Real skill analytics, raw Python sandboxes, deep RAG integration, and an Elo rating system that tracks every answer.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Live Elo rating & skill radar', 'Python sandbox with AI grading', 'RAG-powered context engine'].map(f => (
                  <div key={f} className="check-item" style={{ color: '#A1A1AA' }}>
                    <CheckCircle size={15} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} /> {f}
                  </div>
                ))}
              </div>
            </div>
            <ProModePreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS BENTO ROW
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 6%', maxWidth: 1220, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {PLATFORM_STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ scale: 0.88, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{ textAlign: 'center', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 28, padding: '36px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${s.color}14`, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <s.icon size={24} color={s.color} />
              </div>
              <div style={{ fontSize: 46, fontFamily: "'Syne',sans-serif", fontWeight: 900, color: s.color, marginBottom: 8, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 13, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WORKFLOW SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6%', maxWidth: 1220, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-tag">How It Works</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-1.5px', color: '#09090B', marginTop: 18 }}>The Engine Workflow</h2>
        </motion.div>

        <div className="workflow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {WORKFLOW_STEPS.map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              style={{ padding: '36px 28px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)', position: 'relative' }}
            >
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="hide-mobile" style={{ position: 'absolute', top: 52, right: -22, zIndex: 5, color: '#E4E4E7' }}>
                  <ChevronRight size={20} />
                </div>
              )}
              <div style={{ width: 56, height: 56, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1px solid #F4F4F5', color: '#3B82F6' }}>
                <item.icon size={26} />
              </div>
              <div style={{ fontSize: 11, color: '#A1A1AA', fontFamily: "'DM Mono',monospace", marginBottom: 10, letterSpacing: 2, fontWeight: 800 }}>PHASE {item.step}</div>
              <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginBottom: 10, color: '#09090B' }}>{item.title}</div>
              <div style={{ fontSize: 14, color: '#71717A', lineHeight: 1.65, fontWeight: 600 }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 6%', maxWidth: 1220, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-tag">Testimonials</span>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-1.5px', color: '#09090B', marginTop: 18 }}>Loved by learners.</h2>
        </motion.div>
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1} />)}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ background: '#09090B', borderRadius: 48, padding: '100px 40px', maxWidth: 1100, margin: '0 auto', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.22)' }}
        >
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '200%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '40%', height: '80%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 99, padding: '8px 18px', fontSize: 13, color: '#A1A1AA', fontWeight: 800, marginBottom: 28, fontFamily: "'DM Mono',monospace" }}>
              <Flame size={14} color="#F59E0B" /> FYP 2025 · React + Vite + Supabase
            </div>
            <h2 className="cta-title" style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', fontFamily: "'Syne',sans-serif", fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 22, color: '#ffffff', lineHeight: 1.1 }}>
              Experience the future<br />of AI Education.
            </h2>
            <p style={{ fontSize: 19, color: '#71717A', marginBottom: 52, maxWidth: 520, margin: '0 auto 52px', fontWeight: 500, lineHeight: 1.65 }}>
              Built with modern architecture. Designed for real users. Start exploring the dual-mode platform today.
            </p>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticButton
                onClick={() => navigate('/register')}
                style={{ background: '#ffffff', border: 'none', color: '#09090B', borderRadius: 99, padding: '18px 52px', fontSize: 17, fontFamily: "'Nunito',sans-serif", fontWeight: 900, cursor: 'pointer', boxShadow: '0 14px 32px rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 9 }}
              >
                Create Free Account <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton
                onClick={() => navigate('/login')}
                style={{ background: 'transparent', border: '1.5px solid #3F3F46', color: '#ffffff', borderRadius: 99, padding: '18px 52px', fontSize: 17, fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: 'pointer' }}
              >
                Log In
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #E4E4E7', padding: '44px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
      src="/logo.png" 
      alt="EduAIQuest Logo" 
      style={{ width: '40%', height: '40%', objectFit: 'contain' }} 
    />
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: 14, color: '#71717A', fontWeight: 700, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>

        <div style={{ fontSize: 13, color: '#A1A1AA', fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>
          FYP 2025 · React Vite · FastAPI · Supabase
        </div>
      </footer>

    </div>
  )
}