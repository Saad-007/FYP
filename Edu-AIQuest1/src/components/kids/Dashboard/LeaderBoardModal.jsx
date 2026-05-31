import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Flame, Star, Medal, Crown, Rocket, Sparkles } from 'lucide-react'

export default function LeaderboardModal({ isOpen, onClose, profile, currentXp, currentStreak }) {
  const [activeFilter, setActiveFilter] = useState('xp') // 'xp' or 'streak'

  // ── Kid-Friendly Dynamic Data ──
  const playersData = useMemo(() => {
    const data = [
      { id: 'p1', name: 'Dragon_Tamer',  xp: Math.max(currentXp + 2500, 4500), streak: 12, color: '#F59E0B', icon: Crown }, // Gold
      { id: 'p2', name: 'Space_Explorer',xp: Math.max(currentXp + 1500, 3800), streak: 15, color: '#64748B', icon: Rocket }, // Silver
      { id: 'p3', name: 'Magic_Unicorn', xp: Math.max(currentXp + 800, 3100),  streak: 6,  color: '#D97706', icon: Sparkles }, // Bronze
      { id: 'p4', name: 'Wonder_Kid',    xp: Math.max(currentXp + 400, 2600),  streak: 8,  color: '#8B5CF6' },
      { id: 'p5', name: 'Captain_Spark', xp: Math.max(currentXp + 200, 2300),  streak: 4,  color: '#10B981' },
      { id: 'p6', name: 'Star_Catcher',  xp: Math.max(currentXp + 50, 2100),   streak: 9,  color: '#EC4899' },
      // Current User
      { id: 'me', name: profile?.username || 'You', xp: currentXp, streak: currentStreak, color: '#3B82F6', isMe: true },
      { id: 'p8', name: 'Pixel_Panda',   xp: Math.max(currentXp - 150, 1500),  streak: 2,  color: '#F43F5E' },
    ]

    // Sort logic based on active filter
    const sorted = data.sort((a, b) => b[activeFilter] - a[activeFilter])
    
    // Assign real ranks after sorting
    return sorted.map((player, index) => ({ ...player, rank: index + 1 }))
  }, [currentXp, currentStreak, profile?.username, activeFilter])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Nunito', sans-serif" }}>
        
        {/* Soft Dark Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(9, 9, 11, 0.4)', backdropFilter: 'blur(8px)' }}
        />

        {/* Clean, Bright Premium Modal Body */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#ffffff', borderRadius: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          {/* ── HEADER ── */}
          <div style={{ padding: '24px 24px 16px', background: '#FAFAFA', borderBottom: '1px solid #E4E4E7', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ background: 'linear-gradient(135deg, #FBBF24, #D97706)', padding: 12, borderRadius: 16, boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                  <Trophy size={24} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>Global Ranks</h2>
                  <div style={{ fontSize: 13, color: '#71717A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Hall of Fame</div>
                </div>
              </div>

              <button onClick={onClose} style={{ background: '#F4F4F5', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#71717A', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#E4E4E7' }} onMouseOut={e => { e.currentTarget.style.background = '#F4F4F5' }}>
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            {/* ── iOS Style Segmented Filter ── */}
            <div style={{ display: 'flex', background: '#F4F4F5', borderRadius: 16, padding: 4, marginTop: 24, position: 'relative', border: '1px solid #E4E4E7' }}>
              {['xp', 'streak'].map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)} style={{ flex: 1, position: 'relative', padding: '10px', background: 'transparent', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, color: activeFilter === filter ? '#09090B' : '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 2, transition: 'color 0.3s' }}>
                  {activeFilter === filter && (
                    <motion.div layoutId="filter-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      style={{ position: 'absolute', inset: 0, background: '#ffffff', borderRadius: 12, zIndex: -1, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} 
                    />
                  )}
                  {filter === 'xp' ? <Star size={16} color={activeFilter === 'xp' ? '#D97706' : '#A1A1AA'} fill={activeFilter === 'xp' ? '#FBBF24' : 'none'} /> : <Flame size={16} color={activeFilter === 'streak' ? '#EF4444' : '#A1A1AA'} fill={activeFilter === 'streak' ? '#EF4444' : 'none'} />}
                  {filter === 'xp' ? 'Top Stars' : 'Hot Streaks'}
                </button>
              ))}
            </div>
          </div>

          {/* ── LIST BODY ── */}
          <div style={{ padding: '16px 20px', maxHeight: '55vh', overflowY: 'auto', background: '#ffffff' }}>
            <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              
              <AnimatePresence mode="popLayout">
                {playersData.map((player) => {
                  // Clean dynamic styles based on rank/user
                  const isTop3 = player.rank <= 3;
                  const bgColors = {
                    1: '#FFFBEB', // Gold light
                    2: '#F8FAFC', // Silver light
                    3: '#FFF7ED', // Bronze light
                    me: '#EFF6FF',// Blue light
                    default: '#ffffff'
                  };
                  const borderColors = {
                    1: '#FDE68A',
                    2: '#E2E8F0',
                    3: '#FED7AA',
                    me: '#BFDBFE',
                    default: '#F4F4F5'
                  };

                  const currentBg = player.isMe ? bgColors.me : (bgColors[player.rank] || bgColors.default);
                  const currentBorder = player.isMe ? borderColors.me : (borderColors[player.rank] || borderColors.default);

                  return (
                    <motion.div 
                      layout
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 20,
                        background: currentBg,
                        border: `1.5px solid ${currentBorder}`,
                        boxShadow: player.isMe ? '0 4px 15px rgba(59,130,246,0.15)' : isTop3 ? `0 4px 12px ${player.color}15` : '0 2px 5px rgba(0,0,0,0.02)',
                      }}
                    >
                      {/* Rank Number & Medal */}
                      <div style={{ width: 40, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: isTop3 ? player.color : '#A1A1AA', fontFamily: "'DM Mono',monospace" }}>
                          #{player.rank}
                        </span>
                        {isTop3 && <Medal size={14} color={player.color} />}
                      </div>

                      {/* Avatar */}
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: `${player.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: player.color, marginLeft: 8, marginRight: 16 }}>
                        {player.icon ? <player.icon size={20} strokeWidth={2.5} /> : <span style={{ fontSize: 18, fontWeight: 900 }}>{player.name[0].toUpperCase()}</span>}
                      </div>

                      {/* Name */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#09090B', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {player.name} 
                          {player.isMe && <span style={{ fontSize: 10, background: '#3B82F6', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 900, letterSpacing: 0.5 }}>YOU</span>}
                        </div>
                      </div>

                      {/* Stats (Streak & XP) */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        
                        {/* XP Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: activeFilter === 'xp' ? '#FEF3C7' : '#F4F4F5', border: `1px solid ${activeFilter === 'xp' ? '#FDE68A' : 'transparent'}`, padding: '2px 8px', borderRadius: 8, transition: 'all 0.3s' }}>
                          <Star size={12} color={activeFilter === 'xp' ? '#D97706' : '#A1A1AA'} fill={activeFilter === 'xp' ? '#FBBF24' : 'none'} />
                          <span style={{ fontSize: 12, fontWeight: 900, color: activeFilter === 'xp' ? '#B45309' : '#71717A', fontFamily: "'DM Mono',monospace" }}>{player.xp}</span>
                        </div>
                        
                        {/* Streak Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: activeFilter === 'streak' ? '#FEF2F2' : 'transparent', padding: activeFilter === 'streak' ? '2px 8px' : '0 4px', borderRadius: 8, transition: 'all 0.3s' }}>
                          <Flame size={12} color={activeFilter === 'streak' ? '#EF4444' : '#A1A1AA'} fill={activeFilter === 'streak' ? '#EF4444' : 'none'} />
                          <span style={{ fontSize: 11, fontWeight: 800, color: activeFilter === 'streak' ? '#B91C1C' : '#A1A1AA' }}>{player.streak} days</span>
                        </div>

                      </div>

                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom Shadow Fade (for scrollable area) */}
          <div style={{ height: 24, background: 'linear-gradient(to top, #ffffff, transparent)', marginTop: '-24px', zIndex: 10, pointerEvents: 'none' }} />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}