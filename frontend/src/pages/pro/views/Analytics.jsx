import { useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { Clock, Award, CheckCircle2, TrendingUp } from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { ACTIVITY_DATA, SKILL_DATA, MILESTONES } from '../data/constants'
import { StatCard, SectionHeader, ProgressBar } from '../components/UI'

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => { const h = () => setM(window.innerWidth < 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  return m
}

export default function Analytics() {
  const { C } = useTheme()
  const isMobile = useIsMobile()

  const tooltipStyle = { background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.text }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', marginBottom: 3 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: C.muted }}>Your learning performance and progress over time</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
        <StatCard label="Hours Logged"    value="82h"  sub="This month"        Icon={Clock}        accent={C.accent}  delay={0}    />
        <StatCard label="Achievements"    value="14"   sub="Badges earned"     Icon={Award}        accent={C.amber}   delay={0.05} />
        <StatCard label="Tasks Done"      value="328"  sub="Across all tracks" Icon={CheckCircle2} accent={C.green}   delay={0.1}  />
        <StatCard label="Avg Proficiency" value="67%"  sub="Across skills"     Icon={TrendingUp}   accent={C.purple}  delay={0.15} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
          <SectionHeader title="Daily XP" sub="This week" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ACTIVITY_DATA} margin={{ left: -28, bottom: 0, top: 4 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${C.accent}10` }} />
              <Bar dataKey="xp" fill={C.accent} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
          <SectionHeader title="Skill Radar" sub="Current proficiency" />
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={SKILL_DATA}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: C.muted }} />
              <Radar dataKey="A" stroke={C.purple} fill={C.purple} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
        <SectionHeader title="Progress Milestones" sub="Across all learning tracks" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
          {MILESTONES.map(m => {
            const pct = Math.round((m.value / m.max) * 100)
            return (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.textSub }}>{m.label}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{m.value} / {m.max}</span>
                </div>
                <ProgressBar value={pct} color={m.color} height={5} />
                <div style={{ marginTop: 4, fontSize: 11, color: C.faint }}>{pct}% complete</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
