/**
 * src/data/kids/zoneData.js
 * Single Source of Truth for Kids Curriculum (Premium Mini-Games Edition)
 */

export const XP_MAP = { visual: 50, story: 75, logic: 100 }
export const ZONE_XP = 225
export const XP_PER_LEVEL = 500

export const TASK_TYPES = [
  { id: 'visual', label: 'Visual Task',  icon: 'Paintbrush', color: '#EC4899', bg: '#FDF2F8', xp: 50,  desc: 'Sort & Drop Challenge' },
  { id: 'story',  label: 'Story Task',   icon: 'Mic',        color: '#3B82F6', bg: '#EFF6FF', xp: 75,  desc: 'Voice & Chat Mission'  },
  { id: 'logic',  label: 'Logic Task',   icon: 'Puzzle',     color: '#10B981', bg: '#F0FDF4', xp: 100, desc: 'Pattern Puzzle'      },
]

export const ZONE_CURRICULUM = {
  // ─── ZONE 1: AI EXPLORER ───────────────────────────────────────────────────
  ai_explorer: {
    label: 'AI Explorer', color: '#3B82F6', glow: 'rgba(59,130,246,0.22)',
    
    // Naya "Teach AI Categories" Visual Task Format
    visual: {
      title: 'Teach AI Categories 🧠',
      instruction: 'Hint: Cats and Dogs belong in the PETS bin!',
      bins: [
        { id: 'pets', label: 'PETS 🐕', activeBg: '#FEF3C7', borderColor: '#F59E0B' },
        { id: 'food', label: 'FOOD 🍎', activeBg: '#FEE2E2', borderColor: '#EF4444' },
      ],
      items: [
        { id: 'cat',    icon: 'Cat',    type: 'pets', color: '#FEF3C7', iconColor: '#D97706' },
        { id: 'dog',    icon: 'Dog',    type: 'pets', color: '#D1FAE5', iconColor: '#059669' },
        { id: 'rabbit', icon: 'Rabbit', type: 'pets', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'apple',  icon: 'Apple',  type: 'food', color: '#FEE2E2', iconColor: '#DC2626' },
        { id: 'carrot', icon: 'Carrot', type: 'food', color: '#FFEDD5', iconColor: '#EA580C' },
        { id: 'cherry', icon: 'Cherry', type: 'food', color: '#FCE7F3', iconColor: '#DB2777' },
      ],
    },

    // Naya Kid-Friendly Story/Chat Format
    story: {
      title: 'Chat with ARIA!',
      scenario: 'ARIA is a new AI and wants to learn about the world. Talk to her using your voice!',
      botName: 'ARIA', botAvatar: 'Bot', botColor: '#3B82F6',
      prompts: [
        "Hi friend! I'm ARIA! What exactly am I?",
        "How do I learn new things? Do I go to school?",
        "Can you give me an example of how AI helps people?",
      ],
      keywords: ['robot', 'computer', 'learn', 'data', 'smart', 'help', 'predict', 'examples'],
    },

    // Naya "Pattern Puzzle Challenge" Format
    logic: {
      title: 'Pattern Puzzle Challenge!',
      instruction: 'Arrange the blocks in order! 🎯',
      hint: 'Drag and drop: 🔴 → 🟦 → 🔶 → ⭐',
      targetOrder: ['circle', 'square', 'diamond', 'star'],
      blocks: [
        { id: 'circle',  icon: 'Circle',  color: '#E11D48', bg: '#FB7185', shape: 'Circle' },   
        { id: 'square',  icon: 'Square',  color: '#1D4ED8', bg: '#60A5FA', shape: 'Square' },   
        { id: 'diamond', icon: 'Diamond', color: '#EA580C', bg: '#FB923C', shape: 'Diamond' },  
        { id: 'star',    icon: 'Star',    color: '#EAB308', bg: '#2DD4BF', shape: 'Star' },     
      ],
    },
  },

  // ─── ZONE 2: DATA DETECTIVES ───────────────────────────────────────────────
  data_detectives: {
    label: 'Data Detectives', color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)',
    
    visual: {
      title: 'Sort Vehicles vs Toys 🏎️',
      instruction: 'Hint: Cars and Trains belong in the VEHICLES bin!',
      bins: [
        { id: 'vehicles', label: 'VEHICLES 🚗', activeBg: '#E0E7FF', borderColor: '#4F46E5' },
        { id: 'toys',     label: 'TOYS 🧸',     activeBg: '#FCE7F3', borderColor: '#DB2777' },
      ],
      items: [
        { id: 'car',     icon: 'Car',        type: 'vehicles', color: '#DBEAFE', iconColor: '#2563EB' },
        { id: 'bus',     icon: 'Bus',        type: 'vehicles', color: '#FEF3C7', iconColor: '#D97706' },
        { id: 'train',   icon: 'TrainFront', type: 'vehicles', color: '#D1FAE5', iconColor: '#059669' },
        { id: 'gamepad', icon: 'Gamepad2',   type: 'toys',     color: '#FCE7F3', iconColor: '#DB2777' },
        { id: 'puzzle',  icon: 'Puzzle',     type: 'toys',     color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'teddy',   icon: 'ToyBrick',   type: 'toys',     color: '#FFEDD5', iconColor: '#EA580C' },
      ],
    },

    story: {
      title: 'Detective Bot Needs Help!',
      scenario: 'Detective Bot found lots of hidden data. Help it use this data to learn like a smart machine!',
      botName: 'Detective Bot', botAvatar: 'UserSearch', botColor: '#8B5CF6',
      prompts: [
        "I found tons of images. What should I do with them?",
        "What does it mean to 'Label' a photo?",
        "How do I know if I've learned correctly?",
      ],
      keywords: ['label', 'train', 'pattern', 'feature', 'accuracy', 'test', 'data'],
    },

    logic: {
      title: 'Weather Pattern Challenge!',
      instruction: 'Arrange the weather symbols in order! 🌤️',
      hint: 'Drag and drop: ☁️ → 🌙 → ☀️ → ⚡',
      targetOrder: ['cloud', 'moon', 'sun', 'zap'],
      blocks: [
        { id: 'cloud', icon: 'Cloud', color: '#4B5563', bg: '#9CA3AF', shape: 'Cloud' },   
        { id: 'moon',  icon: 'Moon',  color: '#4338CA', bg: '#818CF8', shape: 'Moon' },   
        { id: 'sun',   icon: 'Sun',   color: '#EA580C', bg: '#FBBF24', shape: 'Sun' },  
        { id: 'zap',   icon: 'Zap',   color: '#B45309', bg: '#FDE047', shape: 'Lightning' },     
      ],
    },
  },
}

export const ZONES_LIST = [
  { id: 'ai_explorer',      order: 1, label: 'AI Explorer',       sublabel: 'What is AI?',            color: '#3B82F6', glow: 'rgba(59,130,246,0.28)',  side: 'left'  },
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