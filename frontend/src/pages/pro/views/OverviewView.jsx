import { motion } from 'framer-motion'
import { TrendingUp, Zap, Target, Award } from 'lucide-react'

export default function OverviewView({ data, loading, error, C }) {
  if (error) {
    return (
      <div style={{ padding: '24px', background: `${C.red}15`, border: `1px solid ${C.red}40`, borderRadius: '12px', color: C.red }}>
        <div style={{ fontSize: '14px', fontWeight: 700 }}>Error Loading Data</div>
        <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>{error}</div>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}
        >
          Loading dashboard...
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: C.text, letterSpacing: '-0.5px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: 0, fontWeight: 500 }}>
          {data.motivationalQuote}
        </p>
      </motion.div>

      {/* Level Card */}
      <motion.div
        variants={itemVariants}
        style={{
          background: `linear-gradient(135deg, ${C.accent}15, ${C.purple}15)`,
          border: `1px solid ${C.accent}30`,
          borderRadius: '14px',
          padding: '28px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Current Level
            </div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: C.accent, lineHeight: 1 }}>
              {data.level}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Skill Rating
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: C.green }}>
              {data.skillRating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>Experience Points</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>
              {data.totalXP.toLocaleString()} / {data.nextLevelXP.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              background: C.border,
              borderRadius: '99px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progressPercent}%` }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
                boxShadow: `0 0 12px ${C.accent}60`,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        {[
          { label: 'Current Streak', value: data.currentStreak, icon: Zap, color: C.orange },
          { label: 'Courses Completed', value: data.coursesCompleted, icon: Award, color: C.green },
          { label: 'Total Badges', value: data.badges, icon: Target, color: C.purple },
          { label: 'In Progress', value: data.coursesInProgress, icon: TrendingUp, color: C.blue },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              style={{
                background: C.raised,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={stat.color} strokeWidth={2.2} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: C.text, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Milestones */}
      <motion.div variants={itemVariants}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: 0 }}>Progress Milestones</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.milestones.map((m, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              style={{
                background: C.raised,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{m.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.accent }}>
                  {m.value} / {m.max}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: C.border,
                  borderRadius: '99px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.value / m.max) * 100}%` }}
                  transition={{ delay: idx * 0.1, duration: 1.2, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: m.color,
                    boxShadow: `0 0 8px ${m.color}60`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: 0 }}>Recent Activity</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.recentActivity.map((activity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ x: 4 }}
              style={{
                background: C.raised,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', color: C.text, fontWeight: 500 }}>{activity.title}</span>
              <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
