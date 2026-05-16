import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getDashboardStats, updateStreak, initTrackProgress } from '../../lib/db'

import { ThemeProvider, useTheme } from './data/ThemeContext'
import Sidebar     from './components/Sidebar'
import Topbar      from './components/Topbar'
import { Spinner } from './components/UI'

import Overview     from './views/Overview'
import LearningPath from './views/LearningPath'
import AIWorkspace  from './views/AIWorkspace'
import Analytics    from './views/Analytics'
import Achievements from './views/Achievements'

import { CAREER_TRACKS } from './data/constants'

const XP_MAX = 6000

function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

function Shell({ profile, userId }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { C }    = useTheme()
  const width    = useWindowWidth()
  const isMobile = width < 768

  const [view, setView]                 = useState('overview')
  const [workspaceOpen, setWorkspace]   = useState(false)
  const [trackOpen, setTrackOpen]       = useState(false)
  const [collapsed, setCollapsed]       = useState(false)
  const [mobileMenuOpen, setMobileMenu] = useState(false)
  const [track, setTrack]               = useState(
    CAREER_TRACKS.find(t => t.id === profile?.career_track) || CAREER_TRACKS[0]
  )
  const [stats, setStats] = useState({
    xp: 0, level: 1, streak: 0,
    done: 0, total: 0, progress: 0, modules: [],
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Load real data from Supabase
  useEffect(() => {
    if (!userId) return
    const load = async () => {
      setLoadingStats(true)
      try {
        await updateStreak(userId)
        await initTrackProgress(userId, track.id)
        const data = await getDashboardStats(userId, track.id)
        setStats(data)
      } catch (err) {
        console.error('Dashboard load error:', err)
      }
      setLoadingStats(false)
    }
    load()
  }, [userId, track.id])

  // Open workspace if coming from ModuleContentPage
  useEffect(() => {
    if (location.state?.openWorkspace) {
      setWorkspace(true)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const handleNav = id => {
    if (id === 'workspace') { setWorkspace(true); return }
    setView(id)
  }

  const handleModuleClick = (mod) => {
    if (mod.status === 'locked') return
    navigate(`/pro/module/${track.id}/${mod.id}`)
  }

  const handleTrackSelect = async (newTrack) => {
    setTrack(newTrack)
    setTrackOpen(false)
    if (userId) await initTrackProgress(userId, newTrack.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // Refresh stats (called after module completion)
  const refreshStats = async () => {
    if (!userId) return
    const data = await getDashboardStats(userId, track.id)
    setStats(data)
  }

  const liveTrack = { ...track, progress: stats.progress }

  return (
    <div style={{
      display: 'flex', height: '100vh', background: C.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: 'hidden', color: C.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        button, input, textarea, select { font-family: inherit; }
      `}</style>

      {!isMobile && (
        <Sidebar
          activeView={view} onNav={handleNav}
          profile={profile} level={stats.level} onLogout={handleLogout}
          collapsed={collapsed} onToggle={() => setCollapsed(p => !p)}
        />
      )}

      {isMobile && (
        <Sidebar
          activeView={view} onNav={handleNav}
          profile={profile} level={stats.level} onLogout={handleLogout}
          collapsed={false} onToggle={() => {}}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenu(false)}
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar
          track={liveTrack}
          trackOpen={trackOpen}
          setTrackOpen={setTrackOpen}
          onTrackSelect={handleTrackSelect}
          xp={stats.xp}
          xpMax={XP_MAX}
          streak={stats.streak}
          level={stats.level}
          isMobile={isMobile}
          onMobileMenuOpen={() => setMobileMenu(true)}
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 28px' }}>
          {loadingStats ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ textAlign: 'center' }}>
                <Spinner size={28} />
                <div style={{ marginTop: 14, fontSize: 13, color: C.muted }}>Loading your progress…</div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {view === 'overview' && (
                  <Overview
                    track={liveTrack}
                    profile={profile}
                    xp={stats.xp}
                    streak={stats.streak}
                    level={stats.level}
                    modules={stats.modules}
                    onOpenWorkspace={handleModuleClick}
                    onOpenWorkspaceDirect={() => setWorkspace(true)}
                  />
                )}
                {view === 'learning' && (
                  <LearningPath
                    track={liveTrack}
                    modules={stats.modules}
                    onOpenWorkspace={handleModuleClick}
                    onOpenWorkspaceDirect={() => setWorkspace(true)}
                  />
                )}
                {view === 'analytics' && (
                  <Analytics
                    xp={stats.xp}
                    level={stats.level}
                    streak={stats.streak}
                    done={stats.done}
                    total={stats.total}
                    userId={userId}
                  />
                )}
                {view === 'achievements' && (
                  <Achievements
                    userId={userId}
                    xp={stats.xp}
                    streak={stats.streak}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <AnimatePresence>
        {workspaceOpen && (
          <AIWorkspace
            onClose={() => setWorkspace(false)}
            userId={userId}
            trackId={track.id}
            onModuleComplete={refreshStats}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userId, setUserId]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const boot = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return navigate('/login')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!data?.username)     return navigate('/profile-setup')
      if (!data?.career_track) return navigate('/pro/select-track')

      setProfile(data)
      setUserId(session.user.id)
      setLoading(false)
    }
    boot()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0F12' }}>
      <Spinner size={26} />
    </div>
  )

  return (
    <ThemeProvider>
      <Shell profile={profile} userId={userId} />
    </ThemeProvider>
  )
}
