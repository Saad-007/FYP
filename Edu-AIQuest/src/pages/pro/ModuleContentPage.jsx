import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, BookOpen, Code2, FlaskConical,
  Clock, Zap, CheckCircle2, Play, ChevronRight,
  Brain, Terminal, Target, Award, Lock, Sparkles,
} from 'lucide-react'
import { useTheme } from './data/ThemeContext'
import { ThemeProvider } from './data/ThemeContext'
import { MODULES_DATA, CAREER_TRACKS } from './data/constants'

// ─── MODULE CONTENT (static for FYP-1 demo) ──────────────────────────────────
const MODULE_CONTENT = {
  9: {
    // Unsupervised Learning — the active module
    videoThumb: null,
    readTime: '12 min read',
    concepts: [
      {
        title: 'What is Unsupervised Learning?',
        body: `Unlike supervised learning where we have labelled training data, unsupervised learning finds hidden patterns in unlabelled data. The algorithm discovers structure on its own — no teacher required.

Common use cases include customer segmentation, anomaly detection, dimensionality reduction, and topic modelling.`,
      },
      {
        title: 'K-Means Clustering',
        body: `K-Means partitions data into K clusters by minimising the within-cluster sum of squares (inertia). The algorithm iterates between two steps:

1. Assignment — assign each point to the nearest centroid
2. Update — recalculate centroids as the mean of assigned points

It converges when centroids stop moving.`,
      },
      {
        title: 'Choosing K — The Elbow Method',
        body: `There is no single correct value of K. The Elbow Method plots inertia against K values and looks for the "elbow" — the point where adding more clusters gives diminishing returns.

The Silhouette Score is another metric: values close to +1 mean well-separated clusters.`,
      },
    ],
    codePreview: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Always scale before clustering
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Fit model
kmeans = KMeans(n_clusters=4, random_state=42)
labels = kmeans.fit_predict(X_scaled)`,
    keyPoints: [
      'Scale your features before clustering',
      'Use the Elbow Method to find optimal K',
      'Silhouette Score measures cluster quality',
      'K-Means assumes spherical, equal-sized clusters',
    ],
    quiz: [
      {
        q: 'What does K-Means minimise?',
        options: ['Within-cluster sum of squares', 'Between-cluster variance', 'Silhouette Score', 'Log-likelihood'],
        correct: 0,
      },
      {
        q: 'Why do we scale features before K-Means?',
        options: [
          'To make the code run faster',
          'So no feature dominates due to its scale',
          'K-Means requires values between 0 and 1',
          'StandardScaler is required by sklearn',
        ],
        correct: 1,
      },
      {
        q: 'What does a Silhouette Score of +0.8 indicate?',
        options: ['Poor clusters', 'Overlapping clusters', 'Well-separated, dense clusters', 'Too many clusters'],
        correct: 2,
      },
    ],
  },
}

const TYPE_META = {
  theory:   { label: 'Theory',     icon: BookOpen,    color: '#4F8EF7', bg: 'rgba(79,142,247,0.1)'   },
  coding:   { label: 'Coding',     icon: Code2,       color: '#A78BFA', bg: 'rgba(167,139,250,0.1)'  },
  scenario: { label: 'Case Study', icon: FlaskConical, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
}

// ─── QUIZ COMPONENT ──────────────────────────────────────────────────────────
function QuizSection({ quiz, C }) {
  const [answers, setAnswers]   = useState({})
  const [submitted, setSubmit]  = useState(false)
  const score = submitted
    ? quiz.filter((q, i) => answers[i] === q.correct).length
    : 0

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Brain size={16} color={C.accent} /> Quick Check
      </div>

      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            {qi + 1}. {q.q}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const selected  = answers[qi] === oi
              const isCorrect = oi === q.correct
              let bg = C.raised, border = C.border, color = C.textSub

              if (submitted) {
                if (isCorrect) { bg = 'rgba(52,211,153,0.1)'; border = '#34D399'; color = '#34D399' }
                else if (selected && !isCorrect) { bg = 'rgba(248,113,113,0.1)'; border = '#F87171'; color = '#F87171' }
              } else if (selected) {
                bg = `${C.accent}15`; border = C.accent; color = C.accent
              }

              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    background: bg, border: `1px solid ${border}`,
                    cursor: submitted ? 'default' : 'pointer',
                    textAlign: 'left', color, fontSize: 13, fontWeight: selected ? 600 : 400,
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${selected || (submitted && isCorrect) ? border : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: selected ? border : 'transparent',
                  }}>
                    {selected && !submitted && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    {submitted && isCorrect && <CheckCircle2 size={12} color={selected ? '#000' : '#34D399'} />}
                  </div>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => Object.keys(answers).length === quiz.length && setSubmit(true)}
          disabled={Object.keys(answers).length < quiz.length}
          style={{
            padding: '10px 22px', borderRadius: 9,
            background: Object.keys(answers).length === quiz.length ? C.accent : C.border,
            color: Object.keys(answers).length === quiz.length ? '#fff' : C.faint,
            border: 'none', cursor: Object.keys(answers).length === quiz.length ? 'pointer' : 'default',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          Submit Answers
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 18px', borderRadius: 12,
            background: score === quiz.length ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
            border: `1px solid ${score === quiz.length ? '#34D399' : '#F59E0B'}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <Award size={20} color={score === quiz.length ? '#34D399' : '#F59E0B'} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: score === quiz.length ? '#34D399' : '#F59E0B' }}>
              {score}/{quiz.length} correct {score === quiz.length ? '— Perfect!' : '— Review above'}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              {score === quiz.length ? 'Ready to code!' : 'Review the highlighted answers above'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── INNER PAGE (needs theme context) ─────────────────────────────────────────
function ModuleContentInner() {
  const navigate = useNavigate()
  const { trackId, moduleId } = useParams()
  const { C } = useTheme()

  const [activeTab, setActiveTab] = useState('learn')
  const [quizDone, setQuizDone]   = useState(false)

  // Find track + module
  const track   = CAREER_TRACKS.find(t => t.id === trackId) || CAREER_TRACKS[0]
  const modules = MODULES_DATA[track.id] || MODULES_DATA.data_scientist
  const mod     = modules.find(m => m.id === parseInt(moduleId)) || modules[8]
  const content = MODULE_CONTENT[mod?.id] || MODULE_CONTENT[9]
  const typeMeta = TYPE_META[mod?.type] || TYPE_META.theory
  const TypeIcon = typeMeta.icon

  const prevMod = modules[mod.id - 2]
  const nextMod = modules[mod.id]     // next in 0-indexed array

  const TABS = [
    { id: 'learn', label: 'Learn',    Icon: BookOpen  },
    { id: 'code',  label: 'Preview',  Icon: Code2     },
    { id: 'quiz',  label: 'Quiz',     Icon: Brain     },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: C.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        height: 56, background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 12, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <button
          onClick={() => navigate('/pro/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, padding: '6px 0', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
        >
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div style={{ width: 1, height: 18, background: C.border }} />

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, overflow: 'hidden' }}>
          <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{track.title}</span>
          <ChevronRight size={12} color={C.faint} />
          <span style={{ fontSize: 12, color: C.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mod.title}
          </span>
        </div>

        {/* Type badge */}
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6,
          color: typeMeta.color, background: typeMeta.bg, flexShrink: 0,
        }}>
          {typeMeta.label}
        </span>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {mod.dur}
          </span>
          <span style={{ fontSize: 12, color: C.amber, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={12} /> {mod.xp} XP
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Module header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: typeMeta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TypeIcon size={18} color={typeMeta.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
                Module {mod.id} of {modules.length}
              </div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: C.text, letterSpacing: '-0.03em' }}>
                {mod.title}
              </h1>
            </div>
          </div>

          {/* Module progress bar */}
          <div style={{ height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(mod.id / modules.length) * 100}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: '100%', background: typeMeta.color, borderRadius: 99 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Module {mod.id} of {modules.length}</span>
            <span style={{ fontSize: 11, color: C.muted }}>{Math.round((mod.id / modules.length) * 100)}% of track</span>
          </div>
        </motion.div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 2,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 4,
          marginBottom: 28,
        }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '9px 14px', borderRadius: 9,
                  background: active ? C.accent : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: active ? '#fff' : C.muted,
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* ── LEARN tab ── */}
            {activeTab === 'learn' && (
              <div>
                {content.concepts.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 14, padding: '22px 24px',
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeMeta.color, flexShrink: 0 }} />
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{c.title}</h3>
                    </div>
                    <p style={{ fontSize: 13.5, color: C.textSub, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                      {c.body}
                    </p>
                  </motion.div>
                ))}

                {/* Key points */}
                <div style={{
                  background: `${typeMeta.color}0D`,
                  border: `1px solid ${typeMeta.color}25`,
                  borderRadius: 14, padding: '20px 24px',
                  marginBottom: 14,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: typeMeta.color, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Target size={14} /> Key Takeaways
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {content.keyPoints.map((pt, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <CheckCircle2 size={15} color={typeMeta.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CODE PREVIEW tab ── */}
            {activeTab === 'code' && (
              <div>
                <div style={{
                  background: '#0A0C0F',
                  border: '1px solid #1E2028',
                  borderRadius: 14, overflow: 'hidden',
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #1E2028', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#6C7086', fontFamily: "'JetBrains Mono', monospace", marginLeft: 4 }}>
                      preview.py
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#374151' }}>Read-only preview</span>
                  </div>
                  <pre style={{
                    margin: 0, padding: '18px 20px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12.5, lineHeight: 1.75,
                    color: '#ABB2BF', overflowX: 'auto',
                    whiteSpace: 'pre',
                  }}>
                    {content.codePreview}
                  </pre>
                </div>
                <div style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: '16px 18px',
                  fontSize: 13, color: C.muted, lineHeight: 1.6,
                }}>
                  <Sparkles size={13} color={C.accent} style={{ marginRight: 6 }} />
                  This is a preview. In the AI Workspace you will write, edit and run the full solution with live output and AI review.
                </div>
              </div>
            )}

            {/* ── QUIZ tab ── */}
            {activeTab === 'quiz' && (
              <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '24px',
              }}>
                <QuizSection quiz={content.quiz} C={C} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
            background: C.surface,
            borderTop: `1px solid ${C.border}`,
            padding: '14px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Prev */}
          <button
            onClick={() => prevMod && navigate(`/pro/module/${track.id}/${prevMod.id}`)}
            disabled={!prevMod}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 9, padding: '9px 16px',
              color: prevMod ? C.textSub : C.faint,
              fontSize: 13, fontWeight: 500,
              cursor: prevMod ? 'pointer' : 'default',
              fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {/* Centre info */}
          <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: C.muted }}>
            {mod.title} — {mod.dur}
          </div>

          {/* Open workspace */}
          <button
            onClick={() => navigate('/pro/dashboard', { state: { openWorkspace: true } })}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.accent, color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '10px 20px',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Terminal size={14} /> Open in AI Workspace
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── EXPORT (wrapped in ThemeProvider) ────────────────────────────────────────
export default function ModuleContentPage() {
  return (
    <ThemeProvider>
      <ModuleContentInner />
    </ThemeProvider>
  )
}
