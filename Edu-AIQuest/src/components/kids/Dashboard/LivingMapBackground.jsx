/**
 * LivingMapBackground.jsx — Ultra-Premium Neural Interactive Edition
 * Path: src/components/kids/Dashboard/LivingMapBackground.jsx
 * * Includes:
 * 1. Interactive Neural Network Canvas (Nodes connect dynamically)
 * 2. 3D Holographic Easter Eggs with Particle Explosions
 * 3. High-Fidelity Data Stream Pulses
 * 4. RPG-Style XP Popups
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'

// ── Icons & Colors ────────────────────────────────────────────────────────
const EGG_POOL = [
  { icon: 'Star',      color: '#F59E0B', xp: 5  }, 
  { icon: 'Sparkles',  color: '#8B5CF6', xp: 5  }, 
  { icon: 'Zap',       color: '#EAB308', xp: 7  },
  { icon: 'Bug',       color: '#10B981', xp: 10 }, 
  { icon: 'Flame',     color: '#EF4444', xp: 8  }, 
  { icon: 'Cpu',       color: '#3B82F6', xp: 15 }, // AI Tech Vibe
  { icon: 'Wand2',     color: '#D946EF', xp: 12 },
  { icon: 'Rocket',    color: '#0EA5E9', xp: 10 }
]

function rnd(min, max) { return Math.random() * (max - min) + min }

const DynamicIcon = ({ name, size = 20, color = 'currentColor' }) => {
  const IconComponent = Icons[name] || Icons.Star
  return <IconComponent size={size} color={color} />
}

// ── 1. The Neural Network Canvas (Mathematical Data Flow) ─────────────────
function NeuralCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      // Create 60 neural nodes
      particles = Array.from({ length: 60 }, () => ({
        x: rnd(0, canvas.width),
        y: rnd(0, canvas.height),
        vx: rnd(-0.3, 0.3),
        vy: rnd(-0.3, 0.3),
        radius: rnd(1.5, 3.5),
        baseColor: '#CBD5E1', // Soft grey for connections
      }))
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    })
    window.addEventListener('mouseleave', () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    })
    
    resize()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, '#F8FAFC')
      bgGradient.addColorStop(1, '#F1F5F9')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update & Draw Particles (Nodes)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Check distance to mouse
        const dxMouse = mouseRef.current.x - p.x
        const dyMouse = mouseRef.current.y - p.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        
        const isHovered = distMouse < mouseRef.current.radius

        // Draw connections (Synapses)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            
            // If mouse is near, lines glow bright blue, else soft grey
            if (isHovered && distMouse < 100) {
              const opacity = 1 - (distMouse / 100)
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.8})` // Glowing Blue Data
              ctx.lineWidth = 1.5
            } else {
              const opacity = 1 - (dist / 120)
              ctx.strokeStyle = `rgba(203, 213, 225, ${opacity * 0.5})`
              ctx.lineWidth = 0.8
            }
            ctx.stroke()
          }
        }

        // Draw Node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? '#3B82F6' : p.baseColor
        ctx.fill()
        
        // Add glow to hovered nodes
        if (isHovered) {
          ctx.shadowBlur = 15
          ctx.shadowColor = '#3B82F6'
          ctx.fill()
          ctx.shadowBlur = 0 // Reset
        }
      })

      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />
}

// ── 2. Particle Explosion Effect (For clicked eggs) ───────────────────────
const Explosion = ({ x, y, color }) => {
  const particles = Array.from({ length: 8 })
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 20, pointerEvents: 'none' }}>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360
        const distance = rnd(40, 80)
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ 
              x: Math.cos(angle * (Math.PI / 180)) * distance, 
              y: Math.sin(angle * (Math.PI / 180)) * distance,
              scale: 0, opacity: 0 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}
          />
        )
      })}
    </div>
  )
}

// ── 3. 3D Holographic Easter Egg ──────────────────────────────────────────
function HoloEgg({ egg, onFound }) {
  const [pos, setPos] = useState({ x: rnd(15, 85), y: rnd(15, 80) })
  const [visible, setVisible] = useState(true)
  const [explosion, setExplosion] = useState(null)
  const delay = useRef(rnd(0, 3))

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    const { clientX, clientY } = e
    
    // Trigger explosion at click coordinates
    setExplosion({ x: clientX, y: clientY })
    setVisible(false)
    onFound(egg.xp, clientX, clientY)

    // Clear explosion and respawn egg later
    setTimeout(() => setExplosion(null), 1000)
    setTimeout(() => {
      setPos({ x: rnd(15, 85), y: rnd(15, 80) })
      setVisible(true)
    }, rnd(6000, 12000))
  }, [egg.xp, onFound])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: delay.current }}
            style={{ position: 'fixed', left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 5, cursor: 'pointer' }}
            onClick={handleClick}
          >
            {/* Holographic 3D Floating Orb */}
            <motion.div
              animate={{ 
                y: [0, -12, 0],
                rotateY: [0, 360] // Constant 3D spinning
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotateY: { duration: 8, repeat: Infinity, ease: 'linear' }
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.8 }}
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))`, 
                border: `1px solid rgba(255,255,255,0.8)`, 
                borderRadius: '50%', 
                padding: 12, 
                backdropFilter: 'blur(10px)',
                boxShadow: `0 10px 25px ${egg.color}40, inset 0 4px 10px ${egg.color}20`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              {/* Inner glowing icon */}
              <motion.div animate={{ filter: ['drop-shadow(0 0 2px transparent)', `drop-shadow(0 0 8px ${egg.color})`, 'drop-shadow(0 0 2px transparent)'] }} transition={{ duration: 2, repeat: Infinity }}>
                <DynamicIcon name={egg.icon} size={24} color={egg.color} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {explosion && <Explosion x={explosion.x} y={explosion.y} color={egg.color} />}
    </>
  )
}

// ── 4. Energy Pulse Animation (Data Stream) ───────────────────────────────
export function EnergyPulse({ fromEl, toEl, color, onDone }) {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    if (!fromEl || !toEl) return onDone()
    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()
    setCoords({
      x1: fromRect.left + fromRect.width / 2,
      y1: fromRect.top + fromRect.height / 2,
      x2: toRect.left + toRect.width / 2,
      y2: toRect.top + toRect.height / 2,
    })
  }, [fromEl, toEl, onDone])

  if (!coords) return null

  return (
    <motion.div
      initial={{ x: coords.x1, y: coords.y1, scale: 0 }}
      animate={{ x: coords.x2, y: coords.y2, scale: [0, 1.5, 0] }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      onAnimationComplete={onDone}
      style={{ 
        position: 'fixed', top: -4, left: -4, width: 8, height: 8, 
        borderRadius: '50%', background: '#ffffff', 
        boxShadow: `0 0 20px 8px ${color}, 0 0 40px 15px ${color}88`, 
        zIndex: 20, pointerEvents: 'none' 
      }}
    />
  )
}

// ── 5. RPG-Style XP Popup ─────────────────────────────────────────────────
export function XPPopup({ xp, x, y, color, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y, x: x - 30, scale: 0.5, rotate: -10 }}
      animate={{ opacity: [0, 1, 1, 0], y: y - 100, scale: [0.5, 1.4, 1], rotate: 0 }}
      transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }} // Springy pop
      onAnimationComplete={onDone}
      style={{ 
        position: 'fixed', zIndex: 110, pointerEvents: 'none', 
        display: 'flex', alignItems: 'center', gap: 6, 
        background: 'rgba(255,255,255,0.95)', border: `2px solid ${color}`, 
        borderRadius: 12, padding: '8px 16px', 
        boxShadow: `0 15px 35px ${color}50`, 
        fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 900, color: color 
      }}
    >
      <Icons.TrendingUp size={20} color={color} strokeWidth={3} /> +{xp} XP
    </motion.div>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────
export default function LivingMapBackground({ onEasterEggFound }) {
  const [eggs] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i, ...EGG_POOL[Math.floor(Math.random() * EGG_POOL.length)],
    }))
  )

  return (
    <>
      <NeuralCanvas />
      {eggs.map(egg => (
        <HoloEgg key={egg.id} egg={egg} onFound={onEasterEggFound} />
      ))}
    </>
  )
}