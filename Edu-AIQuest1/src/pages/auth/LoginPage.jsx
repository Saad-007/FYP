import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Syne:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`

// -- Added, responsive CSS --
const responsiveCSS = `
@media (max-width: 600px) {
  .login-responsive-card {
    padding: 24px 8px !important;
    max-width: 98vw !important;
    min-width: 0 !important;
    width: 100% !important;
    border-radius: 16px !important;
  }
  .login-responsive-logo {
    font-size: 18px !important;
    margin-bottom: 20px !important;
  }
  .login-responsive-title {
    font-size: 20px !important;
    margin-bottom: 8px !important;
  }
  .login-responsive-sub {
    font-size: 13px !important;
    margin-bottom: 14px !important;
  }
  .login-responsive-label {
    font-size: 12px !important;
    margin-bottom: 4px !important;
  }
  .login-responsive-input {
    padding: 10px 10px !important;
    font-size: 14px !important;
    border-radius: 8px !important;
  }
  .login-responsive-primary-btn {
    font-size: 15px !important;
    padding: 12px !important;
    border-radius: 10px !important;
    margin-bottom: 12px !important;
  }
  .login-responsive-error {
    padding: 7px 10px !important;
    font-size: 12px !important;
    border-radius: 8px !important;
    margin-bottom: 10px !important;
  }
  .login-responsive-switch-text {
    font-size: 13px !important;
  }
}
`

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

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setProfile, setLoading: setAuthLoading } = useAuthStore()
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
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw loginError
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!profileData || !profileData.date_of_birth) {
        window.location.replace('/profile-setup')
      } else {
        const age = new Date().getFullYear() - new Date(profileData.date_of_birth).getFullYear()
        const isKids = age < 16
        window.location.replace(isKids ? '/kids/dashboard' : '/pro/dashboard')
      }
    } catch (err) {
      console.error("Login Error:", err)
      if (err.message && err.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <style>{fonts}</style>
      <style>{responsiveCSS}</style>  {/* <-- Responsive added */}
      <div style={styles.bgGlow} />
      <div style={styles.bgGrid} />

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        style={styles.card} className="login-responsive-card">

        <div style={styles.logo} className="login-responsive-logo" onClick={() => navigate('/')}>
          <span style={{ color: '#4F8EF7' }}>Edu</span>
          <span style={{ color: '#FF6B9D' }}>AI</span>
          <span style={{ color: '#09090B' }}>Quest</span>
        </div>

        <h2 style={styles.title} className="login-responsive-title">Welcome back 👋</h2>
        <p style={styles.sub} className="login-responsive-sub">Log in to continue your learning quest.</p>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={styles.label} className="login-responsive-label">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            placeholder="ahmed@example.com" style={styles.input} className="login-responsive-input"
            onFocus={e => e.target.style.borderColor = '#4F8EF7'}
            onBlur={e => e.target.style.borderColor = '#E4E4E7'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8, position: 'relative' }}>
          <label style={styles.label} className="login-responsive-label">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}
            type={showPass ? 'text' : 'password'} placeholder="Your password"
            style={styles.input} className="login-responsive-input"
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
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: '#DC2626',
                fontWeight: 600,
                marginBottom: 16
              }} className="login-responsive-error">
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogin} disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}
          className="login-responsive-primary-btn">
          {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</>
            : 'Log In →'}
        </motion.button>

        <p style={styles.switchText} className="login-responsive-switch-text">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4F8EF7', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}