import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, Flame, Diamond, Brain, Activity,
  Sparkles, Rocket, Trophy, Award, Target, Zap,
  Clock3, BarChart3, TrendingUp, ShieldCheck, Mail,
  CalendarDays, LogOut, X, AlertTriangle,
} from 'lucide-react'
import { XP_PER_LEVEL } from '../../data/kids/zoneData'
import { useAuthStore } from '../../store/authStore'

// ── responsive hook ──────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  }
}

export default function KidsProfilePage() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  const { user, logout } = useAuthStore()

  const {
    profile        = null,
    xp             = 3450,
    level          = 5,
    streak         = 4,
    gems           = 1250,
    completedTasks = ['zone1_visual', 'zone1_story', 'zone2_logic', 'zone3_visual'],
    activeFrame    = null,
  } = location.state || {}

  const onBack      = () => navigate('/kids/dashboard')
  const handleLogout = () => { logout(); navigate('/login') }

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'May 2026'

  const xpInLevel  = xp % XP_PER_LEVEL
  const xpPercent  = Math.round((xpInLevel / XP_PER_LEVEL) * 100)
  const xpToNext   = XP_PER_LEVEL - xpInLevel

  const skills = [
    { name: 'Logical Thinking',   value: 75, color: '#10B981', icon: Brain,       desc: 'Puzzles & Flowcharts' },
    { name: 'Visual Recognition', value: 88, color: '#EC4899', icon: EyeIcon,     desc: 'Sorting & Patterns'  },
    { name: 'AI Awareness',       value: 60, color: '#3B82F6', icon: ShieldCheck, desc: 'Voice, Chat & Ethics' },
  ]

  const weeklyData = [
    { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 350 }, { day: 'Wed', xp: 200 },
    { day: 'Thu', xp: 450 }, { day: 'Fri', xp: 100 }, { day: 'Sat', xp: 0   }, { day: 'Sun', xp: 500 },
  ]
  const maxWeeklyXP   = Math.max(...weeklyData.map(d => d.xp))
  const totalWeeklyXP = weeklyData.reduce((s, d) => s + d.xp, 0)

  const recentActivity = [
    { id: 1, type: 'mission', title: 'AI Explorer Visual Task',   zone: 'Zone 1', time: '2 hours ago', xp: 50,  icon: Zap   },
    { id: 2, type: 'level',   title: 'Reached Level 5',           zone: 'System', time: '1 day ago',   xp: 100, icon: Award },
    { id: 3, type: 'mission', title: 'Data Detectives Logic Task', zone: 'Zone 2', time: '2 days ago',  xp: 100, icon: Zap   },
  ]

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  }
  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  }

  const displayName   = profile?.full_name || profile?.username || 'AI Explorer'
  const avatarInitial = displayName[0].toUpperCase()

  // ── layout values based on breakpoint ──
  const gridCols   = isDesktop ? '400px 1fr' : '1fr'
  const subGrid    = isDesktop || isTablet ? '1fr 1fr' : '1fr'
  const navPadding = isMobile ? '0 16px' : '0 24px'
  const mainPadding = isMobile ? '0 16px' : '0 24px'
  const mainMargin  = isMobile ? '20px auto 0' : '28px auto 0'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F1F5F9',
      fontFamily: "'Nunito', sans-serif",
      color: '#09090B',
      paddingBottom: '60px',
    }}>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <div style={{
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 100,
        padding: navPadding,
      }}>
        <div style={{
          maxWidth: '1140px', margin: '0 auto',
          height: isMobile ? '56px' : '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '8px',
        }}>
          {/* Back */}
          <button
            onClick={onBack}
            style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8,
              color: '#475569', fontSize: 14, fontWeight: 800,
              padding: isMobile ? '8px 10px' : '8px 16px',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#3B82F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#475569' }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            {!isMobile && ' Back to Map'}
          </button>

          {/* Title */}
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? 15 : 20,
            fontWeight: 900,
            fontFamily: "'Syne', sans-serif",
            color: '#0F172A',
            textAlign: 'center',
            flex: 1,
          }}>
            {isMobile ? 'Analytics' : 'Performance Analytics'}
          </h1>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8,
              color: '#DC2626', fontSize: 14, fontWeight: 800,
              padding: isMobile ? '8px 10px' : '8px 16px',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2' }}
          >
            <LogOut size={16} strokeWidth={2.5} />
            {!isMobile && ' Logout'}
          </button>
        </div>
      </div>

      {/* ══════════════════ MAIN GRID ══════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1140px',
          margin: mainMargin,
          padding: mainPadding,
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '20px',
          alignItems: isDesktop ? 'stretch' : 'start',
        }}
      >

        {/* ══════════════════════════════
            LEFT COLUMN
        ══════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: isDesktop ? '100%' : 'auto' }}>

          {/* IDENTITY CARD */}
          <motion.div variants={itemVariants} style={{
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ padding: isMobile ? '24px 20px 22px' : '32px 24px 28px', textAlign: 'center' }}>

              {/* Avatar */}
              <div style={{ marginBottom: '14px', display: 'inline-block' }}>
                <div style={{
                  width: isMobile ? '72px' : '88px',
                  height: isMobile ? '72px' : '88px',
                  borderRadius: '50%',
                  background: '#09090B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: isMobile ? '28px' : '34px', color: '#fff',
                  border: activeFrame ? `4px solid ${activeFrame.color}` : '4px solid #F1F5F9',
                  boxShadow: activeFrame ? activeFrame.shadow : '0 4px 20px rgba(0,0,0,0.12)',
                }}>
                  {avatarInitial}
                </div>
              </div>

              <h2 style={{
                margin: '0 0 4px',
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 900, fontFamily: "'Syne', sans-serif",
                color: '#0F172A', letterSpacing: '-0.4px',
              }}>
                {displayName}
              </h2>

              <span style={{
                fontSize: '12px', fontWeight: 900, color: '#6366F1',
                background: '#EEF2FF', padding: '3px 10px', borderRadius: '6px',
                fontFamily: "'DM Mono', monospace", display: 'inline-block', marginBottom: '14px',
              }}>
                @{profile?.username || 'explorer'}
              </span>

              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: 700 }}>
                  <Mail size={13} /> {user?.email || 'student@eduai.com'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: 700 }}>
                  <CalendarDays size={13} /> Joined {joinDate}
                </span>
              </div>

              {/* Level pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(90deg, #10B981, #059669)',
                color: '#fff', padding: '8px 22px', borderRadius: '99px',
                fontSize: '14px', fontWeight: 900,
                boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                marginBottom: '18px',
              }}>
                <Target size={16} /> Level {level} Explorer
              </div>

              {/* XP progress bar */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B' }}>Progress to Level {level + 1}</span>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#10B981', fontFamily: "'DM Mono', monospace" }}>{xpPercent}%</span>
                </div>
                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: '99px' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, marginTop: '5px', textAlign: 'right' }}>
                  {xpToNext.toLocaleString()} XP remaining
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS ROW */}
          <motion.div variants={itemVariants} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: isMobile ? '8px' : '12px',
          }}>
            {[
              { label: 'Total XP', value: xp.toLocaleString(), Icon: Star,    bg: '#FFFBEB', color: '#D97706', border: '#FEF3C7' },
              { label: 'Streak',   value: `${streak}d`,         Icon: Flame,   bg: '#FEF2F2', color: '#DC2626', border: '#FEE2E2' },
              { label: 'Gems',     value: gems.toLocaleString(), Icon: Diamond, bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  borderRadius: '18px',
                  padding: isMobile ? '14px 6px' : '18px 8px',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${stat.border}` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none' }}
              >
                <stat.Icon size={isMobile ? 20 : 24} color={stat.color} fill={stat.color} strokeWidth={1.5} />
                <span style={{ fontSize: isMobile ? '16px' : '19px', fontWeight: 900, color: stat.color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 800, color: stat.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* BADGES */}
          <motion.div variants={itemVariants} style={{
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: isMobile ? '20px' : '24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
            flexGrow: isDesktop ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Your Badges</h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>6 / 12 earned</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? '8px' : '10px',
            }}>
              {[
                { icon: Sparkles,    color: '#FBBF24', bg: '#FFFBEB', title: 'Novice',   earned: true  },
                { icon: Rocket,      color: '#3B82F6', bg: '#EFF6FF', title: 'Explorer', earned: true  },
                { icon: ShieldCheck, color: '#10B981', bg: '#ECFDF5', title: 'Guardian', earned: true  },
                { icon: Award,       color: '#EC4899', bg: '#FDF2F8', title: 'Master',   earned: true  },
                { icon: Brain,       color: '#8B5CF6', bg: '#F5F3FF', title: 'Genius',   earned: true  },
                { icon: Trophy,      color: '#F43F5E', bg: '#FFF1F2', title: 'Legend',   earned: false },
              ].map((badge, i) => (
                <div
                  key={i}
                  style={{
                    background: badge.earned ? badge.bg : '#F8FAFC',
                    border: `1px solid ${badge.earned ? badge.color + '30' : '#E2E8F0'}`,
                    borderRadius: '14px',
                    padding: isMobile ? '12px 0' : '16px 0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                    opacity: badge.earned ? 1 : 0.4,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => badge.earned && (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <badge.icon size={isMobile ? 20 : 24} color={badge.earned ? badge.color : '#94A3B8'} strokeWidth={2} />
                  <span style={{ fontSize: '9px', fontWeight: 800, color: badge.earned ? badge.color : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Sign out button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{
                marginTop: '16px',
                width: '100%',
                background: 'transparent',
                border: '1.5px dashed #FECACA',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: '#EF4444', fontSize: 14, fontWeight: 800,
                padding: '12px',
                transition: 'all 0.2s',
                fontFamily: "'Nunito', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderStyle = 'solid' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderStyle = 'dashed' }}
            >
              <LogOut size={16} strokeWidth={2.5} /> Sign Out of Account
            </button>
          </motion.div>

        </div>
        {/* ════ END LEFT COLUMN ════ */}


        {/* ══════════════════════════════
            RIGHT COLUMN
        ══════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* WEEKLY BAR CHART */}
          <motion.div variants={itemVariants} style={{
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: isMobile ? '20px' : '28px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'flex-start',
              gap: isMobile ? '12px' : '0',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: '#EEF2FF', padding: '10px', borderRadius: '14px' }}>
                  <BarChart3 size={20} color="#4F46E5" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: 900, color: '#0F172A' }}>
                    Weekly Performance
                  </h3>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>
                    XP earned in the last 7 days
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  padding: '5px 12px', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 800, color: '#16A34A',
                }}>
                  <TrendingUp size={13} /> +15% this week
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>
                  Total: <span style={{ color: '#0F172A', fontWeight: 900 }}>{totalWeeklyXP.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: isMobile ? '4px' : '6px',
              height: isMobile ? '140px' : '180px',
              position: 'relative', paddingBottom: '32px',
            }}>
              {[0, 25, 50, 75, 100].map(pct => (
                <div key={pct} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: `${(100 - pct) * (isMobile ? 1.08 : 1.48)}px`,
                  borderTop: `1px ${pct === 0 ? 'solid' : 'dashed'} #E2E8F0`,
                  zIndex: 0,
                }} />
              ))}

              {weeklyData.map((d, i) => {
                const heightPct = maxWeeklyXP > 0 ? (d.xp / maxWeeklyXP) * 100 : 0
                const isToday   = i === 6
                const isEmpty   = d.xp === 0
                const barH      = isMobile ? '90px' : '130px'

                return (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 1 }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 900, marginBottom: '4px',
                      color: isToday ? '#4F46E5' : '#94A3B8',
                      visibility: isEmpty ? 'hidden' : 'visible',
                    }}>
                      {isMobile ? '' : d.xp}
                    </span>
                    <div style={{
                      width: '100%', maxWidth: isMobile ? '28px' : '36px',
                      height: barH,
                      background: '#F1F5F9', borderRadius: '8px', overflow: 'hidden',
                      display: 'flex', alignItems: 'flex-end',
                    }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isEmpty ? 0 : `${heightPct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07, type: 'spring', stiffness: 180, damping: 22 }}
                        style={{
                          width: '100%', minHeight: isEmpty ? 0 : '4px',
                          background: isToday
                            ? 'linear-gradient(0deg, #4338CA, #818CF8)'
                            : 'linear-gradient(0deg, #93C5FD, #BFDBFE)',
                          borderRadius: '8px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 800, marginTop: '8px', color: isToday ? '#0F172A' : '#94A3B8' }}>
                      {isMobile ? d.day.charAt(0) : d.day}
                    </span>
                    {isToday && (
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4F46E5', marginTop: '2px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* SKILL DISTRIBUTION + LEVEL PROGRESS */}
          <div style={{ display: 'grid', gridTemplateColumns: subGrid, gap: '16px' }}>

            {/* Skill Distribution */}
            <motion.div variants={itemVariants} style={{
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '20px' }}>
                <div style={{ background: '#F0FDF4', padding: '8px', borderRadius: '10px' }}>
                  <Activity size={16} color="#10B981" />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Skill Distribution</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {skills.map(skill => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>{skill.name}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, marginTop: '1px' }}>{skill.desc}</div>
                      </div>
                      <span style={{
                        fontSize: '12px', fontWeight: 900, color: skill.color,
                        fontFamily: "'DM Mono', monospace",
                        background: skill.color + '15',
                        padding: '2px 8px', borderRadius: '6px',
                      }}>
                        {skill.value}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', height: '7px' }}>
                      {[1, 2, 3, 4, 5].map(seg => {
                        const threshold   = seg * 20
                        const isFilled    = skill.value >= threshold
                        const isPartial   = skill.value > (seg - 1) * 20 && skill.value < threshold
                        const fillPercent = isPartial ? ((skill.value - (seg - 1) * 20) / 20) * 100 : 0
                        return (
                          <div key={seg} style={{ flex: 1, background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: isFilled ? '100%' : `${fillPercent}%` }}
                              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
                              style={{ height: '100%', background: skill.color, opacity: 0.9 }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Level Progress Donut */}
            <motion.div variants={itemVariants} style={{
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 900, color: '#0F172A', alignSelf: 'flex-start' }}>
                Level Progress
              </h3>
              <div style={{ position: 'relative', width: isMobile ? '110px' : '130px', height: isMobile ? '110px' : '130px' }}>
                <svg
                  width={isMobile ? 110 : 130}
                  height={isMobile ? 110 : 130}
                  viewBox="0 0 130 130"
                >
                  <circle cx="65" cy="65" r="54" fill="none" stroke="#F1F5F9" strokeWidth="13" />
                  <motion.circle
                    cx="65" cy="65" r="54" fill="none"
                    stroke="#10B981" strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray="339.3"
                    initial={{ strokeDashoffset: 339.3 }}
                    animate={{ strokeDashoffset: 339.3 - (339.3 * xpPercent) / 100 }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                    transform="rotate(-90 65 65)"
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 900, color: '#0F172A', fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                    {xpPercent}%
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>complete</span>
                </div>
              </div>
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 900, color: '#0F172A', fontFamily: "'DM Mono', monospace" }}>
                  {xpToNext.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>XP to Level {level + 1}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: i <= Math.ceil(xpPercent / 20) ? '#10B981' : '#E2E8F0',
                  }} />
                ))}
              </div>
            </motion.div>

          </div>

          {/* RECENT ACTIVITY */}
          <motion.div variants={itemVariants} style={{
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: isMobile ? '20px' : '24px 28px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#F8FAFC', padding: '9px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Clock3 size={18} color="#64748B" />
                </div>
                <h3 style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: 900, color: '#0F172A' }}>
                  Recent Activity
                </h3>
              </div>
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 800, color: '#6366F1',
                fontFamily: "'Nunito', sans-serif", padding: '4px 0',
              }}>
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {recentActivity.map((act, i) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '14px',
                    padding: isMobile ? '12px 8px' : '14px 12px',
                    borderRadius: '14px',
                    background: i === 0 ? '#FAFBFF' : 'transparent',
                    border: i === 0 ? '1px solid #EEF2FF' : '1px solid transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0' }}
                  onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? '#FAFBFF' : 'transparent'; e.currentTarget.style.borderColor = i === 0 ? '#EEF2FF' : 'transparent' }}
                >
                  <div style={{
                    background: act.type === 'level' ? '#FEF3C7' : '#EFF6FF',
                    color:      act.type === 'level' ? '#D97706'  : '#2563EB',
                    width: isMobile ? '38px' : '44px',
                    height: isMobile ? '38px' : '44px',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <act.icon size={isMobile ? 17 : 20} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>
                      {act.zone} · {act.time}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px', fontWeight: 900, color: '#10B981',
                    fontFamily: "'DM Mono', monospace",
                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                    padding: '4px 10px', borderRadius: '8px', flexShrink: 0,
                  }}>
                    +{act.xp}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
        {/* ════ END RIGHT COLUMN ════ */}

      </motion.div>


      {/* ══════════════════ LOGOUT MODAL ══════════════════ */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
            }}
            onClick={e => e.target === e.currentTarget && setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                background: '#ffffff',
                borderRadius: '28px',
                padding: isMobile ? '28px 24px' : '36px 32px',
                maxWidth: '380px', width: '100%',
                boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: '#F1F5F9', border: 'none', borderRadius: '8px',
                  width: '32px', height: '32px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: '#FEF2F2', border: '2px solid #FECACA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <AlertTriangle size={28} color="#EF4444" strokeWidth={2.5} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 900, color: '#0F172A', fontFamily: "'Syne', sans-serif" }}>
                Sign Out?
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748B', fontWeight: 700, lineHeight: 1.6 }}>
                You'll need to log back in to access your progress and continue your learning journey.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '14px',
                    background: '#F1F5F9', border: '1px solid #E2E8F0',
                    fontSize: '14px', fontWeight: 800, color: '#475569',
                    cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
                >
                  Stay Here
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    border: 'none', fontSize: '14px', fontWeight: 800, color: '#ffffff',
                    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                    boxShadow: '0 4px 14px rgba(239,68,68,0.35)', transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

function EyeIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size} height={props.size}
      viewBox="0 0 24 24" fill="none"
      stroke={props.color} strokeWidth={props.strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}