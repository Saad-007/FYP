import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const TASK_LABELS = {
  visual: { label: '🎨 Visual Task', sub: 'Draw the AI Component' },
  story:  { label: '🎙️ Story Task',  sub: 'Talk to Bot Companion' },
  logic:  { label: '🧩 Logic Task',  sub: 'Pattern Puzzle' },
}

export default function KidsMissionPage() {
  const { zoneId, taskId } = useParams()
  const navigate = useNavigate()
  const task = TASK_LABELS[taskId] || { label: 'Task', sub: '' }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito',sans-serif", padding: 24 }}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 24, padding: '40px 36px', maxWidth: 500, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>{task.label.split(' ')[0]}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>{task.label.slice(3)}</h2>
        <p style={{ fontSize: 15, color: '#71717A', marginBottom: 8 }}>{task.sub}</p>
        <p style={{ fontSize: 13, color: '#A1A1AA', marginBottom: 32 }}>Zone: <strong>{zoneId}</strong></p>
        <div style={{ background: '#F4F4F5', borderRadius: 14, padding: '20px', marginBottom: 28, fontSize: 14, color: '#52525B' }}>
          🚧 This task is coming soon! Full implementation will be added next.
        </div>
        <button onClick={() => navigate('/kids/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto', background: '#09090B', border: 'none', color: '#fff', borderRadius: 12, padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back to Map
        </button>
      </motion.div>
    </div>
  )
}