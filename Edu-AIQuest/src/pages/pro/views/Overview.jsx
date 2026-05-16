import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, CheckCircle2, Flame, Play, Clock, Briefcase, Database, Cpu, Brain } from 'lucide-react'
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useTheme } from '../data/ThemeContext'
import { CAREER_TRACKS, MODULES_DATA, SKILL_DATA, ACTIVITY_DATA, PROJECTS, TYPE_CFG } from '../data/constants'
import { StatCard, SectionHeader, Badge, ProgressBar, Divider, ModuleRow, Card } from '../components/UI'

const TRACK_ICON = { Database, Cpu, Brain }

function useBreakpoint() {
  const [bp, setBp] = useState(() => window.innerWidth)
  useEffect(() => {
    const h = () => setBp(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return { isMobile: bp < 640, isTablet: bp >= 640 && bp < 1024, isDesktop: bp >= 1024 }
}

export default function Overview({ track, profile, xp, streak, level, modules: modulesProp, onOpenWorkspace, onOpenWorkspaceDirect }) {
  const { C } = useTheme()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const modules = modulesProp.length ? modulesProp : (MODULES_DATA[track.id] || MODULES_DATA.data_scientist)
  const done    = modules.filter(m => m.status === 'done').length
  const active  = modules.find(m => m.status === 'active')

  const statCols = isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
  const mainCols = isDesktop ? '1fr 300px' : '1fr'

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>
      {/* Heading */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', marginBottom: 3 }}>
          Welcome back, {profile?.username || 'Developer'}
        </h1>
        <p style={{ fontSize: 12, color: C.muted }}>
          {track.title} · {done} of {modules.length} modules complete · {track.progress}% through the track
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: statCols, gap: 10, marginBottom: 20 }}>
        <StatCard label="Total XP"      value={xp.toLocaleString()}         sub="Top 12% globally"         Icon={Zap}          accent={C.amber}  delay={0}    />
        <StatCard label="Level"         value={`Lvl ${level}`}              sub="Data Scientist"            Icon={Star}         accent={C.accent} delay={0.05} />
        <StatCard label="Modules Done"  value={`${done}/${modules.length}`} sub={`${track.progress}% done`} Icon={CheckCircle2} accent={C.green}  delay={0.1}  />
        <StatCard label="Streak"        value={`${streak}d`}               sub="Keep it going"             Icon={Flame}        accent={C.red}    delay={0.15} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: mainCols, gap: 16 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Active module hero */}
          {active && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: C.raised, border: `1px solid ${C.borderL}`, borderRadius: 14, padding: isMobile ? '16px' : '20px 22px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Continue where you left off</div>
                <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: C.text, marginBottom: 10 }}>{active.title}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {active.dur}</span>
                  <span style={{ fontSize: 12, color: C.amber, display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={12} /> +{active.xp} XP</span>
                  <Badge label={TYPE_CFG[active.type].label} color={TYPE_CFG[active.type].color} bg={TYPE_CFG[active.type].bg} />
                </div>
              </div>
              <button onClick={() => onOpenWorkspaceDirect ? onOpenWorkspaceDirect() : onOpenWorkspace({})}
                style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.text, color: C.bg, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: isMobile ? 'stretch' : 'auto', justifyContent: 'center' }}
              >
                <Play size={13} fill={C.bg} /> Start Now
              </button>
            </motion.div>
          )}

          {/* Module list */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 1 }}>Learning Path</div>
                <div style={{ fontSize: 11, color: C.muted }}>{done} done · {modules.length - done} remaining</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 70 }}><ProgressBar value={track.progress} color={track.accent} height={4} /></div>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{track.progress}%</span>
              </div>
            </div>
            <div style={{ padding: '6px', maxHeight: isMobile ? 300 : 400, overflowY: 'auto' }}>
              {modules.map((m, i) => <ModuleRow key={m.id} mod={m} index={i} onStart={onOpenWorkspace} />)}
            </div>
          </div>

          {/* Projects */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
            <div style={{ padding: '14px 16px 0' }}>
              <SectionHeader title="Recommended Projects" sub="Real-world builds to cement your skills" action="View all" />
            </div>
            <div style={{ padding: '0 10px 10px' }}>
              {PROJECTS.map((proj, i) => (
                <motion.div key={proj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 12, padding: '10px 8px', borderRadius: 10, marginBottom: 2, flexWrap: isMobile ? 'wrap' : 'nowrap', transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.raised}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${proj.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={15} color={proj.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{proj.title}</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {proj.tech.map(t => <span key={t} style={{ fontSize: 10, color: C.muted, background: C.raised, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 4 }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.amber }}>+{proj.xp.toLocaleString()} XP</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{proj.dur}</div>
                    </div>
                    <button onClick={() => onOpenWorkspaceDirect ? onOpenWorkspaceDirect() : onOpenWorkspace({})}
                      style={{ background: C.raised, border: `1px solid ${C.border}`, color: C.textSub, padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.accent }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.raised; e.currentTarget.style.color = C.textSub; e.currentTarget.style.borderColor = C.border }}
                    >Start</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — hidden on mobile/tablet (shown below) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Skill radar */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px' }}>
            <SectionHeader title="Skill Proficiency" sub="Refreshed after each module" />
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={SKILL_DATA}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: C.muted }} />
                <Radar dataKey="A" stroke={C.accent} fill={C.accent} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
              </RadarChart>
            </ResponsiveContainer>
            <Divider my={10} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SKILL_DATA.map(s => (
                <div key={s.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>{s.skill}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.textSub }}>{s.A}%</span>
                  </div>
                  <ProgressBar value={s.A} color={C.accent} height={3} />
                </div>
              ))}
            </div>
          </div>

          {/* Weekly activity */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px' }}>
            <SectionHeader title="Weekly Activity" sub="XP earned per day" />
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.accent} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={C.accent} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.text }} />
                <Area type="monotone" dataKey="xp" stroke={C.accent} strokeWidth={1.5} fill="url(#ag)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* All tracks */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px' }}>
            <SectionHeader title="All Tracks" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CAREER_TRACKS.map(t => {
                const TIcon = TRACK_ICON[t.iconName]
                const isActive = t.id === track.id
                return (
                  <div key={t.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {TIcon && <TIcon size={13} color={t.accent} />}
                        <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.text : C.muted }}>{t.title}</span>
                        {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent }} />}
                      </div>
                      <span style={{ fontSize: 11, color: C.muted }}>{t.progress}%</span>
                    </div>
                    <ProgressBar value={t.progress} color={t.accent} height={3} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
