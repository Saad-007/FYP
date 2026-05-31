import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfileSetup from './pages/auth/ProfileSetup'
import KidsMissionPage from './pages/kids/KidMissionPage'
import KidsDashboard from './pages/kids/KidsDashboard'
import ProDashboard from './pages/pro/ProDashboard'
import { ThemeProvider } from './pages/pro/data/ThemeContext'
import KidsProfilePage from './pages/kids/ProfilePage'
const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
    <div style={{ width: 40, height: 40, border: '4px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

function ProtectedRoute({ children, requiredMode }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/profile-setup" replace />

  if (profile.date_of_birth) {
    const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    const userMode = age >= 16 ? 'pro' : 'kids'
    if (requiredMode && userMode !== requiredMode) {
      return <Navigate to={userMode === 'pro' ? '/pro/dashboard' : '/kids/dashboard'} replace />
    }
  }

  return children
}

export default function App() {
  const { setUser, setProfile, setLoading } = useAuthStore()

useEffect(() => {
    // 1. Initial Session Check (Bina await ke)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          .then(({ data }) => {
            setProfile(data ?? null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    // 2. Listener (Yahan se async hata diya gaya hai)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fire and forget: Ye app ko block nahi karega!
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          .then(({ data }) => {
            setProfile(data ?? null)
            setLoading(false)
          })
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setLoading, setProfile, setUser])

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        <Route path="/kids/dashboard" element={
          <ProtectedRoute requiredMode="kids"><KidsDashboard /></ProtectedRoute>
        } />
        <Route path="/kids/mission/:zoneId/:taskId" element={
          <ProtectedRoute requiredMode="kids"><KidsMissionPage /></ProtectedRoute>
        } />
        <Route path="/pro/dashboard" element={
          <ProtectedRoute requiredMode="pro"><ProDashboard /></ProtectedRoute>
        } />
        <Route path="/kids/profile" element={<KidsProfilePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}