// ─── DARK THEME ───────────────────────────────────────────────────────────────
export const DARK = {
  bg:      '#0D0F12',
  surface: '#141719',
  raised:  '#1A1D21',
  border:  '#252830',
  borderL: '#2E3240',
  muted:   '#6B7280',
  faint:   '#374151',
  text:    '#F1F3F5',
  textSub: '#9CA3AF',
  accent:  '#4F8EF7',
  green:   '#34D399',
  amber:   '#F59E0B',
  red:     '#F87171',
  purple:  '#A78BFA',
}

// ─── LIGHT THEME ──────────────────────────────────────────────────────────────
export const LIGHT = {
  bg:      '#F4F6F9',
  surface: '#FFFFFF',
  raised:  '#F0F2F5',
  border:  '#E2E5EA',
  borderL: '#CBD0D8',
  muted:   '#6B7280',
  faint:   '#9CA3AF',
  text:    '#111827',
  textSub: '#374151',
  accent:  '#2563EB',
  green:   '#059669',
  amber:   '#D97706',
  red:     '#DC2626',
  purple:  '#7C3AED',
}

// ─── CAREER TRACKS ────────────────────────────────────────────────────────────
export const CAREER_TRACKS = [
  {
    id: 'data_scientist', title: 'Data Scientist', level: 'Intermediate',
    accent: '#4F8EF7', iconName: 'Database',
    description: 'Master data analysis, machine learning, and statistical modeling.',
    skills: ['Python', 'Pandas', 'ML', 'Statistics'],
    progress: 62, totalModules: 14, doneModules: 8,
  },
  {
    id: 'ml_engineer', title: 'ML Engineer', level: 'Advanced',
    accent: '#A78BFA', iconName: 'Cpu',
    description: 'Build and deploy production-ready ML systems at scale.',
    skills: ['TensorFlow', 'PyTorch', 'MLOps', 'Cloud'],
    progress: 24, totalModules: 18, doneModules: 4,
  },
  {
    id: 'ai_researcher', title: 'AI Researcher', level: 'Expert',
    accent: '#F472B6', iconName: 'Brain',
    description: 'Push the boundaries of AI through cutting-edge research.',
    skills: ['Deep Learning', 'NLP', 'CV', 'Research'],
    progress: 8, totalModules: 22, doneModules: 2,
  },
]

export const TYPE_CFG = {
  theory:   { label: 'Theory',     color: '#4F8EF7', bg: 'rgba(79,142,247,0.12)'  },
  coding:   { label: 'Coding',     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  scenario: { label: 'Case Study', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
}

export const MODULES_DATA = {
  data_scientist: [
    { id: 1,  title: 'Python for Data Science',         type: 'theory',   dur: '45 min',  xp: 200,  status: 'done'   },
    { id: 2,  title: 'NumPy & Pandas Deep Dive',        type: 'coding',   dur: '60 min',  xp: 350,  status: 'done'   },
    { id: 3,  title: 'Statistical Analysis',            type: 'theory',   dur: '50 min',  xp: 250,  status: 'done'   },
    { id: 4,  title: 'EDA on Real Datasets',            type: 'scenario', dur: '90 min',  xp: 500,  status: 'done'   },
    { id: 5,  title: 'Supervised Learning I',           type: 'theory',   dur: '55 min',  xp: 300,  status: 'done'   },
    { id: 6,  title: 'Linear & Logistic Regression',   type: 'coding',   dur: '75 min',  xp: 400,  status: 'done'   },
    { id: 7,  title: 'Decision Trees & Random Forests', type: 'theory',   dur: '60 min',  xp: 300,  status: 'done'   },
    { id: 8,  title: 'Customer Churn Case Study',       type: 'scenario', dur: '120 min', xp: 700,  status: 'done'   },
    { id: 9,  title: 'Unsupervised Learning',           type: 'theory',   dur: '50 min',  xp: 300,  status: 'active' },
    { id: 10, title: 'K-Means Clustering Lab',          type: 'coding',   dur: '70 min',  xp: 400,  status: 'locked' },
    { id: 11, title: 'Dimensionality Reduction',        type: 'theory',   dur: '45 min',  xp: 250,  status: 'locked' },
    { id: 12, title: 'Recommendation Engine Build',     type: 'scenario', dur: '150 min', xp: 900,  status: 'locked' },
    { id: 13, title: 'Model Deployment',                type: 'coding',   dur: '80 min',  xp: 500,  status: 'locked' },
    { id: 14, title: 'Capstone Project',                type: 'scenario', dur: '240 min', xp: 1500, status: 'locked' },
  ],
  ml_engineer: [
    { id: 1, title: 'TensorFlow Foundations',          type: 'theory',   dur: '60 min',  xp: 300, status: 'done'   },
    { id: 2, title: 'Building Neural Networks',        type: 'coding',   dur: '90 min',  xp: 500, status: 'done'   },
    { id: 3, title: 'Model Evaluation & Tuning',       type: 'theory',   dur: '50 min',  xp: 280, status: 'done'   },
    { id: 4, title: 'Image Classification Pipeline',   type: 'scenario', dur: '120 min', xp: 700, status: 'done'   },
    { id: 5, title: 'MLOps Introduction',              type: 'theory',   dur: '55 min',  xp: 320, status: 'active' },
    { id: 6, title: 'Docker for ML',                   type: 'coding',   dur: '75 min',  xp: 420, status: 'locked' },
    { id: 7, title: 'Model Serving with FastAPI',      type: 'coding',   dur: '80 min',  xp: 450, status: 'locked' },
    { id: 8, title: 'Cloud Deployment Lab',            type: 'scenario', dur: '150 min', xp: 900, status: 'locked' },
  ],
  ai_researcher: [
    { id: 1, title: 'Research Paper Reading',           type: 'theory',   dur: '60 min',  xp: 200,  status: 'done'   },
    { id: 2, title: 'Transformer Architecture',         type: 'theory',   dur: '90 min',  xp: 450,  status: 'done'   },
    { id: 3, title: 'Implementing Attention Mechanism', type: 'coding',   dur: '120 min', xp: 700,  status: 'active' },
    { id: 4, title: 'NLP Research Case Study',          type: 'scenario', dur: '180 min', xp: 1100, status: 'locked' },
    { id: 5, title: 'Diffusion Models',                 type: 'theory',   dur: '75 min',  xp: 400,  status: 'locked' },
  ],
}

export const SKILL_DATA = [
  { skill: 'Python',       A: 82 },
  { skill: 'ML Theory',    A: 67 },
  { skill: 'Statistics',   A: 74 },
  { skill: 'Data Viz',     A: 58 },
  { skill: 'SQL',          A: 71 },
  { skill: 'Deep Learning',A: 34 },
]

export const ACTIVITY_DATA = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 340 },
  { day: 'Wed', xp: 180 },
  { day: 'Thu', xp: 520 },
  { day: 'Fri', xp: 290 },
  { day: 'Sat', xp: 410 },
  { day: 'Sun', xp: 160 },
]

export const PROJECTS = [
  { id: 1, title: 'Recommendation System',      tech: ['Python', 'Pandas', 'Scikit-learn'], level: 'Intermediate', xp: 1200, dur: '4–6 hr', accent: '#4F8EF7' },
  { id: 2, title: 'Computer Vision Classifier', tech: ['TensorFlow', 'CNN', 'Python'],      level: 'Advanced',     xp: 1800, dur: '6–8 hr', accent: '#A78BFA' },
  { id: 3, title: 'NLP Sentiment Pipeline',     tech: ['NLTK', 'Transformers', 'PyTorch'],  level: 'Advanced',     xp: 1600, dur: '5–7 hr', accent: '#34D399' },
]

export const ACHIEVEMENTS_DATA = [
  { title: 'First Steps',    desc: 'Complete your first module',          xp: 200,  done: true,  accent: '#34D399', iconName: 'CheckCircle2' },
  { title: 'Speed Demon',    desc: 'Finish 5 modules in one day',         xp: 500,  done: true,  accent: '#4F8EF7', iconName: 'Zap'          },
  { title: 'Perfectionist',  desc: 'Score 100% on 3 consecutive tasks',   xp: 750,  done: true,  accent: '#A78BFA', iconName: 'Star'         },
  { title: 'Marathon Coder', desc: '10 hours of coding in a single week', xp: 1000, done: false, accent: '#F59E0B', iconName: 'Clock'        },
  { title: 'Team Player',    desc: 'Complete a collaborative project',     xp: 800,  done: false, accent: '#F472B6', iconName: 'Users'        },
  { title: 'Deep Dive',      desc: 'Complete the full Advanced ML track',  xp: 2000, done: false, accent: '#6366F1', iconName: 'Brain'        },
]

export const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',      iconName: 'LayoutDashboard' },
  { id: 'learning',     label: 'Learning Path', iconName: 'GitMerge'        },
  { id: 'workspace',    label: 'AI Workspace',  iconName: 'Terminal'        },
  { id: 'chat',         label: 'AI Chat',       iconName: 'MessageSquare'   },
  { id: 'analytics',    label: 'Analytics',     iconName: 'BarChart3'       },
  { id: 'achievements', label: 'Achievements',  iconName: 'Trophy'          },
]

export const MILESTONES = [
  { label: 'Tasks Completed', value: 328, max: 500,  color: '#4F8EF7' },
  { label: 'Hours Logged',    value: 82,  max: 100,  color: '#A78BFA' },
  { label: 'Skills Mastered', value: 12,  max: 20,   color: '#34D399' },
  { label: 'Team Projects',   value: 45,  max: 100,  color: '#F59E0B' },
]
