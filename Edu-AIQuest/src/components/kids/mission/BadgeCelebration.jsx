import { motion } from 'framer-motion'
import { Award, Paintbrush, Mic, Puzzle, ArrowRight, Sparkles } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

export default function BadgeCelebration({ zone, totalXp, onDone }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(10px)', padding: 24 }}>

      {/* ── Confetti Particle Explosion ── */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ 
            x: Math.cos((i/24) * Math.PI * 2) * (140 + Math.random() * 100), 
            y: Math.sin((i/24) * Math.PI * 2) * (140 + Math.random() * 100), 
            scale: [0, 1.5, 0], 
            opacity: [1, 1, 0] 
          }}
          transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
          style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: ['#3B82F6','#8B5CF6','#EC4899','#10B981','#F59E0B','#06B6D4'][i % 6], zIndex: 0 }} />
      ))}

      {/* ── Main Celebration Card ── */}
      <motion.div initial={{ scale: 0.8, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
        style={{ background: '#ffffff', borderRadius: 32, padding: '48px 40px', textAlign: 'center', maxWidth: 440, width: '100%', boxShadow: `0 30px 80px ${zone.glow}, 0 10px 30px rgba(0,0,0,0.1)`, position: 'relative', zIndex: 1, border: '1px solid #E4E4E7' }}>

        {/* ── Glowing Premium Badge ── */}
        <motion.div animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.2, delay: 0.4 }}
          style={{ width: 96, height: 96, margin: '0 auto 20px', borderRadius: '50%', background: `linear-gradient(135deg, ${zone.color}, ${zone.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '6px solid #ffffff', boxShadow: `0 12px 32px ${zone.glow}, inset 0 -4px 12px rgba(0,0,0,0.2)` }}>
          <Award size={44} color="#ffffff" strokeWidth={2.5} />
        </motion.div>

        {/* ── Typography ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Sparkles size={16} color={zone.color} />
          <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: zone.color }}>
            Zone Badge Unlocked!
          </div>
        </div>
        
        <div style={{ fontSize: 28, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.1 }}>
          {zone.label} Complete
        </div>
        <div style={{ fontSize: 14, color: '#71717A', marginBottom: 28, fontWeight: 600 }}>
          You mastered this zone and claimed all rewards!
        </div>

        {/* ── Task XP Breakdown (Emojis Replaced with Premium Icons) ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 24 }}>
          {[
            { Icon: Paintbrush, xp: XP_MAP.visual, label: 'Visual' }, 
            { Icon: Mic,        xp: XP_MAP.story,  label: 'Story' }, 
            { Icon: Puzzle,     xp: XP_MAP.logic,  label: 'Logic' }
          ].map(t => (
            <div key={t.label} style={{ flex: 1, background: '#FAFAFA', border: `1.5px solid #F4F4F5`, borderRadius: 20, padding: '14px 10px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <div style={{ background: `${zone.color}15`, padding: 8, borderRadius: 12 }}>
                  <t.Icon size={20} color={zone.color} strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>
                +{t.xp}
              </div>
              <div style={{ fontSize: 10, color: '#A1A1AA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Total XP Banner ── */}
        <div style={{ background: `${zone.color}0A`, border: `2px dashed ${zone.color}40`, borderRadius: 20, padding: '16px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ background: '#ffffff', borderRadius: 50, padding: 6, boxShadow: `0 4px 12px ${zone.glow}` }}>
            <Award size={20} color={zone.color} />
          </div>
          <div>
            <span style={{ fontSize: 26, fontWeight: 900, color: zone.color, fontFamily: "'DM Mono',monospace" }}>+{totalXp} XP</span>
            <span style={{ fontSize: 13, color: '#71717A', fontWeight: 700, marginLeft: 8 }}>Total Earned</span>
          </div>
        </div>

        {/* ── CTA Button ── */}
        <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={onDone}
          style={{ width: '100%', padding: '18px', background: zone.color, color: '#ffffff', border: 'none', borderRadius: 18, fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 10px 30px ${zone.glow}` }}>
          Back to World Map <ArrowRight size={18} strokeWidth={3} />
        </motion.button>

      </motion.div>
    </motion.div>
  )
}