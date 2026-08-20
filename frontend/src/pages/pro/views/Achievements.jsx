import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Flame, Lock, CheckCircle2, Star, Clock, Users, Brain } from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { ACHIEVEMENTS_DATA } from '../data/constants'
import { StatCard } from '../components/UI'

const ICON_MAP = { CheckCircle2, Zap, Star, Clock, Users, Brain, Lock }

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 640)
  useEffect(() => { const h = () => setM(window.innerWidth < 640); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  return m
}

function AchievementCard({ achievement, index }) {
  const { C } = useTheme()
  const Icon = ICON_MAP[achievement.iconName] || Zap
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.26 }}
      style={{ background: C.surface, border: `1px solid ${achievement.done ? C.borderL : C.border}`, borderRadius: 12, padding: '15px', opacity: achievement.done ? 1 : 0.45 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: achievement.done ? `${achievement.accent}20` : C.raised, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {achievement.done ? <Icon size={17} color={achievement.accent} /> : <Lock size={15} color={C.faint} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: achievement.done ? C.text : C.textSub, marginBottom: 3 }}>{achievement.title}</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 9, lineHeight: 1.5 }}>{achievement.desc}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.amber, display: 'flex', alignItems: 'center', gap: 3 }}><Zap size={10} />+{achievement.xp} XP</span>
            {achievement.done
              ? <span style={{ fontSize: 10, fontWeight: 600, color: C.green, background: `${C.green}18`, padding: '2px 7px', borderRadius: 5 }}>Earned</span>
              : <span style={{ fontSize: 10, color: C.faint }}>Locked</span>
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Achievements() {
  const { C } = useTheme()
  const isMobile = useIsMobile()
  const earned = ACHIEVEMENTS_DATA.filter(a => a.done)
  const locked = ACHIEVEMENTS_DATA.filter(a => !a.done)
  const totalXP = earned.reduce((s, a) => s + a.xp, 0)
  const cols = isMobile ? '1fr' : 'repeat(3, 1fr)'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', marginBottom: 3 }}>Achievements</h1>
        <p style={{ fontSize: 12, color: C.muted }}>Earn badges by hitting milestones across all tracks</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        <StatCard label="Earned"       value={`${earned.length} / ${ACHIEVEMENTS_DATA.length}`} sub="All time"          Icon={Trophy} accent={C.amber}  delay={0}    />
        <StatCard label="Achievement XP" value={totalXP.toLocaleString()}                         sub="From badges"       Icon={Zap}    accent={C.accent} delay={0.05} />
        <StatCard label="Streak"       value="8 days"                                            sub="Best: 21 days"     Icon={Flame}  accent={C.red}    delay={0.1}  />
      </div>

      <section style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Earned · {earned.length}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10 }}>
          {earned.map((a, i) => <AchievementCard key={a.title} achievement={a} index={i} />)}
        </div>
      </section>

      <section>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Locked · {locked.length} remaining
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10 }}>
          {locked.map((a, i) => <AchievementCard key={a.title} achievement={a} index={earned.length + i} />)}
        </div>
      </section>
    </div>
  )
}
