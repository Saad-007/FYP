import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { saveCareerTrack, initTrackProgress } from '../../lib/db'
import { useAuthStore } from '../../store/authStore'
import {
  Database, Cpu, Brain, ChevronRight, Check,
  Sparkles, ArrowRight, Star, Zap, Lock
} from 'lucide-react'

// ─── TRACK DATA ───────────────────────────────────────────────────────────────
const TRACKS = [
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    tagline: 'Turn raw data into decisions',
    level: 'Intermediate',
    levelColor: '#4F8EF7',
    icon: Database,
    accent: '#4F8EF7',
    glow: 'rgba(79,142,247,0.15)',
    border: 'rgba(79,142,247,0.3)',
    description:
      'Master Python, Pandas, and ML algorithms. Build models that predict customer churn, detect fraud, and extract insight from millions of rows.',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'Statistics', 'Data Viz'],
    modules: 14,
    duration: '8–10 weeks',
    projects: 3,
    outcome: 'Junior Data Scientist',
  },
  {
    id: 'ml_engineer',
    title: 'ML Engineer',
    tagline: 'Ship models to production at scale',
    level: 'Advanced',
    levelColor: '#A78BFA',
    icon: Cpu,
    accent: '#A78BFA',
    glow: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.3)',
    description:
      'Go beyond notebooks. Learn MLOps, Docker, FastAPI, and cloud deployment. Build systems that serve millions of predictions per second.',
    skills: ['TensorFlow', 'PyTorch', 'Docker', 'FastAPI', 'MLOps'],
    modules: 18,
    duration: '10–12 weeks',
    projects: 4,
    outcome: 'ML Engineer',
  },
  {
    id: 'ai_researcher',
    title: 'AI Researcher',
    tagline: 'Push the frontier of what AI can do',
    level: 'Expert',
    levelColor: '#F472B6',
    icon: Brain,
    accent: '#F472B6',
    glow: 'rgba(244,114,182,0.15)',
    border: 'rgba(244,114,182,0.3)',
    description:
      'Implement Transformers, diffusion models, and RLHF from scratch. Read and reproduce state-of-the-art papers. Contribute to the field.',
    skills: ['Deep Learning', 'NLP', 'Computer Vision', 'Research', 'Math'],
    modules: 22,
    duration: '12–16 weeks',
    projects: 5,
    outcome: 'AI Research Engineer',
  },
]

// ─── TRACK CARD ───────────────────────────────────────────────────────────────
function TrackCard({ track, selected, hovered, onSelect, onHover, onLeave, index }) {
  const Icon = track.icon
  const isSelected = selected?.id === track.id
  const isHovered  = hovered === track.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(track)}
      onMouseEnter={() => onHover(track.id)}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        background: isSelected
          ? `linear-gradient(145deg, ${track.glow}, rgba(20,23,25,0.95))`
          : isHovered
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSelected ? track.border : isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: '28px 26px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: isSelected ? `0 0 40px ${track.glow}` : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 24, height: 24, borderRadius: '50%',
              background: track.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Check size={13} color="#000" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow blob */}
      {isSelected && (
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: track.glow, filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${track.accent}18`,
        border: `1px solid ${track.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transition: 'all 0.2s',
        boxShadow: isSelected ? `0 0 20px ${track.accent}30` : 'none',
      }}>
        <Icon size={22} color={track.accent} strokeWidth={1.5} />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F1F3F5', letterSpacing: '-0.02em', margin: 0 }}>
            {track.title}
          </h3>
          <span style={{
            fontSize: 10, fontWeight: 700,
            padding: '2px 8px', borderRadius: 20,
            color: track.accent,
            background: `${track.accent}18`,
            border: `1px solid ${track.accent}30`,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {track.level}
          </span>
        </div>
        <p style={{ fontSize: 13, color: track.accent, margin: 0, fontWeight: 500 }}>
          {track.tagline}
        </p>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, marginBottom: 20, margin: '0 0 20px' }}>
        {track.description}
      </p>

      {/* Skills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {track.skills.map(skill => (
          <span key={skill} style={{
            fontSize: 11, fontWeight: 500,
            padding: '3px 9px', borderRadius: 6,
            color: '#9CA3AF',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 0,
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { label: 'Modules', value: track.modules },
          { label: 'Duration', value: track.duration },
          { label: 'Projects', value: track.projects },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1, textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F3F5', marginBottom: 2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CareerTrackSelector() {
  const navigate          = useNavigate()
  const { profile }       = useAuthStore()
  const [selected, setSelected]   = useState(null)
  const [hovered, setHovered]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [step, setStep]           = useState('select') // 'select' | 'confirm'

  // If already has a track, skip this screen
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return navigate('/login')
      const { data } = await supabase
        .from('profiles')
        .select('career_track')
        .eq('id', session.user.id)
        .maybeSingle()
      if (data?.career_track) {
        navigate('/pro/dashboard', { replace: true })
      }
    }
    check()
  }, [navigate])

  const handleContinue = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase
        .from('profiles')
        .update({ career_track: selected.id })
        .eq('id', session.user.id)
      navigate('/pro/dashboard', { replace: true })
    } catch {
      setSaving(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0F12',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#F1F3F5',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #252830; border-radius: 99px; }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: '#4F8EF7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.03em' }}>EduAIQuest</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Profile', 'Track', 'Dashboard'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i <= 1 ? '#4F8EF7' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${i <= 1 ? '#4F8EF7' : 'rgba(255,255,255,0.12)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  color: i <= 1 ? '#fff' : '#4B5563',
                }}>
                  {i < 1 ? <Check size={10} strokeWidth={3} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i <= 1 ? '#9CA3AF' : '#374151' }}>{s}</span>
              </div>
              {i < 2 && <ChevronRight size={12} color="#374151" />}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#374151' }}>
          {profile?.username && `Hi, ${profile.username}`}
        </div>
      </motion.header>

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 1, flex: 1, padding: '48px 24px 80px', maxWidth: 1080, margin: '0 auto', width: '100%' }}>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(79,142,247,0.1)',
            border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: 20, padding: '5px 14px',
            fontSize: 12, fontWeight: 600, color: '#4F8EF7',
            marginBottom: 20,
          }}>
            <Star size={12} fill="#4F8EF7" /> Phase 3 — Pro Career Learning
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, letterSpacing: '-0.04em',
            color: '#F1F3F5', marginBottom: 14, lineHeight: 1.1,
          }}>
            Choose Your Career Track
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Select a path that aligns with your goals. You can switch later, but your progress is tracked per track.
          </p>
        </motion.div>

        {/* Track cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
          marginBottom: 40,
        }}>
          {TRACKS.map((track, i) => (
            <TrackCard
              key={track.id}
              track={track}
              index={i}
              selected={selected}
              hovered={hovered}
              onSelect={setSelected}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>

        {/* Selected summary + CTA */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${selected.accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <selected.icon size={20} color={selected.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F3F5', marginBottom: 2 }}>
                    {selected.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    {selected.modules} modules · {selected.duration} · {selected.projects} real-world projects
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  fontSize: 12, color: '#6B7280',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Zap size={13} color={selected.accent} />
                  Outcome: <span style={{ color: selected.accent, fontWeight: 600 }}>{selected.outcome}</span>
                </div>
                <button
                  onClick={handleContinue}
                  disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: selected.accent,
                    color: '#000',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14, fontWeight: 700,
                    cursor: saving ? 'default' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = saving ? '0.7' : '1' }}
                >
                  {saving ? 'Saving…' : 'Continue to Dashboard'}
                  {!saving && <ArrowRight size={16} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No selection hint */}
        {!selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ textAlign: 'center', fontSize: 13, color: '#374151' }}
          >
            Click a track above to select it
          </motion.p>
        )}
      </main>
    </div>
  )
}
