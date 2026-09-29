import { motion } from 'framer-motion'
import { ChevronRight, BookOpen, Clock, Users } from 'lucide-react'

const BACKEND_URL = 'http://16.170.117.27:5000'

export default function LearningPathView({ data, loading, error, C }) {
  if (error) return <div style={{ padding: '24px', background: `${C.red}15`, border: `1px solid ${C.red}40`, borderRadius: '12px', color: C.red, fontSize: '14px', fontWeight: 700 }}>Error: {error}</div>
  if (loading || !data) return <div style={{ textAlign: 'center', padding: '60px 20px', fontSize: '14px', color: C.muted }}>Loading courses...</div>

  const handleStartCourse = async (courseId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/pro/learning-path/start/${courseId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const result = await response.json()
      if (result.success) alert('Course started!')
    } catch (err) { console.error(err) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: C.text }}>Learning Path</h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Structured courses designed for your growth</p>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {data.recommendedCourses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -8 }}
            style={{
              background: C.raised,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: C.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{course.category}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.3 }}>{course.title}</h3>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: C.muted }}>{course.level}</div>
              </div>
              <p style={{ fontSize: '12px', color: C.textSub, margin: 0 }}>{course.description}</p>
            </div>

            {/* Progress */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>Progress</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.accent }}>{course.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: C.accent }} />
              </div>
            </div>

            {/* Meta */}
            <div style={{ padding: '16px 20px', display: 'flex', gap: '16px', fontSize: '12px', color: C.muted, borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> {course.lessons} lessons
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {course.duration}h
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> {course.reviews} reviews
              </div>
            </div>

            {/* Button */}
            <div style={{ padding: '16px 20px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartCourse(course.id)}
                style={{
                  width: '100%',
                  background: C.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                }}
              >
                {course.status === 'completed' ? 'Review' : course.status === 'in_progress' ? 'Continue' : 'Start'}
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Paths */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, marginBottom: '16px', margin: 0 }}>Skill Paths</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.skillPath.map((skill, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: 0 }}>{skill.skillName}</h3>
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.accent }}>{skill.progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: C.border, borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ height: '100%', width: `${skill.progressPercent}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.purple})` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {skill.courses.map((c, cidx) => (
                  <div key={cidx} style={{ fontSize: '11px', color: c.completed ? C.green : C.textSub, fontWeight: 500 }}>
                    {c.completed ? '✓' : '○'} {c.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
