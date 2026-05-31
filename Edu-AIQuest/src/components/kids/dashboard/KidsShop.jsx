import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ShoppingBag, Diamond, Check, Lock, X, Sparkles, User, Palette, Smile, Zap } from 'lucide-react'

// ── Virtual Economy Data with RARITY ──────────────────────────────────────
const SHOP_ITEMS = [
  { id: 'frame_neon', type: 'frame', name: 'Neon Cyber', price: 150, color: '#0EA5E9', rarity: 'Rare', desc: 'A glowing cyan pulse.' },
  { id: 'theme_pink', type: 'theme', name: 'Bubblegum AI', price: 200, color: '#EC4899', rarity: 'Rare', desc: 'Sweet & energetic theme.' },
  { id: 'frame_gold', type: 'frame', name: 'Gold Champion', price: 300, color: '#F59E0B', rarity: 'Epic', desc: 'For top-tier explorers.' },
  { id: 'theme_purple', type: 'theme', name: 'Void Walker', price: 400, color: '#8B5CF6', rarity: 'Epic', desc: 'Deep space aesthetic.' },
  { id: 'frame_matrix', type: 'frame', name: 'Holo Matrix', price: 500, color: '#10B981', rarity: 'Legendary', desc: 'Ultimate hacker vibes.' },
]

const RARITY_COLORS = {
  Rare: '#3B82F6',
  Epic: '#8B5CF6',
  Legendary: '#F59E0B'
}

// ── Holographic 3D Parallax Card Component ────────────────────────────────
function ShopCard({ item, isOwned, isEquipped, canAfford, onBuy, onEquip }) {
  const cardRef = useRef(null)
  
  // Mouse tracking values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for physical feel
  const springConfig = { damping: 25, stiffness: 350, mass: 0.8 }
  
  // 3D Tilt
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-12, 12]), springConfig)
  
  // Holographic Glare mapping (0% to 100%)
  const glareX = useSpring(useTransform(mouseX, [-100, 100], [0, 100]), springConfig)
  const glareY = useSpring(useTransform(mouseY, [-100, 100], [0, 100]), springConfig)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const isLegendary = item.rarity === 'Legendary'

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200, height: '100%' }} // Deep perspective for Parallax
    >
      <motion.div
        style={{ 
          rotateX, rotateY,
          transformStyle: "preserve-3d", // Essential for parallax child elements
          background: '#ffffff', 
          border: `1.5px solid ${isEquipped ? item.color : '#E4E4E7'}`, 
          borderRadius: 24, padding: '20px 16px', 
          boxShadow: isEquipped ? `0 12px 30px ${item.color}30` : '0 4px 15px rgba(0,0,0,0.03)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          position: 'relative', overflow: 'hidden', height: '100%'
        }}
        whileHover={{ scale: 1.02, boxShadow: `0 20px 40px ${item.color}20` }}
      >
        {/* Animated Legendary Aura Background */}
        {isLegendary && (
          <div style={{ position: 'absolute', inset: -20, zIndex: 0, animation: 'spin-bg 4s linear infinite', background: `conic-gradient(from 0deg, transparent, ${item.color}40, transparent 40%)` }} />
        )}

        {/* Dynamic Holographic Glare */}
        <motion.div 
          style={{ 
            position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', mixBlendMode: 'soft-light',
            background: useTransform(
              () => `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
            )
          }} 
        />

        {/* ── PARALLAX CONTENT LAYER (Floats above card) ── */}
        <motion.div style={{ transform: "translateZ(40px)", zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          
          {/* Rarity Badge */}
          <div style={{ position: 'absolute', top: -4, left: -4, background: `${RARITY_COLORS[item.rarity]}15`, border: `1px solid ${RARITY_COLORS[item.rarity]}40`, color: RARITY_COLORS[item.rarity], fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1 }}>
            {item.rarity}
          </div>

          {/* Live Preview Area */}
          <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 16, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              animate={{ rotate: item.type === 'frame' ? 360 : 0 }} 
              transition={{ duration: isLegendary ? 4 : 10, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, borderRadius: item.type === 'frame' ? '50%' : 16, border: `3px solid ${item.color}`, boxShadow: `0 0 15px ${item.color}88`, opacity: 0.9 }} 
            />
            <div style={{ width: 48, height: 48, borderRadius: item.type === 'frame' ? '50%' : 12, background: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              {item.type === 'frame' ? <Smile size={24} color="#A1A1AA" /> : <Palette size={22} color={item.color} />}
            </div>
            {isEquipped && <Zap size={16} color={item.color} fill={item.color} style={{ position: 'absolute', top: -6, right: -6, zIndex: 2, filter: `drop-shadow(0 0 4px ${item.color})` }} />}
          </div>
          
          {/* Typography */}
          <div style={{ fontSize: 16, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px', marginBottom: 4 }}>{item.name}</div>
          <div style={{ fontSize: 11, color: '#71717A', fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>{item.desc}</div>
          
          {/* Action Area */}
          <div style={{ marginTop: 'auto', width: '100%' }}>
            {!isOwned && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 900, color: canAfford ? item.color : '#A1A1AA', fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>
                <Diamond size={14} fill={canAfford ? item.color : "#A1A1AA"} /> {item.price}
              </div>
            )}

            <AnimatePresence mode="wait">
              {isEquipped ? (
                <motion.div key="equipped" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ width: '100%', padding: '10px', background: `${item.color}15`, color: item.color, borderRadius: 12, fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: `1px solid ${item.color}40` }}>
                  <Check size={16} strokeWidth={3} /> Equipped
                </motion.div>
              ) : isOwned ? (
                <motion.button key="equip" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => onEquip(item)} 
                  style={{ width: '100%', padding: '10px', background: '#09090B', color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <User size={15} /> Equip Item
                </motion.button>
              ) : (
                <motion.button key="buy" whileHover={canAfford ? { scale: 1.05 } : {}} whileTap={canAfford ? { scale: 0.95 } : {}}
                  onClick={() => onBuy(item)} disabled={!canAfford} 
                  style={{ width: '100%', padding: '10px', background: canAfford ? item.color : '#F4F4F5', color: canAfford ? '#fff' : '#A1A1AA', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 900, cursor: canAfford ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: canAfford ? `0 6px 16px ${item.color}40` : 'none', transition: 'background 0.3s' }}>
                  {!canAfford && <Lock size={14} strokeWidth={2.5} />} {canAfford ? 'Purchase' : 'Locked'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Shop Component ───────────────────────────────────────────────────
export default function KidsShop({ isOpen, onClose, gems, onBuy, ownedItems, activeFrame, activeTheme, onEquip }) {
  const [activeTab, setActiveTab] = useState('frame')

  // Animated gem counter for when buying
  const [displayGems, setDisplayGems] = useState(gems)
  useEffect(() => {
    // Smooth countdown effect
    if (gems === displayGems) return
    const step = gems > displayGems ? 1 : -1
    const timer = setInterval(() => {
      setDisplayGems(prev => {
        if (prev === gems) { clearInterval(timer); return prev }
        return prev + step
      })
    }, 10)
    return () => clearInterval(timer)
  }, [gems, displayGems])

  if (!isOpen) return null
  const items = SHOP_ITEMS.filter(item => item.type === activeTab)

  return (
    <AnimatePresence>
      {/* Essential CSS Keyframes for Legendary Aura */}
      <style>{`@keyframes spin-bg { 100% { transform: rotate(360deg); } }`}</style>
      
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        
        {/* Cinematic Glass Backdrop */}
        <motion.div 
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }} 
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.6)' }}
        />

        {/* Premium Modal Body */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30, rotateX: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 30, rotateX: -10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          style={{ perspective: 1000, position: 'relative', width: '100%', maxWidth: 680, background: '#ffffff', borderRadius: 32, padding: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.8)', overflow: 'hidden' }}
        >
          {/* Ambient Top Glow */}
          <div style={{ position: 'absolute', top: -100, left: '20%', right: '20%', height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', padding: 12, borderRadius: 16, boxShadow: '0 8px 24px rgba(139,92,246,0.3)' }}>
                <ShoppingBag size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#09090B', margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>Aether Shop</h2>
                <div style={{ fontSize: 13, color: '#71717A', fontWeight: 600 }}>Upgrade your AI aesthetics ✦</div>
              </div>
            </div>
            
            {/* Animated Currency */}
            <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F3FF', border: '2px solid #DDD6FE', borderRadius: 16, padding: '8px 16px', boxShadow: '0 4px 15px rgba(139,92,246,0.15)' }}>
              <Diamond size={18} color="#8B5CF6" fill="#8B5CF6" style={{ filter: 'drop-shadow(0 0 4px #8B5CF688)' }} />
              <span style={{ fontSize: 18, fontWeight: 900, color: '#6D28D9', fontFamily: "'DM Mono',monospace", width: 45, textAlign: 'right' }}>{displayGems}</span>
            </motion.div>
          </div>

          <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: '#F4F4F5', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#71717A', zIndex: 10, transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = '#E4E4E7'; e.currentTarget.style.transform = 'rotate(90deg)'}} onMouseOut={e => {e.currentTarget.style.background = '#F4F4F5'; e.currentTarget.style.transform = 'rotate(0deg)'}}>
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Liquid Tabs */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, background: '#F4F4F5', padding: 6, borderRadius: 16, marginBottom: 28 }}>
            {['frame', 'theme'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: 'transparent', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, color: activeTab === tab ? '#09090B' : '#71717A', cursor: 'pointer', zIndex: 2, transition: 'color 0.3s' }}>
                {activeTab === tab && (
                  <motion.div layoutId="shop-tab-bubble" transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{ position: 'absolute', inset: 0, background: '#ffffff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: -1 }} 
                  />
                )}
                {tab === 'frame' ? <User size={16} /> : <Palette size={16} />} 
                {tab === 'frame' ? 'Avatar Frames' : 'App Themes'}
              </button>
            ))}
          </div>

          {/* Grid Container */}
          <motion.div 
            key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, staggerChildren: 0.1 }}
            style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, maxHeight: '450px', overflowY: 'auto', padding: '10px 4px' }}
          >
            {items.map(item => {
              const isEquipped = activeFrame?.id === item.id || activeTheme?.id === item.id
              return (
                <ShopCard 
                  key={item.id} item={item} 
                  isOwned={ownedItems.includes(item.id)} 
                  isEquipped={isEquipped} 
                  canAfford={gems >= item.price} 
                  onBuy={onBuy} onEquip={onEquip} 
                />
              )
            })}
          </motion.div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}