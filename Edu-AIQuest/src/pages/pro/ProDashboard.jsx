import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

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

const XP = 4850, XP_MAX = 6000, LEVEL = 12, STREAK = 8

function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

function Shell({ profile }) {
  const navigate = useNavigate()
  const { C, isDark } = useTheme()
  const width = useWindowWidth()
  const isMobile = width < 768

  const [view, setView]               = useState('overview')
  const [workspaceOpen, setWorkspace] = useState(false)
  const [track, setTrack]             = useState(CAREER_TRACKS[0])
  const [trackOpen, setTrackOpen]     = useState(false)
  const [collapsed, setCollapsed]     = useState(false)
  const [mobileMenuOpen, setMobileMenu] = useState(false)

  const handleNav = id => {
    if (id === 'workspace') { setWorkspace(true); return }
    setView(id)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/') }

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: C.bg,
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

      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar
          activeView={view} onNav={handleNav}
          profile={profile} level={LEVEL} onLogout={handleLogout}
          collapsed={collapsed} onToggle={() => setCollapsed(p => !p)}
        />
      )}

      {/* Mobile overlay sidebar */}
      {isMobile && (
        <Sidebar
          activeView={view} onNav={handleNav}
          profile={profile} level={LEVEL} onLogout={handleLogout}
          collapsed={false} onToggle={() => {}}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenu(false)}
        />
      )}

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar
          track={track} trackOpen={trackOpen} setTrackOpen={setTrackOpen}
          onTrackSelect={t => { setTrack(t); setTrackOpen(false) }}
          xp={XP} xpMax={XP_MAX} streak={STREAK} level={LEVEL}
          isMobile={isMobile}
          onMobileMenuOpen={() => setMobileMenu(true)}
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 28px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {view === 'overview'     && <Overview track={track} profile={profile} xp={XP} streak={STREAK} level={LEVEL} onOpenWorkspace={() => setWorkspace(true)} />}
              {view === 'learning'     && <LearningPath track={track} onOpenWorkspace={() => setWorkspace(true)} />}
              {view === 'analytics'    && <Analytics />}
              {view === 'achievements' && <Achievements />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {workspaceOpen && <AIWorkspace onClose={() => setWorkspace(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default function ProDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const boot = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return navigate('/login')
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (!data?.username) return navigate('/profile-setup')
      setProfile(data)
      setLoading(false)
    }
    boot()
  }, [navigate])

  if (loading) return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0F12' }}>
        <Spinner size={26} />
      </div>
    </ThemeProvider>
  )

  return (
    <ThemeProvider>
      <Shell profile={profile} />
    </ThemeProvider>
  )
}
