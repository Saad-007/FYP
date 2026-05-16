import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { 
  Loader2, Check, Bot, Cpu, Terminal, Puzzle, Settings, Palette, 
  Mic, Calculator, Code2, BrainCircuit, BarChart3, Network, 
  MessageSquare, Eye, Database, Blocks, User, ArrowRight, Sparkles 
} from 'lucide-react'

const KIDS_TOPICS = [
  { id: 'what_is_ai', label: 'What is AI?', icon: <Bot size={20} /> },
  { id: 'robots', label: 'Robots & Logic', icon: <Cpu size={20} /> },
  { id: 'coding_basics', label: 'Coding Basics', icon: <Terminal size={20} /> },
  { id: 'pattern_puzzles', label: 'Pattern Puzzles', icon: <Puzzle size={20} /> },
  { id: 'smart_machines', label: 'Smart Machines', icon: <Settings size={20} /> },
  { id: 'ai_art', label: 'AI & Drawing', icon: <Palette size={20} /> },
  { id: 'voice_bots', label: 'Talking Bots', icon: <Mic size={20} /> },
  { id: 'fun_math', label: 'Math for AI', icon: <Calculator size={20} /> },
]

const PRO_TOPICS = [
  { id: 'python', label: 'Python', icon: <Code2 size={20} /> },
  { id: 'ml', label: 'Machine Learning', icon: <BrainCircuit size={20} /> },
  { id: 'data_science', label: 'Data Science', icon: <BarChart3 size={20} /> },
  { id: 'deep_learning', label: 'Deep Learning', icon: <Network size={20} /> },
  { id: 'nlp', label: 'NLP', icon: <MessageSquare size={20} /> },
  { id: 'computer_vision', label: 'Computer Vision', icon: <Eye size={20} /> },
  { id: 'rag_llm', label: 'RAG & LLMs', icon: <Database size={20} /> },
  { id: 'data_engineering', label: 'Data Engineering', icon: <Blocks size={20} /> },
]

const calcAge = (dob) => {
  if (!dob) return 0
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const NoiseBg = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.35, pointerEvents: 'none', mixBlendMode: 'overlay',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
)

export default function ProfileSetup() {
  const navigate = useNavigate()
  
  // 🚀 Sirf 1 Loading State (Global)
  const { user, profile, loading: authLoading, setProfile } = useAuthStore()

  const [username, setUsername] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // 🚀 MAGIC: Derived State (No useEffect needed for age!)
  // Ye khud ba khud calculate hoga jaise hi user ka data aayega
  const dob = user?.user_metadata?.date_of_birth || profile?.date_of_birth
  const userAge = dob ? calcAge(dob) : 0
  const isKids = userAge >= 10 && userAge <= 15
  const topicsToShow = isKids ? KIDS_TOPICS : PRO_TOPICS

  // Security Check: Agar auth load ho gaya aur user null hai, to wapis Login bhej do
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  const toggleTopic = (id) => {
    setSelectedTopics(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id])
  }

const handleSave = async () => {
    setError('')
    if (username.trim().length < 3) return setError('Username must be at least 3 characters.')
    if (selectedTopics.length === 0) return setError('Please select at least one topic.')

    setIsSaving(true)
    try {
      // 💡 Pro Tip: Agar naya user hai aur profile row abhi exist nahi karti, 
      // toh .upsert() use karna behtar hai .update() ki jagah.
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, // ID dena zaroori hai upsert ke liye
          username: username.trim(), 
          topics: selectedTopics,
          date_of_birth: dob // date of birth bhi save karlein DB me
        }) 

      if (updateError) {
        if (updateError.message.includes('unique')) throw new Error('Username already taken. Please choose another.')
        throw updateError
      }
      
      // 🚀 FIX 2: Navigate karne se PEHLE local store update karein
      setProfile({
        ...profile,
        id: user.id,
        username: username.trim(),
        topics: selectedTopics,
        date_of_birth: dob
      })

      navigate(isKids ? '/kids/dashboard' : '/pro/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to save profile.')
    } finally {
      setIsSaving(false)
    }
  }
  // 🚀 MAIN RENDER BLOCK: Agar App.jsx load kar raha hai, toh loader dikhao
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#3B82F6' }} />
        <p style={{ fontSize: 14, color: '#A1A1AA', fontFamily: "'Nunito',sans-serif" }}>Analyzing profile parameters...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // Agar user ghaib hai, to empty screen dikhao jab tak redirect na ho jaye
  if (!user) return null

  // Theme Variables
  const bgMain = isKids ? '#FAFAFA' : '#000000'
  const cardBg = isKids ? '#ffffff' : '#09090B'
  const textPrimary = isKids ? '#09090B' : '#ffffff'
  const textSecondary = isKids ? '#71717A' : '#A1A1AA'
  const borderCol = isKids ? '#E4E4E7' : '#27272A'
  const accentColor = isKids ? '#EC4899' : '#3B82F6'
  const inputBg = isKids ? '#F4F4F5' : '#18181B'

  return (
    <div style={{ minHeight: '100vh', background: bgMain, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', fontFamily: "'Nunito',sans-serif", overflow: 'hidden' }}>
      <NoiseBg />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${isKids ? 'rgba(236,72,153,0.2)' : 'rgba(59,130,246,0.2)'}; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px ${inputBg} inset !important; -webkit-text-fill-color: ${textPrimary} !important; }
      `}</style>

      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80vw', maxWidth: 800, height: 500, background: isKids ? 'radial-gradient(ellipse,rgba(236,72,153,0.08) 0%,transparent 60%)' : 'radial-gradient(ellipse,rgba(59,130,246,0.1) 0%,transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 32, padding: '48px 40px', width: '100%', maxWidth: 580, boxShadow: isKids ? '0 25px 50px rgba(0,0,0,0.04)' : '0 30px 60px rgba(0,0,0,0.4)' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            style={{ width: 64, height: 64, borderRadius: 20, background: isKids ? '#FDF2F8' : '#1E1B4B', color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 24px ${isKids ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)'}` }}>
            {isKids ? <Sparkles size={32} /> : <Terminal size={32} />}
          </motion.div>

          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: textPrimary, marginBottom: 12, letterSpacing: '-0.5px' }}>
            {isKids ? "Create Your Explorer Profile" : "Initialize Workspace"}
          </h2>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isKids ? '#F4F4F5' : '#18181B', border: `1px solid ${borderCol}`, borderRadius: 99, padding: '6px 16px', fontSize: 13, color: textSecondary, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
            Age {userAge} — {isKids ? 'Kids Mode' : 'Pro Mode'}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>
            <User size={16} color={accentColor} /> {isKids ? 'Choose an Avatar Name' : 'Developer Handle'}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: textSecondary, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>@</span>
            <input value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
              placeholder={isKids ? 'ai_ninja_99' : 'johndoe_ai'}
              maxLength={20}
              style={{ width: '100%', padding: '16px 16px 16px 36px', background: inputBg, border: `1px solid ${borderCol}`, borderRadius: 16, fontSize: 16, fontFamily: "'DM Mono',monospace", outline: 'none', color: textPrimary, transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
              onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.boxShadow = `0 0 0 3px ${isKids ? 'rgba(236,72,153,0.1)' : 'rgba(59,130,246,0.1)'}` }}
              onBlur={e => { e.target.style.borderColor = borderCol; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>
              {isKids ? 'Select your Quests' : 'Select Core Tracks'}
            </label>
            <span style={{ fontSize: 12, color: textSecondary, fontWeight: 600 }}>{selectedTopics.length} selected</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {topicsToShow.map((t, index) => {
              const active = selectedTopics.includes(t.id)
              return (
                <motion.button key={t.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => toggleTopic(t.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
                    padding: '16px', borderRadius: 20, textAlign: 'left',
                    background: active ? (isKids ? '#FDF2F8' : 'rgba(59,130,246,0.1)') : inputBg,
                    border: `1.5px solid ${active ? accentColor : borderCol}`,
                    color: active ? (isKids ? '#BE185D' : '#60A5FA') : textSecondary,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: active ? `0 4px 12px ${isKids ? 'rgba(236,72,153,0.1)' : 'rgba(59,130,246,0.1)'}` : 'none'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ color: active ? accentColor : textSecondary }}>{t.icon}</div>
                    {active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={16} color={accentColor} /></motion.div>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif", lineHeight: 1.2 }}>{t.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ background: '#7F1D1D', border: '1px solid #B91C1C', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#FECACA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: '#DC2626', borderRadius: '50%', width: 6, height: 6 }} /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave} disabled={isSaving}
          style={{ 
            width: '100%', padding: '18px', 
            background: isKids ? '#EC4899' : '#ffffff', 
            color: isKids ? '#ffffff' : '#09090B', 
            border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, fontFamily: "'Nunito',sans-serif", 
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, 
            opacity: isSaving ? 0.75 : 1, 
            boxShadow: isKids ? '0 10px 25px rgba(236,72,153,0.3)' : '0 10px 25px rgba(255,255,255,0.1)' 
          }}>
          {isSaving 
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> 
            : <>{isKids ? 'Start Adventure' : 'Launch Workspace'} <ArrowRight size={18} /></>}
        </motion.button>

      </motion.div>
    </div>
  )
}