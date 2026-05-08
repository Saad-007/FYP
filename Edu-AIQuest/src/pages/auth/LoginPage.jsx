import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (!password) return setError('Please enter your password.')

    setLoading(true)
    console.log('1. Login process started...')

    try {
      console.log('2. Calling signInWithPassword...')
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      
      console.log('3. signInWithPassword returned! Data:', data, 'Error:', loginError)
      if (loginError) throw loginError

      console.log('4. Fetching user profile from database...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      console.log('5. Profile fetch returned! Profile:', profile, 'Error:', profileError)

      if (profileError || !profile || !profile.date_of_birth) {
        console.log('6a. Profile not found or incomplete, redirecting to setup...')
        navigate('/profile-setup')
        return
      }

      const age = calcAge(profile.date_of_birth)
      console.log('6b. Age calculated:', age)

      if (age >= 16) {
        console.log('7. Redirecting to Pro Dashboard')
        navigate('/pro/dashboard')
      } else if (age >= 10) {
        console.log('7. Redirecting to Kids Dashboard')
        navigate('/kids/dashboard')
      } else {
        console.log('7. Redirecting to Profile Setup (Age issue)')
        navigate('/profile-setup')
      }

    } catch (err) {
      console.error('❌ CATCH BLOCK TRIGGERED:', err)
      if (err.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      console.log('8. Finally block running. Setting loading to false.')
      setLoading(false)
    }
  }

  const calcAge = (dob) => {
    const today = new Date()
    const birth = new Date(dob)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  return (
    <div style={styles.wrapper}>
      <style>{fonts}</style>
      <div style={styles.bgGlow} />
      <div style={styles.bgGrid} />

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.card}>

        <div style={styles.logo} onClick={() => navigate('/')}>
          <span style={{ color: '#4F8EF7' }}>Edu</span>
          <span style={{ color: '#FF6B9D' }}>AI</span>
          <span style={{ color: '#09090B' }}>Quest</span>
        </div>

        <h2 style={styles.title}>Welcome back 👋</h2>
        <p style={styles.sub}>Log in to continue your learning quest.</p>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            placeholder="ahmed@example.com" style={styles.input}
            onFocus={e => e.target.style.borderColor = '#4F8EF7'}
            onBlur={e => e.target.style.borderColor = '#E4E4E7'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8, position: 'relative' }}>
          <label style={styles.label}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}
            type={showPass ? 'text' : 'password'} placeholder="Your password" style={styles.input}
            onFocus={e => e.target.style.borderColor = '#4F8EF7'}
            onBlur={e => e.target.style.borderColor = '#E4E4E7'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={() => setShowPass(p => !p)} style={styles.eyeBtn}>
            {showPass ? <EyeOff size={16} color="#A1A1AA" /> : <Eye size={16} color="#A1A1AA" />}
          </button>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: '#4F8EF7', fontWeight: 700, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontWeight: 600, marginBottom: 16 }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogin} disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}>
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</>
            : 'Log In →'}
        </motion.button>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4F8EF7', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </motion.div>

    </div>
  )
}

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`

const styles = {
  wrapper: { minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', fontFamily: "'Nunito',sans-serif" },
  bgGlow: { position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(79,142,247,0.1) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 },
  bgGrid: { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 },
  card: { position: 'relative', zIndex: 10, background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 28, padding: '44px 40px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.06)' },
  logo: { fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 28, cursor: 'pointer', letterSpacing: '-0.5px' },
  title: { fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: '#09090B', marginBottom: 8, letterSpacing: '-0.5px' },
  sub: { fontSize: 14, color: '#71717A', lineHeight: 1.6, marginBottom: 24 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #E4E4E7', borderRadius: 12, fontSize: 15, fontFamily: "'Nunito',sans-serif", outline: 'none', color: '#09090B', background: '#FAFAFA', transition: 'border-color 0.2s' },
  primaryBtn: { width: '100%', padding: '14px', background: '#09090B', border: 'none', color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  eyeBtn: { position: 'absolute', right: 14, bottom: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  switchText: { textAlign: 'center', fontSize: 14, color: '#71717A' },
}