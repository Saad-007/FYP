import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { GripVertical, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

// Helper component to render icons from strings
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle
  return <IconComponent size={size} color={color} {...props} />
}

export default function VisualTask({ zone, data, onComplete }) {
  const [remaining, setRemaining] = useState(() => [...data.items].sort(() => Math.random() - 0.5))
  const [buckets, setBuckets]   = useState(() => Object.fromEntries(data.buckets.map(b => [b.id, []])))
  const [dragging, setDragging] = useState(null)
  const [shakeId, setShakeId]   = useState(null)
  const [done, setDone]         = useState(false)

  const total  = data.items.length
  const placed = total - remaining.length

  const drop = (bucketId) => {
    if (!dragging) return
    if (dragging.category === bucketId) {
      setBuckets(p => ({ ...p, [bucketId]: [...p[bucketId], dragging] }))
      setRemaining(p => p.filter(i => i.id !== dragging.id))
    } else {
      setShakeId(dragging.id)
      setTimeout(() => setShakeId(null), 700)
    }
    setDragging(null)
  }

  useEffect(() => {
    if (remaining.length === 0 && placed > 0) setTimeout(() => setDone(true), 500)
  }, [remaining, placed])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Progress Header ── */}
      <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 20, border: '1px solid #E4E4E7', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#09090B' }}>Sort Progress</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: zone.color, fontFamily: "'DM Mono',monospace" }}>{placed} / {total}</span>
        </div>
        <div style={{ height: 8, background: '#F4F4F5', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(placed / total) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${zone.color}, ${zone.color}CC)` }} />
        </div>
      </div>

      {/* ── Draggable Cards Area ── */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#71717A', marginBottom: 14 }}>
          <GripVertical size={16} /> Drag each item to the correct bucket below
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, minHeight: 60 }}>
          {remaining.length === 0 && !done && (
            <div style={{ fontSize: 13, color: '#A1A1AA', fontWeight: 600, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#10B981" /> All items sorted!
            </div>
          )}
          {remaining.map(item => (
            <motion.div key={item.id}
              animate={shakeId === item.id ? { x: [-8,8,-6,6,0], borderColor: '#EF4444' } : { borderColor: dragging?.id === item.id ? zone.color : '#E4E4E7' }}
              transition={{ duration: 0.4 }}
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.95 }}
              style={{ 
                background: '#ffffff', 
                borderWidth: 2, 
                borderStyle: 'solid', 
                borderRadius: 16, 
                padding: '12px 18px', 
                cursor: 'grab', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                userSelect: 'none', 
                boxShadow: dragging?.id === item.id ? `0 12px 30px ${zone.glow}` : '0 4px 12px rgba(0,0,0,0.05)',
                zIndex: dragging?.id === item.id ? 100 : 1
              }}>
              
              {/* Render dynamic icon instead of emoji */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DynamicIcon name={item.icon} size={20} color="#52525B" />
              </div>
              
              <span style={{ fontSize: 14, fontWeight: 700, color: '#09090B' }}>{item.text}</span>
              <GripVertical size={16} color="#D4D4D8" style={{ marginLeft: 4 }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Drop Buckets ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.buckets.length, 3)}, 1fr)`, gap: 16 }}>
        {data.buckets.map(bucket => (
          <div key={bucket.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => drop(bucket.id)}
            style={{ 
              minHeight: 180, 
              borderRadius: 24, 
              padding: 20, 
              border: `2px dashed ${dragging ? bucket.color : bucket.color + '40'}`, 
              background: dragging ? `${bucket.color}0A` : '#ffffff',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.01)'
            }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${bucket.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <DynamicIcon name={bucket.icon} size={18} color={bucket.color} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: bucket.color }}>{bucket.label}</div>
            </div>
            
            <div style={{ fontSize: 12, color: '#71717A', fontWeight: 600, marginBottom: 16, paddingLeft: 42 }}>
              {bucket.hint}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {buckets[bucket.id].map(item => (
                <motion.div key={item.id} initial={{ scale: 0.8, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                  style={{ background: '#ffffff', border: `1.5px solid ${bucket.color}40`, borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 4px 12px ${bucket.color}10` }}>
                  <DynamicIcon name={item.icon} size={18} color={bucket.color} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#09090B', flex: 1 }}>{item.text}</span>
                  <CheckCircle2 size={16} color={bucket.color} />
                </motion.div>
              ))}
            </div>
            
            {buckets[bucket.id].length === 0 && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: bucket.color }}>Drop items here</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Success Celebration ── */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{ background: `${zone.color}08`, border: `2px solid ${zone.color}40`, borderRadius: 24, padding: '32px', textAlign: 'center', boxShadow: `0 12px 40px ${zone.glow}` }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: zone.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                <Sparkles size={36} color="#ffffff" />
              </div>
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>
              Perfect Sort!
            </div>
            <div style={{ fontSize: 15, color: '#52525B', marginBottom: 24, fontWeight: 600 }}>
              You sorted all {total} items correctly and earned <strong style={{ color: '#D97706' }}>+{XP_MAP.visual} XP</strong>!
            </div>
            
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#ffffff', border: 'none', borderRadius: 16, padding: '16px 36px', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: `0 8px 24px ${zone.glow}` }}>
              Claim XP & Continue <ChevronRight size={20} strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}