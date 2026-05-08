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

function ProtectedRoute({ children, requiredMode }) {
  const { user, profile, loading } = useAuthStore()

  // 1. Loading State
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // 2. Not Logged In
  if (!user) return <Navigate to="/login" replace />

  // 3. Logged In, but NO Profile (Force them to Profile Setup)
  if (!profile) return <Navigate to="/profile-setup" replace />

  // 4. Logged In + Profile Exists (Check Age/Mode)
  if (profile && profile.date_of_birth) {
    const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    const userMode = age >= 16 ? 'pro' : 'kids'
    
    // Agar galat mode mein aane ki koshish kare, to wapis sahi jagah bhej do
    if (requiredMode && userMode !== requiredMode) {
      return <Navigate to={userMode === 'pro' ? '/pro/dashboard' : '/kids/dashboard'} replace />
    }
  }

  return children
}

export default function App() {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    // ── INITIAL LOAD ──
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Safe fetch: Handle case where profile might not exist yet
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        setProfile(data)
      }
      setLoading(false)
    })

    // ── AUTH LISTENER (Fix for the Infinite Load Bug) ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        setProfile(data)
      } else {
        setProfile(null)
      }
      
      // CRITICAL FIX: Ye line missing thi aapke code mein!
      setLoading(false) 
    })

    return () => subscription.unsubscribe()
  }, [setLoading, setProfile, setUser])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* Kids Mode Routes */}
      <Route path="/kids/dashboard" element={
        <ProtectedRoute requiredMode="kids"><KidsDashboard /></ProtectedRoute>
      } />
      <Route path="/kids/mission/:zoneId/:taskId" element={
        <ProtectedRoute requiredMode="kids"><KidsMissionPage /></ProtectedRoute>
      } />

      {/* Pro Mode Routes */}
      <Route path="/pro/dashboard" element={
        <ProtectedRoute requiredMode="pro"><ProDashboard /></ProtectedRoute>
      } />

      {/* Fallback 404/Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}