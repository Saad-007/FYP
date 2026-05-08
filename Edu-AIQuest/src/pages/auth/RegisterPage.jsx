import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // ── Age Calculator ─────────────────────────────
  const calcAge = (dob) => {
    const today = new Date()
    const birth = new Date(dob)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  // ── Step 1 Validation ──────────────────────────
  const handleStep1 = () => {
    setError('')
    if (!form.fullName.trim()) return setError('Please enter your full name.')
    if (!form.email.includes('@')) return setError('Please enter a valid email.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setStep(2)
  }

  // ── Step 2 Submit → Supabase ───────────────────
  // ── Step 2 Submit → Supabase ───────────────────
  const handleRegister = async () => {
    setError('')
    if (!form.dateOfBirth) return setError('Date of birth is required.')
    const age = calcAge(form.dateOfBirth)
    if (age < 10) return setError('You must be at least 10 years old to join.')
    if (age > 100) return setError('Please enter a valid date of birth.')

    setLoading(true)
    console.log('Calling signUp...')

    try {
      // 🚀 CRITICAL FIX: Logout first to clear any stuck local browser sessions
      // Iske baghair same browser mein doosra account banate waqt app freeze ho jati hai.
      await supabase.auth.signOut()

      // 1. Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            date_of_birth: form.dateOfBirth,
          }
        }
      })

      if (error) throw error
      if (!data.user) throw new Error('No user returned.')

      // 2. Check if Supabase requires email confirmation
      if (data.session === null) {
        // Session is null because the user needs to click the link in their email
        setError('Account created! Please check your email to verify your account before logging in.')
        // We return here so it doesn't navigate to /profile-setup yet
        return 
      }

      // 3. If session exists (Email Confirmation is OFF), they are auto-logged in!
      console.log('Auto-login successful, navigating...')
      navigate('/profile-setup')

    } catch (err) {
      console.error('Error:', err.message)
      // Provide a friendlier message if they try to sign up twice
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Try logging in.')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <style>{fonts}</style>

      {/* Background */}
      <div style={styles.bgGlow} />
      <div style={styles.bgGrid} />

      {/* Card */}
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={styles.card}>

        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate('/')}>
          <span style={{ color: '#4F8EF7' }}>Edu</span>
          <span style={{ color: '#FF6B9D' }}>AI</span>
          <span style={{ color: '#09090B' }}>Quest</span>
        </div>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          {[1, 2].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ ...styles.stepDot, background: step >= n ? '#4F8EF7' : '#E4E4E7', color: step >= n ? '#fff' : '#A1A1AA' }}>{n}</div>
              <span style={{ fontSize: 12, color: step >= n ? '#4F8EF7' : '#A1A1AA', fontWeight: 600 }}>
                {n === 1 ? 'Account' : 'Your Age'}
              </span>
              {n < 2 && <div style={{ width: 32, height: 1, background: step > n ? '#4F8EF7' : '#E4E4E7', margin: '0 6px' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
              <h2 style={styles.title}>Create account</h2>
              <p style={styles.sub}>Join EduAIQuest and start your learning quest.</p>

              <Input label="Full Name" placeholder="Ahmed Raza" value={form.fullName}
                onChange={v => set('fullName', v)} type="text" />
              <Input label="Email" placeholder="ahmed@example.com" value={form.email}
                onChange={v => set('email', v)} type="email" />
              <div style={{ position: 'relative' }}>
                <Input label="Password" placeholder="Min. 6 characters" value={form.password}
                  onChange={v => set('password', v)} type={showPass ? 'text' : 'password'} />
                <button onClick={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                  {showPass ? <EyeOff size={16} color="#A1A1AA" /> : <Eye size={16} color="#A1A1AA" />}
                </button>
              </div>

              <AnimatePresence>
                {error && <ErrorMsg msg={error} />}
              </AnimatePresence>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleStep1} style={styles.primaryBtn}>
                Continue <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
              <h2 style={styles.title}>When were you born?</h2>
              <p style={styles.sub}>
                This determines your learning mode.{' '}
                <span style={{ color: '#FF6B9D', fontWeight: 700 }}>Age 10–15</span> → Kids Mode &nbsp;|&nbsp;
                <span style={{ color: '#4F8EF7', fontWeight: 700 }}>Age 16+</span> → Pro Mode
              </p>

              <Input label="Date of Birth" placeholder="" value={form.dateOfBirth}
                onChange={v => set('dateOfBirth', v)} type="date" />

              {/* Age preview */}
              {form.dateOfBirth && (() => {
                const age = calcAge(form.dateOfBirth)
                const isKids = age >= 10 && age <= 15
                const isPro = age >= 16
                return (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: isKids ? '#FDF2F8' : isPro ? '#EFF6FF' : '#FEF2F2', border: `1px solid ${isKids ? '#FBCFE8' : isPro ? '#BFDBFE' : '#FECACA'}`, borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 700, color: isKids ? '#DB2777' : isPro ? '#1D4ED8' : '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isPro ? '💼' : isKids ? '🎮' : '⚠️'}
                    {isPro ? `Age ${age} — You'll enter Pro Career Mode` :
                      isKids ? `Age ${age} — You'll enter Kids Adventure Mode` :
                        `Age ${age} — Must be between 10 and 100`}
                  </motion.div>
                )
              })()}

              <AnimatePresence>
                {error && <ErrorMsg msg={error} />}
              </AnimatePresence>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleRegister} disabled={loading} style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : <>Create Account 🎓</>}
              </motion.button>

              <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
            </motion.div>
          )}

        </AnimatePresence>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F8EF7', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── Reusable Input ─────────────────────────────────────────────────────────
function Input({ label, value, onChange, type, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
        style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E4E4E7', borderRadius: 12, fontSize: 15, fontFamily: "'Nunito',sans-serif", outline: 'none', color: '#09090B', background: '#FAFAFA', transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#4F8EF7'}
        onBlur={e => e.target.style.borderColor = '#E4E4E7'}
      />
    </div>
  )
}

// ── Error Message ──────────────────────────────────────────────────────────
function ErrorMsg({ msg }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontWeight: 600, marginBottom: 14 }}>
      ⚠️ {msg}
    </motion.div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`

const styles = {
  wrapper: { minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', fontFamily: "'Nunito',sans-serif" },
  bgGlow: { position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(79,142,247,0.1) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 },
  bgGrid: { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 },
  card: { position: 'relative', zIndex: 10, background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 28, padding: '44px 40px', width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.06)' },
  logo: { fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 28, cursor: 'pointer', letterSpacing: '-0.5px' },
  stepRow: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 28 },
  stepDot: { width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, transition: 'all 0.3s' },
  title: { fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: '#09090B', marginBottom: 8, letterSpacing: '-0.5px' },
  sub: { fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 24 },
  primaryBtn: { width: '100%', padding: '14px', background: '#09090B', border: 'none', color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  backBtn: { width: '100%', padding: '12px', background: 'transparent', border: '1.5px solid #E4E4E7', color: '#71717A', borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', marginBottom: 12 },
  eyeBtn: { position: 'absolute', right: 14, bottom: 28, background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  switchText: { textAlign: 'center', fontSize: 14, color: '#71717A' },
}