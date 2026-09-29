import { useState } from 'react'
import { motion } from 'framer-motion'

const rarityColors = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  legendary: '#F59E0B',
}

export default function AchievementsView({ data, loading, error, C }) {
  const [selectedAch, setSelectedAch] = useState(null)

  if (error) return <div style={{ padding: '24px', background: `${C.red}15`, border: `1px solid ${C.red}40`, borderRadius: '12px', color: C.red, fontSize: '14px', fontWeight: 700 }}>Error: {error}</div>
  
  if (loading || !data) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>
        Loading achievements...
      </motion.div>
    </div>
  )

  const { achievements, stats } = data

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: C.text }}>Achievements</h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Unlock badges and milestones as you progress</p>
      </div>

      {/* Stats Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(135deg, ${C.accent}15, ${C.purple}15)`,
          border: `1px solid ${C.accent}30`,
          borderRadius: '14px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {[
            { label: 'Unlocked', value: stats.unlocked },
            { label: 'Total', value: stats.total },
            { label: 'Progress', value: `${stats.completionPercent}%` },
          ].map((s, idx) => (
            <div key={idx}>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: C.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionPercent}%` }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
              boxShadow: `0 0 12px ${C.accent}60`,
            }}
          />
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: C.text, margin: 0 }}>
          Unlocked ({achievements.filter(a => a.unlocked).length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
          {achievements.filter(a => a.unlocked).map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedAch(ach)}
              style={{
                background: C.raised,
                border: `2px solid ${rarityColors[ach.rarity]}`,
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Rarity Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: rarityColors[ach.rarity],
                  color: '#fff',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900,
                }}
              >
                ★
              </div>

              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.text, marginBottom: '4px' }}>{ach.name}</div>
              <div style={{ fontSize: '10px', color: C.muted, marginBottom: '8px' }}>{ach.unlockedDate}</div>
              <div
                style={{
                  display: 'inline-block',
                  background: rarityColors[ach.rarity],
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {ach.rarity}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Locked Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: C.text, margin: 0 }}>
          Locked ({achievements.filter(a => !a.unlocked).length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
          {achievements.filter(a => !a.unlocked).map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedAch(ach)}
              style={{
                background: C.raised,
                border: `2px solid ${C.border}`,
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: 0.6,
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px', filter: 'grayscale(100%)' }}>🔒</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.text, marginBottom: '4px' }}>{ach.name}</div>
              {ach.progress && (
                <div>
                  <div style={{ fontSize: '10px', color: C.muted, marginBottom: '4px' }}>{ach.progress}%</div>
                  <div style={{ width: '100%', height: '3px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ach.progress}%`, background: C.accent }} />
                  </div>
                </div>
              )}
              <div
                style={{
                  display: 'inline-block',
                  background: C.border,
                  color: C.muted,
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginTop: '8px',
                }}
              >
                {ach.rarity}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
