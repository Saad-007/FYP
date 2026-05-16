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
    if (requiredMode && userMode !== requiredMode) {
      return <Navigate to={userMode === 'pro' ? '/pro/dashboard' : '/kids/dashboard'} replace />
    }
  }

  return children
}

// ─── PRO ROUTE — also checks if track is selected ────────────────────────────
// If user is pro but hasn't chosen a career_track → send to selector first
function ProRoute({ children }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0F12]">
      <div className="w-8 h-8 border-2 border-[#4F8EF7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user)    return <Navigate to="/login"         replace />
  if (!profile) return <Navigate to="/profile-setup" replace />

  // Age check
  if (profile?.date_of_birth) {
    const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    if (age < 16) return <Navigate to="/kids/dashboard" replace />
  }

  // Track check — if no career_track selected, go to selector
  if (!profile?.career_track) return <Navigate to="/pro/select-track" replace />

  return children
}

// ─── APP ─────────────────────────────────────────────────────────────────────
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
        <ProRoute><ProDashboard /></ProRoute>
      } />

      {/* Step 3: Individual module content pages */}
      <Route path="/pro/module/:trackId/:moduleId" element={
        <ProRoute><ModuleContentPage /></ProRoute>
      } />

      {/* Fallback 404/Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
