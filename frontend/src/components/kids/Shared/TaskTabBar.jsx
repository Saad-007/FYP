import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Lock, CheckCircle2 } from 'lucide-react'
import { TASK_TYPES } from '../../../data/kids/zoneData'

// Helper component for dynamic vector icons
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  // Check both icon and badgeIcon incase of mapping differences
  const IconComponent = Icons[name] || Icons.HelpCircle
  return <IconComponent size={size} color={color} {...props} />
}

export default function TaskTabBar({ activeTask, completed, onSelect }) {
  // Helper to check if a task is completed (handles both strict IDs and zone_prefixed IDs)
  const checkDone = (taskId) => completed.some(c => c === taskId || c.endsWith(`_${taskId}`))

  return (
    <>
      {/* ── 100% RESPONSIVE CSS INJECTED HERE ── */}
      <style>{`
        /* Desktop styles are driven by inline styles, here are Mobile overrides */
        @media (max-width: 768px) {
          .task-tab-grid {
            grid-template-columns: 1fr !important; /* Stack vertically on mobile */
            gap: 12px !important;
            margin-bottom: 24px !important;
          }
          .task-tab-btn {
            flex-direction: row !important; /* Convert card to a row/list item */
            padding: 14px 16px !important;
            text-align: left !important;
          }
          .task-tab-icon-container {
            margin-bottom: 0 !important;
            margin-right: 14px !important;
            width: 44px !important;
            height: 44px !important;
            flex-shrink: 0 !important;
          }
          .task-tab-icon-container svg {
            width: 20px !important;
            height: 20px !important;
          }
          .task-tab-content {
            align-items: flex-start !important;
            flex: 1 !important;
          }
          .task-tab-title {
            font-size: 15px !important;
            margin-bottom: 2px !important;
          }
          .task-tab-desc {
            font-size: 11px !important;
            margin-bottom: 0 !important;
          }
          .task-tab-pill {
            flex-shrink: 0 !important;
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
        }

        @media (max-width: 480px) {
          .task-tab-btn {
            padding: 12px !important;
          }
          .task-tab-icon-container {
            margin-right: 10px !important;
            width: 40px !important;
            height: 40px !important;
          }
          .task-tab-desc {
            display: none !important; /* Hide description on very tiny screens to save space */
          }
          .task-tab-pill span {
            display: none !important; /* Hide "XP" or "Locked" text, just show icon/number */
          }
        }
      `}</style>

      <div className="task-tab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {TASK_TYPES.map((task, i) => {
          const isDone = checkDone(task.id)
          const isActive = activeTask === task.id
          const isLocked = !isDone && i > 0 && !checkDone(TASK_TYPES[i - 1].id)

          return (
            <motion.button key={task.id}
              className="task-tab-btn"
              whileHover={!isLocked && !isActive ? { y: -4, scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.96 } : {}}
              onClick={() => !isLocked && onSelect(task.id)}
              style={{ 
                padding: '24px 16px', 
                borderRadius: 24, 
                textAlign: 'center', 
                background: isActive ? `${task.color}0A` : isDone ? '#F0FDF4' : '#ffffff', 
                border: `2px solid ${isActive ? task.color : isDone ? '#86EFAC' : '#E4E4E7'}`, 
                cursor: isLocked ? 'not-allowed' : 'pointer', 
                opacity: isLocked ? 0.6 : 1, 
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 12px 30px ${task.color}25` : '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                outline: 'none'
              }}>
              
              {/* ── Premium Icon Container ── */}
              <div className="task-tab-icon-container" style={{ 
                width: 52, 
                height: 52, 
                borderRadius: 16, 
                marginBottom: 16,
                background: isDone ? '#10B981' : isActive ? task.color : '#F4F4F5',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: isDone || isActive ? '#ffffff' : '#A1A1AA',
                boxShadow: isActive && !isDone ? `0 8px 24px ${task.color}50` : isDone ? '0 8px 24px rgba(16,185,129,0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isDone ? (
                  <CheckCircle2 size={26} strokeWidth={3} />
                ) : (
                  <DynamicIcon name={task.icon || task.badgeIcon} size={24} />
                )}
              </div>

              {/* ── Text Content ── */}
              <div className="task-tab-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="task-tab-title" style={{ fontSize: 16, fontWeight: 900, color: isActive ? task.color : isDone ? '#16A34A' : '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 6, letterSpacing: '-0.3px' }}>
                  {task.label}
                </div>
                <div className="task-tab-desc" style={{ fontSize: 12, color: '#71717A', fontWeight: 700, marginBottom: 16 }}>
                  {task.desc}
                </div>
              </div>

              {/* ── XP / Status Pill ── */}
              <div className="task-tab-pill" style={{ 
                background: isDone ? '#DCFCE7' : isActive ? task.color : '#F4F4F5', 
                color: isDone ? '#16A34A' : isActive ? '#ffffff' : '#71717A', 
                borderRadius: 99, 
                padding: '6px 14px', 
                fontSize: 12, 
                fontWeight: 800, 
                fontFamily: "'DM Mono',monospace",
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: isActive && !isDone ? `0 4px 12px ${task.color}40` : 'none'
              }}>
                {isLocked ? (
                  <><Lock size={12} strokeWidth={2.5} /> <span>Locked</span></>
                ) : isDone ? (
                  <><CheckCircle2 size={12} strokeWidth={2.5} /> <span>Completed!</span></>
                ) : (
                  `+${task.xp} XP`
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </>
  )
}