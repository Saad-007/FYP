/**
 * src/data/kids/zoneData.js
 * Single Source of Truth for Kids Curriculum
 */

export const XP_MAP = { visual: 50, story: 75, logic: 100 }
export const ZONE_XP = 225
export const XP_PER_LEVEL = 500

export const TASK_TYPES = [
  { id: 'visual', label: 'Visual Task',  icon: 'Paintbrush', color: '#EC4899', bg: '#FDF2F8', xp: 50,  desc: 'Drag & Drop Challenge' },
  { id: 'story',  label: 'Story Task',   icon: 'Mic',        color: '#3B82F6', bg: '#EFF6FF', xp: 75,  desc: 'Voice & Chat Mission'  },
  { id: 'logic',  label: 'Logic Task',   icon: 'Puzzle',     color: '#10B981', bg: '#F0FDF4', xp: 100, desc: 'Puzzle & Flowchart'     },
]

export const ZONE_CURRICULUM = {
  // ─── ZONE 1: AI EXPLORER ───────────────────────────────────────────────────
  ai_explorer: {
    label: 'AI Explorer', color: '#3B82F6', glow: 'rgba(59,130,246,0.22)',
    visual: {
      title: 'Sort Smart vs Fixed!',
      instruction: 'Drag each card into the correct bucket — does it use AI or just follow fixed rules?',
      items: [
        { id: 'v1', text: 'Spam filter learns from emails',  category: 'ai',   icon: 'MailWarning' },
        { id: 'v2', text: 'Calculator adds numbers',         category: 'rule', icon: 'Calculator' },
        { id: 'v3', text: 'Face recognition unlock',         category: 'ai',   icon: 'ScanFace' },
        { id: 'v4', text: 'Alarm rings at 7am',              category: 'rule', icon: 'AlarmClock' },
        { id: 'v5', text: 'Voice assistant understands you', category: 'ai',   icon: 'AudioLines' },
        { id: 'v6', text: 'Traffic light changes on timer',  category: 'rule', icon: 'TrafficCone' },
      ],
      buckets: [
        { id: 'ai',   label: 'Uses AI',     icon: 'Brain',    color: '#3B82F6', hint: 'Learns from data & examples' },
        { id: 'rule', label: 'Fixed Rules', icon: 'Settings', color: '#8B5CF6', hint: 'Always does the same thing'  },
      ],
    },
    story: {
      title: 'Meet ARIA — Your AI Friend!',
      scenario: 'You just switched on ARIA. She has no idea what AI is. Explain it to her!',
      botName: 'ARIA', botAvatar: 'Bot', botColor: '#3B82F6',
      prompts: [
        "Hi! I just woke up. What am I exactly?",
        "How am I different from a normal computer program?",
        "Can you give me a real-life example of AI?",
      ],
      keywords: ['learn','data','train','smart','predict','pattern','example','improve','machine'],
      hint: 'Try: learn, data, pattern, predict, train',
    },
    logic: {
      title: 'Fix the AI Decision Tree!',
      instruction: 'Rearrange these steps so the AI can decide if an email is spam.',
      steps: [
        { id: 'l1', order: 0, text: 'Receive new email',          icon: 'Inbox',        bg: '#EFF6FF', color: '#3B82F6' },
        { id: 'l2', order: 1, text: 'Scan for spam keywords',     icon: 'Search',       bg: '#DBEAFE', color: '#2563EB' },
        { id: 'l3', order: 2, text: 'Check sender reputation',    icon: 'ShieldAlert',  bg: '#EDE9FE', color: '#8B5CF6' },
        { id: 'l4', order: 3, text: 'AI predicts: spam or not?',  icon: 'BrainCircuit', bg: '#FCE7F3', color: '#EC4899' },
        { id: 'l5', order: 4, text: 'Move to spam / inbox',       icon: 'FolderKanban', bg: '#D1FAE5', color: '#10B981' },
      ],
    },
  },

  // ─── ZONE 2: DATA DETECTIVES ───────────────────────────────────────────────
  data_detectives: {
    label: 'Data Detectives', color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)',
    visual: {
      title: 'Label the Patient Data!',
      instruction: 'The AI doctor needs labeled data. Drag each record into the correct diagnosis!',
      items: [
        { id: 'v1', text: 'Temp 38°C, Cough: Yes',   category: 'sick',    icon: 'Thermometer' },
        { id: 'v2', text: 'Temp 36°C, Cough: No',    category: 'healthy', icon: 'Activity' },
        { id: 'v3', text: 'Temp 39°C, Cough: Yes',   category: 'sick',    icon: 'Thermometer' },
        { id: 'v4', text: 'Temp 36.5°C, Cough: No',  category: 'healthy', icon: 'Activity' },
        { id: 'v5', text: 'Temp 37.5°C, Cough: Yes', category: 'sick',    icon: 'Thermometer' },
        { id: 'v6', text: 'Temp 36.2°C, Cough: No',  category: 'healthy', icon: 'Activity' },
      ],
      buckets: [
        { id: 'sick',    label: 'Sick Patient',    icon: 'Stethoscope', color: '#EF4444', hint: 'High temp + cough' },
        { id: 'healthy', label: 'Healthy Patient', icon: 'HeartPulse',  color: '#10B981', hint: 'Normal temp, no cough' },
      ],
    },
    story: {
      title: 'Detective Bot Needs Help!',
      scenario: 'Detective Bot found 1000 cat and dog photos. Help it use this data to learn!',
      botName: 'Detective Bot', botAvatar: 'UserSearch', botColor: '#8B5CF6',
      prompts: [
        "I have tons of photos. What should I do with them?",
        "What's a label and why do I need it?",
        "How do I know if I've learned correctly?",
      ],
      keywords: ['label','train','pattern','feature','accuracy','test','data','correct','example','classify'],
      hint: 'Try: label, train, feature, accuracy, test',
    },
    logic: {
      title: 'Build the Data Pipeline!',
      instruction: 'Put these data science steps in the right order.',
      steps: [
        { id: 'l1', order: 0, text: 'Collect raw data',           icon: 'Package',  bg: '#EDE9FE', color: '#8B5CF6' },
        { id: 'l2', order: 1, text: 'Clean & remove bad records', icon: 'Sparkles', bg: '#F3E8FF', color: '#A855F7' },
        { id: 'l3', order: 2, text: 'Label the data',             icon: 'Tag',      bg: '#E0F2FE', color: '#0EA5E9' },
        { id: 'l4', order: 3, text: 'Train the AI model',         icon: 'Dumbbell', bg: '#FCE7F3', color: '#EC4899' },
        { id: 'l5', order: 4, text: 'Test accuracy & deploy',     icon: 'Rocket',   bg: '#D1FAE5', color: '#10B981' },
      ],
    },
  },
}

export const ZONES_LIST = [
  { id: 'ai_explorer',      order: 1, label: 'AI Explorer',       sublabel: 'What is AI?',            color: '#3B82F6', glow: 'rgba(59,130,246,0.28)',   side: 'left'  },
  { id: 'data_detectives',  order: 2, label: 'Data Detectives',   sublabel: 'Pattern Recognition',    color: '#8B5CF6', glow: 'rgba(139,92,246,0.28)',  side: 'right' },
  { id: 'algorithm_logic',  order: 3, label: 'Algorithm Logic',   sublabel: 'Step-by-step Thinking',  color: '#0EA5E9', glow: 'rgba(14,165,233,0.28)',  side: 'left'  },
  { id: 'machine_learning', order: 4, label: 'Machine Learning',  sublabel: 'Training the AI',        color: '#EC4899', glow: 'rgba(236,72,153,0.28)',  side: 'right' },
  { id: 'computer_vision',  order: 5, label: 'Computer Vision',   sublabel: 'How AI Sees',            color: '#10B981', glow: 'rgba(16,185,129,0.28)',  side: 'left'  },
  { id: 'talking_bots',     order: 6, label: 'Talking Bots',      sublabel: 'NLP & Voice',            color: '#06B6D4', glow: 'rgba(6,182,212,0.28)',   side: 'right' },
  { id: 'creative_studio',  order: 7, label: 'Creative Studio',   sublabel: 'Generative AI',          color: '#F59E0B', glow: 'rgba(245,158,11,0.28)',  side: 'left'  },
  { id: 'hero_rules',       order: 8, label: 'Hero Rules',        sublabel: 'AI Ethics',              color: '#EF4444', glow: 'rgba(239,68,68,0.28)',   side: 'right' },
]

export const zoneComplete  = (id, done) => TASK_TYPES.every(t => done.includes(`${id}_${t.id}`))
export const zoneUnlocked  = (zone, done) => {
  if (zone.order === 1) return true
  const prev = ZONES_LIST.find(z => z.order === zone.order - 1)
  return zoneComplete(prev.id, done)
}