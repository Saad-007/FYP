import { motion } from 'framer-motion'

export default function AnalyticsView({ data, loading, error, C }) {
  if (error) return <div style={{ padding: '24px', background: `${C.red}15`, border: `1px solid ${C.red}40`, borderRadius: '12px', color: C.red, fontSize: '14px', fontWeight: 700 }}>Error: {error}</div>
  
  if (loading || !data) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>
        Loading analytics...
      </motion.div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: C.text }}>Analytics</h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Track your learning performance and growth</p>
      </div>

      {/* Time Spent Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
        {[
          { label: 'This Week', value: `${data.timeSpent.thisWeek}h`, color: C.accent },
          { label: 'This Month', value: `${data.timeSpent.thisMonth}h`, color: C.purple },
          { label: 'Total Time', value: `${data.timeSpent.total}h`, color: C.green },
          { label: 'Daily Avg', value: `${data.timeSpent.average}h`, color: C.blue },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            style={{
              background: C.raised,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: C.raised,
          border: `1px solid ${C.border}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px', color: C.text, margin: 0 }}>Weekly Activity</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px' }}>
          {data.weeklyXP.data.map((xp, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(xp / 250) * 100}%` }}
                transition={{ delay: idx * 0.08, duration: 0.8, ease: 'easeOut' }}
                style={{
                  flex: 1,
                  width: '100%',
                  background: `linear-gradient(180deg, ${C.accent}, ${C.accent}60)`,
                  borderRadius: '6px',
                  boxShadow: `0 4px 12px ${C.accent}40`,
                }}
              />
              <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>{data.weeklyXP.labels[idx]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skill Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: C.text, margin: 0 }}>Skill Progress</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.skillProgress.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              style={{
                background: C.raised,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{skill.skill}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.accent }}>{skill.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.percentage}%` }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: skill.color, boxShadow: `0 0 8px ${skill.color}60` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Topic Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: C.text, margin: 0 }}>Topic Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
          {data.topicBreakdown.map((topic, idx) => (
            <div
              key={idx}
              style={{
                background: C.raised,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: topic.color,
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#fff',
                }}
              >
                {topic.percentage}%
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>{topic.topic}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
