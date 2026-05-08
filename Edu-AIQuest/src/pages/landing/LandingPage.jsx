import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  BrainCircuit, Gamepad2, TerminalSquare, Mic, 
  Map, Puzzle, Bot, PenTool, ArrowRight, ShieldCheck, 
  Star, Code2, LineChart, Sparkles, UserPlus, Split, Target, TrendingUp
} from 'lucide-react'

// ── Background Noise Texture ─────────────────────────────────────────────
const NoiseBg = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4, pointerEvents: 'none', mixBlendMode: 'overlay',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
)

// ── Floating Particles for Cards ─────────────────────────────────────────
function Particles({ side }) {
  const count = 12
  const isKids = side === 'kids'
  const kidsColors = ['#F472B6', '#FBBF24', '#34D399', '#2DD4BF']
  const proColors = ['#60A5FA', '#A78BFA', '#38BDF8', '#818CF8']
  
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 6 + 4
        const x = Math.random() * 100
        const delay = Math.random() * 5
        const dur = Math.random() * 10 + 8
        return (
          <motion.div key={i}
            style={{ 
              position: 'absolute', left: `${x}%`, bottom: '-10%', 
              width: size, height: size, borderRadius: '50%',
              background: isKids ? kidsColors[i % 4] : proColors[i % 4], 
              opacity: isKids ? 0.3 : 0.15 
            }}
            animate={{ y: [0, -400], opacity: [0, 0.5, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }} 
          />
        )
      })}
    </div>
  )
}

// ── Advanced Child Mode Preview ──────────────────────────────────────────
function ChildModePreview() {
  const [activeTask, setActiveTask] = useState(0)
  const tasks = [
    { icon: <Bot size={18} color="#EC4899"/>, name: "Fix the Robot", color: "#FDF2F8", border: "#FBCFE8" },
    { icon: <Mic size={18} color="#8B5CF6"/>, name: "Voice AI Buddy", color: "#F5F3FF", border: "#DDD6FE" },
    { icon: <Puzzle size={18} color="#F59E0B"/>, name: "Logic Blocks", color: "#FFFBEB", border: "#FDE68A" }
  ]

  useEffect(() => {
    const t = setInterval(() => setActiveTask(p => (p + 1) % tasks.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <div style={{ position: 'absolute', top: -30, left: -30, width: 150, height: 150, background: '#F472B6', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.3 }} />
      <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
        style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: 28, padding: 24, boxShadow: '0 24px 48px rgba(0,0,0,0.04)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FCA5A5' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FDE047' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#86EFAC' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FEF3C7', padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 800, color: '#D97706' }}>
            <Star size={14} fill="#F59E0B" /> 2,450 XP
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Map size={24} color="#3B82F6" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A8A' }}>AI World Map</span>
          </div>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PenTool size={24} color="#10B981" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#064E3B' }}>Draw Mode</span>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Current Quest</div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTask} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, background: tasks[activeTask].color, border: `1px solid ${tasks[activeTask].border}`, borderRadius: 16, padding: '16px', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
            <div style={{ background: '#fff', padding: 8, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              {tasks[activeTask].icon}
            </div>
            {tasks[activeTask].name}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ── Advanced Pro Mode Preview ────────────────────────────────────────────
function ProModePreview() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <div style={{ position: 'absolute', bottom: -30, right: -30, width: 180, height: 180, background: '#3B82F6', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3 }} />
      <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
        style={{ position: 'relative', zIndex: 10, background: '#09090B', border: '1px solid #27272A', borderRadius: 28, padding: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: '#18181B', border: '1px solid #27272A', padding: 6, borderRadius: 8 }}><Code2 size={16} color="#A1A1AA" /></div>
            <span style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: '#E4E4E7', fontWeight: 500 }}>AI_Engineer.py</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> Elo: 1640
          </span>
        </div>

        <div style={{ marginBottom: 24 }}>
          {[{ n: 'Python', p: 85, c: '#3B82F6' }, { n: 'Vector DBs', p: 60, c: '#8B5CF6' }, { n: 'RAG Logic', p: 92, c: '#10B981' }].map(s => (
            <div key={s.n} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#A1A1AA', marginBottom: 6 }}>
                <span>{s.n}</span><span style={{ color: s.c }}>{s.p}%</span>
              </div>
              <div style={{ background: '#18181B', height: 4, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.p}%` }} transition={{ duration: 1, delay: 0.2 }}
                  style={{ height: '100%', background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#000000', borderRadius: 16, padding: 16, border: '1px solid #27272A', fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.6, color: '#D4D4D8' }}>
          <span style={{ color: '#F472B6' }}>from</span>
          <span style={{ color: '#60A5FA' }}> langchain</span>
          <span style={{ color: '#F472B6' }}> import</span>
          <span> OpenAI</span><br/>
          <span style={{ color: '#F472B6' }}>def</span>
          <span style={{ color: '#FDE047' }}> update_elo</span>
          <span>(score):</span><br/>
          <span style={{ marginLeft: 16 }}>rating += score * </span>
          <span style={{ color: '#A78BFA' }}>32</span><br/>
          <span style={{ marginLeft: 16, color: '#F472B6' }}>return</span>
          <span> rating</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: 6, height: 14, background: '#60A5FA', marginLeft: 4, verticalAlign: 'middle' }} />
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Landing Page Component ──────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', color: '#09090B', fontFamily: "'Nunito',sans-serif", overflowX: 'hidden', position: 'relative' }}>
      <NoiseBg />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&family=DM+Mono:wght@500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection { background: rgba(59,130,246,0.2); }
        .glass-nav { background: rgba(250,250,250,0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        .border-beam {
          position: absolute; inset: -2px; border-radius: 34px; z-index: -1;
          background: conic-gradient(from 0deg, transparent 70%, #3B82F6 80%, #EC4899 100%);
          animation: spin 4s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* ── NAVBAR ── */}
{/* ── NAVBAR ── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-nav"
        style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: 1200, height: 64, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  {/* Yahan '/logo.png' ki jagah apni file ka exact naam likhein */}
  <img src="/FullLogo.png" alt="App Logo" style={{ height: 38, objectFit: 'contain' }} />
  
  {/* Agar aap logo ke sath text bhi dikhana chahte hain to is line ko rehne dein, warna mita dein */}
  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>EduAIQuest.</span>
</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: '#52525B', fontWeight: 700, padding: '8px 16px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" }}>Log in</button>
          <button onClick={() => navigate('/register')} style={{ background: '#09090B', border: 'none', color: '#fff', fontWeight: 700, padding: '8px 20px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>Get Started</button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section ref={heroRef} style={{ y: heroY, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 6% 80px', textAlign: 'center', position: 'relative' }}>
        
        {/* Soft Center Glow */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', maxWidth: 800, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.15), transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#52525B', fontWeight: 700, marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <Sparkles size={14} color="#3B82F6" /> Next-Gen AI Learning Platform
          </motion.div>

          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(52px, 8vw, 96px)', fontFamily: "'Syne',sans-serif", fontWeight: 800, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: 24, color: '#09090B' }}>
            Master AI.<br />
            <span style={{ color: '#A1A1AA' }}>Built for your</span> <span style={{ background: 'linear-gradient(to right, #3B82F6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>mind.</span>
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 20, color: '#52525B', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 40px', fontWeight: 500 }}>
            One platform, two entirely different aesthetic experiences. Whether you are 10 or 25, the AI transforms its UI, difficulty, and tone specifically for you.
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#09090B', border: 'none', color: '#fff', padding: '16px 36px', borderRadius: 99, fontSize: 17, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              Start the Quest <ArrowRight size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => document.getElementById('modes').scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#ffffff', border: '1px solid #E4E4E7', color: '#09090B', padding: '16px 36px', borderRadius: 99, fontSize: 17, fontWeight: 700, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Explore Modes
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* ── THE AESTHETIC DUAL MODE CARDS ── */}
      <section id="modes" style={{ padding: '80px 6%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <div style={{ fontSize: 13, color: '#71717A', fontFamily: "'DM Mono',monospace", letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Architecture</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '-2px', color: '#09090B' }}>
            Two perfectly crafted modes.
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center', maxWidth: 1200, margin: '0 auto' }}>
          
          {/* CHILD MODE CARD */}
          <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ flex: '1 1 450px', position: 'relative', borderRadius: 32, padding: '48px 32px', background: '#ffffff', border: '1px solid #E4E4E7', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <Particles side="kids" />
            <div style={{ position: 'relative', zIndex: 2, marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FDF2F8', color: '#DB2777', padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 800, marginBottom: 16 }}>
                <Gamepad2 size={16} /> Age 10–15
              </div>
              <h3 style={{ fontSize: 36, fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Kids Adventure</h3>
              <p style={{ fontSize: 16, color: '#71717A', lineHeight: 1.6 }}>Soft, bouncy, and highly interactive. Learning complex AI theories through visual canvases, voice chats, and game mechanics.</p>
            </div>
            <ChildModePreview />
          </motion.div>

          {/* PRO MODE CARD (Hacker Mode) */}
          <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ flex: '1 1 450px', position: 'relative', borderRadius: 32, padding: '48px 32px', background: '#000000', border: '1px solid #27272A', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div className="border-beam" />
            <Particles side="pro" />
            <div style={{ position: 'relative', zIndex: 2, marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1E1B4B', color: '#818CF8', padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 800, marginBottom: 16 }}>
                <TerminalSquare size={16} /> Age 16+
              </div>
              <h3 style={{ fontSize: 36, fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '-1px', color: '#ffffff', marginBottom: 12 }}>Pro IDE Mode</h3>
              <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6 }}>Minimalist dark mode. Real skill analytics mapping, raw Python code sandboxes, and deep technical RAG integration.</p>
            </div>
            <ProModePreview />
          </motion.div>

        </div>
      </section>

      {/* ── HOW IT WORKS (Restored & Upgraded) ── */}
      <section style={{ padding: '80px 6%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '-1px', color: '#0F172A' }}>The Engine Workflow</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            { step: '01', icon: <UserPlus size={24} />, title: 'Identity', desc: 'Secure profile creation. Age detection rules engine.' },
            { step: '02', icon: <Split size={24} />, title: 'Router Split', desc: 'Dynamic UI rendering based on demographic bracket.' },
            { step: '03', icon: <Target size={24} />, title: 'RAG Pipeline', desc: 'Langchain fetches verified concepts via Pinecone/Supabase.' },
            { step: '04', icon: <TrendingUp size={24} />, title: 'Elo Adjust', desc: 'Algorithm calculates response and tweaks difficulty live.' },
          ].map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ flex: '1 1 220px', maxWidth: 260, padding: '32px 24px', background: '#ffffff', borderRadius: 24, border: '1px solid #E4E4E7', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F4F4F5', color: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 11, color: '#A1A1AA', fontFamily: "'DM Mono',monospace", marginBottom: 8, letterSpacing: 1.5, fontWeight: 700 }}>PHASE {item.step}</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 10, color: '#0F172A' }}>{item.title}</div>
              <div style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6 }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STATS SECTION (Restored & Upgraded) ── */}
      <section style={{ padding: '60px 6%', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { val: 'RAG', label: 'AI Architecture', color: '#3B82F6' },
            { val: 'Elo', label: 'Rating Algorithm', color: '#8B5CF6' },
            { val: '2', label: 'Distinct Interfaces', color: '#EC4899' },
            { val: '100%', label: 'Custom Built', color: '#10B981' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center', background: '#ffffff', border: `1px solid #E4E4E7`, borderRadius: 24, padding: '32px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
              <div style={{ fontSize: 42, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.val}</div>
              <div style={{ fontSize: 14, color: '#71717A', fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LARGE CTA SECTION (Restored & Upgraded) ── */}
      <section style={{ padding: '100px 6%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
          style={{ background: '#09090B', borderRadius: 40, padding: '80px 40px', maxWidth: 1000, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <h2 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(32px, 5vw, 64px)', fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '-2px', marginBottom: 24, color: '#ffffff' }}>
            Experience the future<br />of AI Education.
          </h2>
          <p style={{ position: 'relative', zIndex: 1, fontSize: 18, color: '#A1A1AA', marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
            Built with modern architecture. Designed for real users. Start exploring the dual-mode platform today.
          </p>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              style={{ background: '#ffffff', border: 'none', color: '#09090B', borderRadius: 99, padding: '18px 48px', fontSize: 17, fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(255,255,255,0.1)' }}>
              Create Free Account
            </motion.button>
            <motion.button whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              style={{ background: 'transparent', border: '1px solid #3F3F46', color: '#ffffff', borderRadius: 99, padding: '18px 48px', fontSize: 17, fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer' }}>
              Log In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #E4E4E7', padding: '40px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  <img src="/FullLogo.png" alt="App Logo" style={{ height: 28, objectFit: 'contain', filter: 'grayscale(100%) opacity(80%)' }} />
  <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>EduAIQuest.</span>
</div>
        <div style={{ fontSize: 13, color: '#71717A', fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>
          FYP 2025 · React Vite · FastAPI · Supabase
        </div>
      </footer>

    </div>
  )
}