/**
 * src/data/kids/zoneData.js
 * Edu-AIQuest: The Ultimate 24-Zone Curriculum Data Layer
 * Reference: KIDS WORLD ROADMAP (12 Levels x 2 Zones x 3 Tasks)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TYPE LEGEND — what each component will need to render
 * (VisualTask, StoryTask, LogicTask currently only implement a subset;
 *  the rest are new and need component work — see chat notes)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * visual.type:
 *   'sort'   [EXISTING] bins[] + items[] — drag items into the correct bin.
 *            item.type must equal a bin.id to be correct.
 *   'draw'   [EXISTING] free draw canvas, backend scores the drawing.
 *   'find'   [NEW] grid[] of {id, icon, color, isTarget} — tap the
 *            correct target(s) among distractors. targetCount = how many
 *            correct taps are needed to pass.
 *   'select' [NEW] items[] with category tags — child picks exactly
 *            requiredCount items; correctIds defines the valid set
 *            (order doesn't matter).
 *   'slider' [NEW] min/max/target/unit/step — drag a slider until the
 *            value reaches (or crosses) target.
 *
 * story.mode:
 *   'voice'  [EXISTING] mic input, prompts[] + keywords[] checked loosely.
 *   'text'   [EXISTING] typed chat, prompts[] driven.
 *   'choice' [NEW] rounds[] of {prompt, options:[{id,label,correct}]} —
 *            bot says something, child taps the right response button
 *            instead of free voice/text.
 *
 * logic.type:
 *   'order'     [EXISTING] blocks[] + targetOrder[] — arrange in sequence.
 *   'match'     [NEW] pairs[] of {id,leftIcon,leftLabel,rightIcon,rightLabel}
 *               — connect each left item to its correct right item.
 *   'condition' [NEW] rules[] of {ifLabel,ifIcon,thenLabel,thenIcon} —
 *               build/verify if→then logic gates.
 *   'find'      [NEW] same shape as visual 'find' — spot the odd one out.
 *   'slider'    [NEW] same shape as visual 'slider' — reach a threshold.
 *
 * Every task keeps `title` + `instruction` (or `scenario` for story) so
 * the existing KidMissionPage header rendering keeps working unchanged.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const XP_MAP = { visual: 50, story: 75, logic: 100 };
export const ZONE_XP = 225;
export const XP_PER_LEVEL = 500;

export const TASK_TYPES = [
  { id: 'visual', label: 'Visual Task',  icon: 'Paintbrush', color: '#EC4899', bg: '#FDF2F8', xp: 50,  desc: 'Sort & Drop Challenge' },
  { id: 'story',  label: 'Story Task',   icon: 'Mic',        color: '#3B82F6', bg: '#EFF6FF', xp: 75,  desc: 'Voice & Chat Mission'  },
  { id: 'logic',  label: 'Logic Task',   icon: 'Puzzle',     color: '#10B981', bg: '#F0FDF4', xp: 100, desc: 'Pattern Puzzle'      },
];

export const ZONE_CURRICULUM = {

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 1: THE DIGITAL WORLD & AI BASICS
  // ══════════════════════════════════════════════════════════════════════

  "zone-1": {
    label: 'Smart vs. Basic', color: '#3B82F6', glow: 'rgba(59,130,246,0.22)',
    visual: {
      type: 'draw',
      title: 'Draw an Apple! 🍎',
      instruction: 'Drag devices with a "Brain" to the Smart Bin!',
      bins: [
        { id: 'smart', label: 'SMART (AI) 🧠', activeBg: '#E0E7FF', borderColor: '#4F46E5' },
        { id: 'basic', label: 'BASIC 📻', activeBg: '#F3F4F6', borderColor: '#9CA3AF' }
      ],
      items: [
        { id: 'face_id', icon: 'ScanFace',   type: 'smart', color: '#DBEAFE', iconColor: '#2563EB' },
        { id: 'speaker', icon: 'Speaker',    type: 'smart', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'calc',    icon: 'Calculator', type: 'basic', color: '#F3F4F6', iconColor: '#4B5563' },
        { id: 'radio',   icon: 'Radio',      type: 'basic', color: '#E5E7EB', iconColor: '#6B7280' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'What Powers My Brain?',
      scenario: 'DataBot wants to know how it learns things. Use your mic to teach it!',
      botName: 'DataBot', botAvatar: 'Bot', botColor: '#3B82F6',
      prompts: [
        "Hello! I am a smart robot. But what powers my brain?",
        "Oh, I see! But how do I get this data?",
        "Awesome! So internet helps me learn. Am I smart now?"
      ],
      keywords: ['data', 'information', 'internet', 'learning', 'wifi']
    },
    logic: {
      type: 'match',
      title: 'Pattern Matching!',
      instruction: 'Link each input sensor to the AI output it powers. 🔗',
      hint: 'Camera ➔ Face Unlock · Microphone ➔ Voice Search',
      pairs: [
        { id: 'p1', leftIcon: 'Camera', leftLabel: 'Camera',     rightIcon: 'ScanFace', rightLabel: 'Face Unlock' },
        { id: 'p2', leftIcon: 'Mic',    leftLabel: 'Microphone', rightIcon: 'Search',   rightLabel: 'Voice Search' }
      ]
    }
  },

  "zone-2": {
    label: 'Data Detectives', color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)',
    visual: {
      type: 'sort',
      title: 'Dataset Sorting 🗂️',
      instruction: 'Drag images, text snippets, and audio files into their dataset folders!',
      bins: [
        { id: 'image', label: 'IMAGES 🖼️', activeBg: '#FCE7F3', borderColor: '#DB2777' },
        { id: 'text',  label: 'TEXT 📝',    activeBg: '#EFF6FF', borderColor: '#2563EB' },
        { id: 'audio', label: 'AUDIO 🎵',   activeBg: '#FEF3C7', borderColor: '#D97706' }
      ],
      items: [
        { id: 'pic1',  icon: 'Image',    type: 'image', color: '#FCE7F3', iconColor: '#DB2777' },
        { id: 'pic2',  icon: 'Camera',   type: 'image', color: '#FBCFE8', iconColor: '#BE185D' },
        { id: 'note1', icon: 'FileText', type: 'text',  color: '#DBEAFE', iconColor: '#2563EB' },
        { id: 'note2', icon: 'BookOpen', type: 'text',  color: '#BFDBFE', iconColor: '#1D4ED8' },
        { id: 'aud1',  icon: 'Music',    type: 'audio', color: '#FEF3C7', iconColor: '#D97706' },
        { id: 'aud2',  icon: 'Mic',      type: 'audio', color: '#FDE68A', iconColor: '#B45309' }
      ]
    },
    story: {
      mode: 'choice',
      title: 'Prompting Basics',
      scenario: 'Help the bot recognize a dog — but only image inputs will work!',
      botName: 'LabelBot', botAvatar: 'Search', botColor: '#8B5CF6',
      rounds: [
        {
          prompt: "I want to learn what a dog looks like. Which input should you give me?",
          options: [
            { id: 'a', label: '🖼️ A photo of a dog', correct: true },
            { id: 'b', label: '🎵 An audio clip of barking', correct: false }
          ]
        },
        {
          prompt: "Great choice! Now — should I look at one photo, or many photos?",
          options: [
            { id: 'a', label: 'Just one is enough', correct: false },
            { id: 'b', label: 'Many different photos', correct: true }
          ]
        }
      ]
    },
    logic: {
      type: 'find',
      title: 'Anomaly Detection',
      instruction: 'Find the odd one out hidden in this dataset! 🔍',
      hint: 'Three of these are dogs — one is not.',
      grid: [
        { id: 'd1', icon: 'Dog', color: '#8B5CF6', isTarget: false },
        { id: 'd2', icon: 'Dog', color: '#8B5CF6', isTarget: false },
        { id: 'c1', icon: 'Car', color: '#EF4444', isTarget: true },
        { id: 'd3', icon: 'Dog', color: '#8B5CF6', isTarget: false }
      ],
      targetCount: 1
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 2: HOW MACHINES LEARN (THE BRAIN)
  // ══════════════════════════════════════════════════════════════════════

  "zone-3": {
    label: 'Algorithm Logic', color: '#0EA5E9', glow: 'rgba(14,165,233,0.22)',
    visual: {
      type: 'sort',
      title: 'Sequence Building 🥪',
      instruction: 'Arrange the sandwich steps in the correct order — tap in order!',
      bins: [
        { id: 'step', label: 'SANDWICH ORDER 🥪', activeBg: '#DBEAFE', borderColor: '#2563EB' },
        { id: 'pool', label: 'WAITING 🧺', activeBg: '#F3F4F6', borderColor: '#9CA3AF' }
      ],
      items: [
        { id: 'bread1', icon: 'Square',  type: 'step', color: '#FEF3C7', iconColor: '#D97706' },
        { id: 'jam',     icon: 'Droplets', type: 'step', color: '#FEE2E2', iconColor: '#DC2626' },
        { id: 'butter',  icon: 'Layers',  type: 'step', color: '#FEF9C3', iconColor: '#CA8A04' },
        { id: 'bread2',  icon: 'Square',  type: 'step', color: '#FEF3C7', iconColor: '#D97706' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'Voice Navigation',
      scenario: 'NaviBot is lost in a maze. Guide it out using step-by-step commands!',
      botName: 'NaviBot', botAvatar: 'Navigation', botColor: '#0EA5E9',
      prompts: [
        "I am facing a wall. Should I go straight or turn?",
        "Okay, I turned! Now I see the exit door far away. What's the next step?",
        "I reached the door! You are a great algorithm designer!"
      ],
      keywords: ['turn', 'left', 'right', 'straight', 'forward', 'step']
    },
    logic: {
      type: 'condition',
      title: 'Conditional Logic (If/Else)',
      instruction: 'Build the rule: what should we pack for the weather? ☔☀️',
      hint: 'If it is raining, pack an umbrella. If sunny, pack sunglasses.',
      rules: [
        { id: 'r1', ifLabel: 'Raining', ifIcon: 'CloudRain', thenLabel: 'Umbrella', thenIcon: 'Umbrella' },
        { id: 'r2', ifLabel: 'Sunny',   ifIcon: 'Sun',       thenLabel: 'Sunglasses', thenIcon: 'Glasses' }
      ]
    }
  },

  "zone-4": {
    label: 'Model Training', color: '#EC4899', glow: 'rgba(236,72,153,0.22)',
    visual: {
      type: 'sort',
      title: 'Data Feeding 🍎',
      instruction: 'Train the model — drag only apple images into the processing unit!',
      bins: [
        { id: 'apple', label: 'PROCESSING UNIT 🧠', activeBg: '#FCE7F3', borderColor: '#DB2777' },
        { id: 'reject', label: 'NOT AN APPLE ❌', activeBg: '#F3F4F6', borderColor: '#9CA3AF' }
      ],
      items: [
        { id: 'apple1', icon: 'Apple',  type: 'apple',  color: '#FEE2E2', iconColor: '#DC2626' },
        { id: 'apple2', icon: 'Apple',  type: 'apple',  color: '#DCFCE7', iconColor: '#16A34A' },
        { id: 'banana', icon: 'Banana', type: 'reject', color: '#FEF9C3', iconColor: '#CA8A04' },
        { id: 'grape',  icon: 'Grape',  type: 'reject', color: '#F3E8FF', iconColor: '#9333EA' }
      ]
    },
    story: {
      mode: 'choice',
      title: 'Model Correction',
      scenario: 'The AI keeps mixing up its fruit labels. Help it learn the right tag!',
      botName: 'NeuralBot', botAvatar: 'Brain', botColor: '#EC4899',
      rounds: [
        {
          prompt: "I labeled this round, red, juicy fruit as... an Apple! 🍅",
          options: [
            { id: 'a', label: 'Correct! Keep it as Apple', correct: false },
            { id: 'b', label: "That's wrong — it's a Tomato", correct: true }
          ]
        }
      ]
    },
    logic: {
      type: 'slider',
      title: 'Gemini Vision Eval',
      instruction: 'Draw the shape, then slide to match the AI accuracy score! 🎯',
      hint: 'A clearer, more complete drawing scores higher.',
      min: 0, max: 100, target: 80, unit: '% accuracy', step: 5
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 3: AI SENSES & GENERATIVE POWER
  // ══════════════════════════════════════════════════════════════════════

  "zone-5": {
    label: 'Computer Vision', color: '#10B981', glow: 'rgba(16,185,129,0.22)',
    visual: {
      type: 'find',
      title: 'Object Detection 📷',
      instruction: 'Tap the object on the desk so the AI can scan and label it!',
      hint: 'Look for the one item that isn\'t office supplies.',
      grid: [
        { id: 'pen', icon: 'Pen', color: '#10B981', isTarget: false },
        { id: 'cup', icon: 'Coffee', color: '#10B981', isTarget: true },
        { id: 'clip', icon: 'Paperclip', color: '#10B981', isTarget: false },
        { id: 'note', icon: 'StickyNote', color: '#10B981', isTarget: false }
      ],
      targetCount: 1
    },
    story: {
      mode: 'voice',
      title: 'Obstacle Avoidance',
      scenario: 'Verbally guide a "blind" robot around on-screen obstacles using spatial commands.',
      botName: 'VisionBot', botAvatar: 'Eye', botColor: '#10B981',
      prompts: [
        "I can't see! There's something ahead of me. What should I do?",
        "I moved around it! Is the path clear now?",
        "Made it through safely! Thank you for being my eyes!"
      ],
      keywords: ['left', 'right', 'stop', 'around', 'forward', 'careful']
    },
    logic: {
      type: 'slider',
      title: 'Resolution Logic',
      instruction: 'Adjust the slider to improve resolution until confidence hits 100%!',
      hint: 'Sharper images = higher confidence.',
      min: 0, max: 100, target: 100, unit: '% confidence', step: 5
    }
  },

  "zone-6": {
    label: 'Talking Bots', color: '#06B6D4', glow: 'rgba(6,182,212,0.22)',
    visual: {
      type: 'sort',
      title: 'Sentiment Analysis 💬',
      instruction: 'Match each phrase to the correct emotion!',
      bins: [
        { id: 'happy', label: 'HAPPY 😊', activeBg: '#FEF9C3', borderColor: '#CA8A04' },
        { id: 'sad',   label: 'SAD 😢',   activeBg: '#DBEAFE', borderColor: '#2563EB' }
      ],
      items: [
        { id: 'phrase1', icon: 'Trophy', type: 'happy', color: '#FEF9C3', iconColor: '#CA8A04', label: 'I won the game!' },
        { id: 'phrase2', icon: 'Frown',  type: 'sad',   color: '#DBEAFE', iconColor: '#2563EB', label: 'I lost my toy' },
        { id: 'phrase3', icon: 'PartyPopper', type: 'happy', color: '#FDE68A', iconColor: '#B45309', label: 'Best birthday ever!' },
        { id: 'phrase4', icon: 'CloudRain',  type: 'sad',   color: '#BFDBFE', iconColor: '#1D4ED8', label: 'It broke :(' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'Speech-to-Text',
      scenario: 'Speak a phrase in Urdu — the bot will translate and display it in English in real-time.',
      botName: 'TranslateBot', botAvatar: 'Languages', botColor: '#06B6D4',
      prompts: [
        "Say a greeting in Urdu, and I will translate it for you!",
        "Wonderful! Now try telling me how you feel today.",
        "I understood you perfectly! Translation complete."
      ],
      keywords: ['salam', 'shukriya', 'theek', 'khush', 'hello']
    },
    logic: {
      type: 'select',
      title: 'Context Builder',
      instruction: 'Select the missing word to complete this NLP training sentence: "Birds fly in the ___"',
      hint: 'Think about where birds fly.',
      items: [
        { id: 'sky', label: 'sky' },
        { id: 'water', label: 'water' },
        { id: 'ground', label: 'ground' }
      ],
      requiredCount: 1,
      correctIds: ['sky']
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 4: AI CREATION & ETHICS
  // ══════════════════════════════════════════════════════════════════════

  "zone-7": {
    label: 'Creative Studio', color: '#F59E0B', glow: 'rgba(245,158,11,0.22)',
    visual: {
      type: 'select',
      title: 'Element Combination 🎨',
      instruction: 'Select three random visual elements to generate a unique AI illustration!',
      items: [
        { id: 'cat', icon: 'Cat', label: 'Cat' },
        { id: 'space', icon: 'Rocket', label: 'Space' },
        { id: 'pizza', icon: 'Pizza', label: 'Pizza' },
        { id: 'robot', icon: 'Bot', label: 'Robot' },
        { id: 'ocean', icon: 'Waves', label: 'Ocean' },
        { id: 'crown', icon: 'Crown', label: 'Crown' }
      ],
      requiredCount: 3
    },
    story: {
      mode: 'voice',
      title: 'Story Co-Pilot',
      scenario: 'Speak the first sentence of a story into the mic; the generative AI replies with the next fun sentence.',
      botName: 'StoryBot', botAvatar: 'Sparkles', botColor: '#F59E0B',
      prompts: [
        "Let's write a story together! Start us off with your first sentence.",
        "Ooh, I love where this is going! What happens next?",
        "What an amazing story we made together!"
      ],
      keywords: ['once', 'there', 'was', 'then', 'suddenly']
    },
    logic: {
      type: 'order',
      title: 'Prompt Builder',
      instruction: 'Arrange the modular text blocks to build a highly specific image prompt! 🧩',
      hint: '"Red car" + "in the rain" + "cyberpunk"',
      targetOrder: ['subject', 'setting', 'style'],
      blocks: [
        { id: 'style',   icon: 'Wand2',    color: '#D946EF', bg: '#F5D0FE' },
        { id: 'subject', icon: 'Car',      color: '#DC2626', bg: '#FECACA' },
        { id: 'setting', icon: 'CloudRain',color: '#2563EB', bg: '#BFDBFE' }
      ]
    }
  },

  "zone-8": {
    label: 'Hero Rules', color: '#EF4444', glow: 'rgba(239,68,68,0.22)',
    visual: {
      type: 'sort',
      title: 'Ethical Sorting 🦸',
      instruction: 'Sort each action into the correct ethical bin!',
      bins: [
        { id: 'good', label: 'GOOD ✅', activeBg: '#DCFCE7', borderColor: '#16A34A' },
        { id: 'bad',  label: 'BAD ❌',  activeBg: '#FEE2E2', borderColor: '#DC2626' }
      ],
      items: [
        { id: 'doctor', icon: 'Stethoscope', type: 'good', color: '#DCFCE7', iconColor: '#16A34A', label: 'Helping doctors' },
        { id: 'steal',  icon: 'KeyRound',    type: 'bad',  color: '#FEE2E2', iconColor: '#DC2626', label: 'Stealing passwords' },
        { id: 'teach',  icon: 'GraduationCap', type: 'good', color: '#D1FAE5', iconColor: '#059669', label: 'Teaching kids' },
        { id: 'spy',    icon: 'EyeOff',      type: 'bad',  color: '#FECACA', iconColor: '#B91C1C', label: 'Spying on people' }
      ]
    },
    story: {
      mode: 'choice',
      title: 'Privacy Guardian',
      scenario: 'A bot asks for your home address. What should you do?',
      botName: 'ChatBot', botAvatar: 'MessageSquare', botColor: '#EF4444',
      rounds: [
        {
          prompt: "Hi! Can you tell me your home address so I can send you a prize?",
          options: [
            { id: 'a', label: 'Refuse & Report 🚨', correct: true },
            { id: 'b', label: 'Sure, here it is!', correct: false }
          ]
        }
      ]
    },
    logic: {
      type: 'slider',
      title: 'Bias Checker',
      instruction: 'Adjust the logic gate so the system selects red AND green apples equally!',
      hint: 'Fairness means 50/50 — not favoring one color.',
      min: 0, max: 100, target: 50, unit: '% balance', step: 5
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 5: AI IN THE REAL WORLD
  // ══════════════════════════════════════════════════════════════════════

  "zone-9": {
    label: 'Smart Cities', color: '#6366F1', glow: 'rgba(99,102,241,0.22)',
    visual: {
      type: 'find',
      title: 'Traffic Controller 🚦',
      instruction: 'Tap the intersections that need an AI sensor to ease traffic jams!',
      grid: [
        { id: 'i1', icon: 'TrafficCone', color: '#6366F1', isTarget: true },
        { id: 'i2', icon: 'TreePine', color: '#6366F1', isTarget: false },
        { id: 'i3', icon: 'TrafficCone', color: '#6366F1', isTarget: true },
        { id: 'i4', icon: 'Building2', color: '#6366F1', isTarget: false }
      ],
      targetCount: 2
    },
    story: {
      mode: 'voice',
      title: 'Smart Home Command',
      scenario: 'Use the mic to issue commands like "Turn off lights" or "Lock doors" to a virtual home assistant.',
      botName: 'HomeBot', botAvatar: 'Home', botColor: '#6366F1',
      prompts: [
        "Good evening! What would you like me to do around the house?",
        "Done! Anything else before bedtime?",
        "Goodnight! Your home is safe and secure."
      ],
      keywords: ['lights', 'lock', 'doors', 'off', 'on', 'turn']
    },
    logic: {
      type: 'select',
      title: 'Route Optimizer',
      instruction: 'Choose the shortest, most fuel-efficient path for the delivery drone!',
      hint: 'Avoid restricted flight zones (shown in red).',
      items: [
        { id: 'route_a', label: 'Route A — through restricted zone' },
        { id: 'route_b', label: 'Route B — around the zone (safe)' },
        { id: 'route_c', label: 'Route C — long way around' }
      ],
      requiredCount: 1,
      correctIds: ['route_b']
    }
  },

  "zone-10": {
    label: 'Health Bots', color: '#14B8A6', glow: 'rgba(20,184,166,0.22)',
    visual: {
      type: 'find',
      title: 'X-Ray Scanner 🩻',
      instruction: 'Use the magnifying glass to find the fracture in the bone scan!',
      grid: [
        { id: 'b1', icon: 'Bone', color: '#14B8A6', isTarget: false },
        { id: 'b2', icon: 'Bone', color: '#14B8A6', isTarget: true },
        { id: 'b3', icon: 'Bone', color: '#14B8A6', isTarget: false },
        { id: 'b4', icon: 'Bone', color: '#14B8A6', isTarget: false }
      ],
      targetCount: 1
    },
    story: {
      mode: 'voice',
      title: 'Symptom Checker',
      scenario: 'The health bot asks how you feel. Tell it your symptoms!',
      botName: 'HealthBot', botAvatar: 'HeartPulse', botColor: '#14B8A6',
      prompts: [
        "Hi there! How are you feeling today?",
        "I see — let me check what might help.",
        "Remember to rest and drink plenty of water. Feel better soon!"
      ],
      keywords: ['fever', 'sick', 'headache', 'water', 'rest', 'tired']
    },
    logic: {
      type: 'sort',
      title: 'Healthy Sorting',
      instruction: 'Program the sorting arm — separate nutritious foods from junk food!',
      bins: [
        { id: 'healthy', label: 'NUTRITIOUS 🥦', activeBg: '#DCFCE7', borderColor: '#16A34A' },
        { id: 'junk',     label: 'JUNK FOOD 🍟', activeBg: '#FEE2E2', borderColor: '#DC2626' }
      ],
      items: [
        { id: 'apple',  icon: 'Apple',   type: 'healthy', color: '#DCFCE7', iconColor: '#16A34A' },
        { id: 'carrot', icon: 'Carrot',  type: 'healthy', color: '#D1FAE5', iconColor: '#059669' },
        { id: 'fries',  icon: 'Utensils',type: 'junk',    color: '#FEE2E2', iconColor: '#DC2626' },
        { id: 'soda',   icon: 'CupSoda', type: 'junk',    color: '#FECACA', iconColor: '#B91C1C' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 6: FUTURE AI EXPLORERS
  // ══════════════════════════════════════════════════════════════════════

  "zone-11": {
    label: 'The Cloud', color: '#3B82F6', glow: 'rgba(59,130,246,0.22)',
    visual: {
      type: 'select',
      title: 'Connect the Devices ☁️',
      instruction: 'Select every device that should connect to the central Cloud server!',
      items: [
        { id: 'phone', icon: 'Smartphone', label: 'Smartphone' },
        { id: 'tablet', icon: 'Tablet', label: 'Tablet' },
        { id: 'watch', icon: 'Watch', label: 'Smartwatch' },
        { id: 'toaster', icon: 'Sandwich', label: 'Toaster (offline)' }
      ],
      requiredCount: 3,
      correctIds: ['phone', 'tablet', 'watch']
    },
    story: {
      mode: 'voice',
      title: 'Voice Memo Backup',
      scenario: 'Speak a secret code word — the bot uploads it to the cloud so you can retrieve it on another device.',
      botName: 'CloudBot', botAvatar: 'Cloud', botColor: '#3B82F6',
      prompts: [
        "Tell me a secret code word and I'll save it to the cloud!",
        "Saved! Now let's pretend you're on a different device — say 'retrieve' to get it back.",
        "There it is — safely backed up in the cloud!"
      ],
      keywords: ['code', 'save', 'remember', 'retrieve']
    },
    logic: {
      type: 'sort',
      title: 'Server Load Balance',
      instruction: 'Distribute the incoming data blocks equally across all three servers!',
      hint: 'An even spread keeps every server running smoothly.',
      bins: [
        { id: 'server_a', label: 'SERVER A', activeBg: '#DBEAFE', borderColor: '#2563EB' },
        { id: 'server_b', label: 'SERVER B', activeBg: '#DCFCE7', borderColor: '#16A34A' },
        { id: 'server_c', label: 'SERVER C', activeBg: '#FEF9C3', borderColor: '#CA8A04' }
      ],
      items: [
        { id: 'block1', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'block2', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'block3', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'block4', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'block5', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'block6', icon: 'Database', type: 'any', color: '#E0E7FF', iconColor: '#4F46E5' }
      ]
    }
  },

  "zone-12": {
    label: 'Human + AI', color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)',
    visual: {
      type: 'sort',
      title: 'Bridge Builder 🌉',
      instruction: 'Assign engineers and robots to their teams to build the bridge faster together!',
      bins: [
        { id: 'human', label: 'HUMAN TEAM 👷', activeBg: '#F5F3FF', borderColor: '#7C3AED' },
        { id: 'robot', label: 'AI TEAM 🤖', activeBg: '#EFF6FF', borderColor: '#2563EB' }
      ],
      items: [
        { id: 'eng1', icon: 'HardHat', type: 'human', color: '#F5F3FF', iconColor: '#7C3AED' },
        { id: 'eng2', icon: 'HardHat', type: 'human', color: '#EDE9FE', iconColor: '#6D28D9' },
        { id: 'bot1', icon: 'Bot', type: 'robot', color: '#EFF6FF', iconColor: '#2563EB' },
        { id: 'bot2', icon: 'Cog', type: 'robot', color: '#DBEAFE', iconColor: '#1D4ED8' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'The AI Assistant',
      scenario: 'The bot asks a difficult question — command it to "Search the library" to find the fact.',
      botName: 'AssistBot', botAvatar: 'BookOpen', botColor: '#8B5CF6',
      prompts: [
        "Hmm, that's a tricky question. What should I do to find the answer?",
        "Searching the library now... Anything else I should check?",
        "Found it! Teamwork between humans and AI makes us both smarter."
      ],
      keywords: ['search', 'library', 'find', 'look up']
    },
    logic: {
      type: 'match',
      title: 'Knowledge Match (RAG)',
      instruction: 'Match each question to the correct book (database chunk) to generate the answer!',
      hint: '"Why is the sky blue?" ➔ Science Book',
      pairs: [
        { id: 'p1', leftIcon: 'HelpCircle', leftLabel: 'Why is the sky blue?', rightIcon: 'FlaskConical', rightLabel: 'Science Book' },
        { id: 'p2', leftIcon: 'HelpCircle', leftLabel: 'Who was the first president?', rightIcon: 'Landmark', rightLabel: 'History Book' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 7: ROBOTICS & MOVEMENT (AI IN THE PHYSICAL WORLD)
  // ══════════════════════════════════════════════════════════════════════

  "zone-13": {
    label: 'Robot Anatomy', color: '#0EA5E9', glow: 'rgba(14,165,233,0.22)',
    visual: {
      type: 'sort',
      title: 'Brain vs. Body 🤖',
      instruction: 'Drag computer chips into Brain/Software, and wheels/arms into Body/Hardware!',
      bins: [
        { id: 'software', label: 'BRAIN (SOFTWARE) 💾', activeBg: '#DBEAFE', borderColor: '#2563EB' },
        { id: 'hardware', label: 'BODY (HARDWARE) ⚙️', activeBg: '#F3F4F6', borderColor: '#6B7280' }
      ],
      items: [
        { id: 'chip1', icon: 'Cpu',    type: 'software', color: '#DBEAFE', iconColor: '#2563EB' },
        { id: 'code',  icon: 'Code',   type: 'software', color: '#BFDBFE', iconColor: '#1D4ED8' },
        { id: 'wheel', icon: 'CircleDot', type: 'hardware', color: '#F3F4F6', iconColor: '#4B5563' },
        { id: 'arm',   icon: 'Wrench', type: 'hardware', color: '#E5E7EB', iconColor: '#6B7280' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'Wake up the Bot',
      scenario: 'The robot is sleeping. Say an activation phrase like "Power On" to boot up the system!',
      botName: 'SleepyBot', botAvatar: 'Bot', botColor: '#0EA5E9',
      prompts: [
        "Zzz... I'm powered down. What should you say to wake me up?",
        "Booting up... systems online! What next?",
        "I'm fully awake now — thanks for powering me on!"
      ],
      keywords: ['power on', 'wake up', 'start', 'activate']
    },
    logic: {
      type: 'order',
      title: 'Assembly Line',
      instruction: 'Connect the components in the right order to make the robot move! ⚡',
      hint: 'Battery ➔ Motor ➔ Wheels ➔ Action',
      targetOrder: ['battery', 'motor', 'wheels', 'action'],
      blocks: [
        { id: 'motor',  icon: 'Cog',    color: '#0EA5E9', bg: '#BAE6FD' },
        { id: 'battery',icon: 'BatteryFull', color: '#16A34A', bg: '#BBF7D0' },
        { id: 'wheels', icon: 'CircleDot', color: '#6B7280', bg: '#E5E7EB' },
        { id: 'action', icon: 'Zap',    color: '#D97706', bg: '#FDE68A' }
      ]
    }
  },

  "zone-14": {
    label: 'Self-Driving Cars', color: '#EC4899', glow: 'rgba(236,72,153,0.22)',
    visual: {
      type: 'find',
      title: 'Stop Sign Scanner 🛑',
      instruction: 'Tap all the stop signs and traffic lights so the car learns when to brake!',
      grid: [
        { id: 's1', icon: 'OctagonAlert', color: '#EC4899', isTarget: true },
        { id: 's2', icon: 'TreePine', color: '#EC4899', isTarget: false },
        { id: 's3', icon: 'TrafficCone', color: '#EC4899', isTarget: true },
        { id: 's4', icon: 'Cloud', color: '#EC4899', isTarget: false }
      ],
      targetCount: 2
    },
    story: {
      mode: 'voice',
      title: 'Voice Navigator',
      scenario: 'The car approaches a blocked road. Say "Turn Left" or "Reverse" to guide it safely.',
      botName: 'DriveBot', botAvatar: 'Car', botColor: '#EC4899',
      prompts: [
        "There's a roadblock ahead! What should I do?",
        "Good call! Now the path looks clear — should we keep going?",
        "We made it around safely. Great navigating!"
      ],
      keywords: ['turn left', 'turn right', 'reverse', 'stop']
    },
    logic: {
      type: 'select',
      title: 'Pathfinding',
      instruction: 'Choose the safest route for the car on the grid, avoiding pedestrians and roadblocks.',
      items: [
        { id: 'route_a', label: 'Straight through the crossing' },
        { id: 'route_b', label: 'Around, past the empty lot' },
        { id: 'route_c', label: 'Through the roadblock' }
      ],
      requiredCount: 1,
      correctIds: ['route_b']
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 8: SPACE & BEYOND (THE ULTIMATE AI CAPSTONE)
  // ══════════════════════════════════════════════════════════════════════

  "zone-15": {
    label: 'Space Rovers', color: '#10B981', glow: 'rgba(16,185,129,0.22)',
    visual: {
      type: 'sort',
      title: 'Mars Rock Sorter 🪐',
      instruction: 'Use the camera to classify Safe Rocks versus Unknown Elements!',
      bins: [
        { id: 'safe',    label: 'SAFE ROCKS ✅', activeBg: '#DCFCE7', borderColor: '#16A34A' },
        { id: 'unknown', label: 'UNKNOWN ⚠️',   activeBg: '#FEF3C7', borderColor: '#D97706' }
      ],
      items: [
        { id: 'rock1', icon: 'Mountain', type: 'safe',    color: '#DCFCE7', iconColor: '#16A34A' },
        { id: 'rock2', icon: 'Gem',      type: 'unknown', color: '#FEF3C7', iconColor: '#D97706' },
        { id: 'rock3', icon: 'Mountain', type: 'safe',    color: '#D1FAE5', iconColor: '#059669' },
        { id: 'rock4', icon: 'Sparkles', type: 'unknown', color: '#FDE68A', iconColor: '#B45309' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'Alien Signal',
      scenario: 'The rover receives a scrambled audio signal. Repeat the pattern into the mic to decode it!',
      botName: 'RoverBot', botAvatar: 'Satellite', botColor: '#10B981',
      prompts: [
        "Beep... boop... beep! Can you repeat that pattern back to me?",
        "Almost decoded! One more time?",
        "Message decoded! Great job, Space Explorer!"
      ],
      keywords: ['beep', 'boop', 'pattern', 'signal', 'repeat']
    },
    logic: {
      type: 'condition',
      title: 'Energy Logic',
      instruction: 'Build the survival rule for the rover\'s battery!',
      hint: 'If Battery < 20% ➔ Go to Solar Station, Else ➔ Continue Exploring.',
      rules: [
        { id: 'r1', ifLabel: 'Battery < 20%', ifIcon: 'BatteryLow', thenLabel: 'Go to Solar Station', thenIcon: 'Sun' },
        { id: 'r2', ifLabel: 'Battery ≥ 20%', ifIcon: 'BatteryFull', thenLabel: 'Continue Exploring', thenIcon: 'Compass' }
      ]
    }
  },

  "zone-16": {
    label: 'The AI Master', color: '#06B6D4', glow: 'rgba(6,182,212,0.22)',
    visual: {
      type: 'select',
      title: 'The Ultimate Creator 🏆',
      instruction: 'Select a setting, a character, and an object — Generative AI creates your certificate!',
      items: [
        { id: 'setting_space', icon: 'Rocket', label: 'Space Setting' },
        { id: 'setting_forest', icon: 'TreePine', label: 'Forest Setting' },
        { id: 'char_robot', icon: 'Bot', label: 'Robot Character' },
        { id: 'char_hero', icon: 'Shield', label: 'Hero Character' },
        { id: 'obj_trophy', icon: 'Trophy', label: 'Trophy Object' },
        { id: 'obj_star', icon: 'Star', label: 'Star Object' }
      ],
      requiredCount: 3
    },
    story: {
      mode: 'choice',
      title: 'Trivia Co-Pilot',
      scenario: 'The spaceship AI asks three quick review questions before launch!',
      botName: 'LaunchBot', botAvatar: 'Rocket', botColor: '#06B6D4',
      rounds: [
        { prompt: "What powers an AI's brain?", options: [{ id: 'a', label: 'Data', correct: true }, { id: 'b', label: 'Magic', correct: false }] },
        { prompt: "What do we call teaching AI with examples?", options: [{ id: 'a', label: 'Training', correct: true }, { id: 'b', label: 'Sleeping', correct: false }] },
        { prompt: "What should you do if a bot asks for your address?", options: [{ id: 'a', label: 'Refuse & tell an adult', correct: true }, { id: 'b', label: 'Give it right away', correct: false }] }
      ]
    },
    logic: {
      type: 'order',
      title: 'Fix the System (RAG)',
      instruction: 'Reconnect the broken data pipeline!',
      hint: 'User Question ➔ Database ➔ AI Brain ➔ Final Answer',
      targetOrder: ['question', 'database', 'brain', 'answer'],
      blocks: [
        { id: 'brain',    icon: 'Brain',      color: '#EC4899', bg: '#FBCFE8' },
        { id: 'question', icon: 'HelpCircle', color: '#3B82F6', bg: '#93C5FD' },
        { id: 'answer',   icon: 'CheckCircle',color: '#10B981', bg: '#6EE7B7' },
        { id: 'database', icon: 'Database',   color: '#8B5CF6', bg: '#C4B5FD' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 9: AI FOR THE PLANET (ECO-BOTS)
  // ══════════════════════════════════════════════════════════════════════

  "zone-17": {
    label: 'Ocean Clean-Up', color: '#F59E0B', glow: 'rgba(245,158,11,0.22)',
    visual: {
      type: 'sort',
      title: 'Trash vs. Treasure 🌊',
      instruction: 'Drag plastic bottles into the recycle bin so the fish can swim safely!',
      bins: [
        { id: 'recycle', label: 'RECYCLE ♻️', activeBg: '#DBEAFE', borderColor: '#2563EB' },
        { id: 'ocean',    label: 'OCEAN 🐟',   activeBg: '#DCFCE7', borderColor: '#16A34A' }
      ],
      items: [
        { id: 'bottle1', icon: 'Trash2', type: 'recycle', color: '#DBEAFE', iconColor: '#2563EB' },
        { id: 'fish1',   icon: 'Fish',   type: 'ocean',    color: '#DCFCE7', iconColor: '#16A34A' },
        { id: 'bottle2', icon: 'Trash2', type: 'recycle', color: '#BFDBFE', iconColor: '#1D4ED8' },
        { id: 'fish2',   icon: 'Fish',   type: 'ocean',    color: '#D1FAE5', iconColor: '#059669' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'The Sea Turtle',
      scenario: 'A turtle asks for help navigating polluted waters. Command "Scan the water" to activate AI sonar!',
      botName: 'TurtleBot', botAvatar: 'Fish', botColor: '#F59E0B',
      prompts: [
        "Help! I can't see through this murky water. What should I do?",
        "Scanning... I can see clearer now! Which way should I swim?",
        "Thank you! I made it safely through!"
      ],
      keywords: ['scan', 'water', 'help', 'sonar']
    },
    logic: {
      type: 'order',
      title: 'Clean-Up Algorithm',
      instruction: 'Arrange the steps to program the cleanup bot!',
      hint: 'Scan Area ➔ Detect Plastic ➔ Scoop ➔ Empty Bin',
      targetOrder: ['scan', 'detect', 'scoop', 'empty'],
      blocks: [
        { id: 'detect', icon: 'ScanSearch', color: '#D97706', bg: '#FDE68A' },
        { id: 'scan',   icon: 'Radar',      color: '#2563EB', bg: '#BFDBFE' },
        { id: 'empty',  icon: 'Trash2',     color: '#16A34A', bg: '#BBF7D0' },
        { id: 'scoop',  icon: 'Shovel',     color: '#7C3AED', bg: '#DDD6FE' }
      ]
    }
  },

  "zone-18": {
    label: 'Forest Guardian', color: '#EF4444', glow: 'rgba(239,68,68,0.22)',
    visual: {
      type: 'find',
      title: 'Smoke Detector 🔥',
      instruction: 'Find the tiny grey smoke pixels hidden in the dense green forest!',
      grid: [
        { id: 'tree1', icon: 'TreePine', color: '#16A34A', isTarget: false },
        { id: 'smoke1', icon: 'CloudFog', color: '#9CA3AF', isTarget: true },
        { id: 'tree2', icon: 'TreePine', color: '#16A34A', isTarget: false },
        { id: 'tree3', icon: 'TreePine', color: '#16A34A', isTarget: false }
      ],
      targetCount: 1
    },
    story: {
      mode: 'choice',
      title: 'Sound Sorter',
      scenario: 'The system plays an audio clip — is it an Animal or a Bulldozer?',
      botName: 'ForestBot', botAvatar: 'TreePine', botColor: '#EF4444',
      rounds: [
        { prompt: "🔊 *rustling leaves and a soft growl* — What was that sound?", options: [{ id: 'a', label: '🐾 Animal', correct: true }, { id: 'b', label: '🚜 Bulldozer', correct: false }] },
        { prompt: "🔊 *heavy engine and crunching* — And that one?", options: [{ id: 'a', label: '🐾 Animal', correct: false }, { id: 'b', label: '🚜 Bulldozer', correct: true }] }
      ]
    },
    logic: {
      type: 'condition',
      title: 'Emergency Logic',
      instruction: 'Build the conditional flow for the forest sensors!',
      hint: 'If Smoke = True ➔ Alert Firefighter Bot. If Animal = True ➔ Do Nothing.',
      rules: [
        { id: 'r1', ifLabel: 'Smoke = True',  ifIcon: 'Flame', thenLabel: 'Alert Firefighter Bot', thenIcon: 'Siren' },
        { id: 'r2', ifLabel: 'Animal = True', ifIcon: 'PawPrint', thenLabel: 'Do Nothing', thenIcon: 'Ban' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 10: THE QUANTUM FUTURE (SUPER AI)
  // ══════════════════════════════════════════════════════════════════════

  "zone-19": {
    label: 'Speed of AI', color: '#6366F1', glow: 'rgba(99,102,241,0.22)',
    visual: {
      type: 'sort',
      title: 'The Great Race 🐢🚀',
      instruction: 'Match single-task computers (Turtles) and multi-task Quantum AI (Rockets)!',
      bins: [
        { id: 'turtle', label: 'SINGLE TASK 🐢', activeBg: '#F3F4F6', borderColor: '#6B7280' },
        { id: 'rocket', label: 'MULTI TASK 🚀',  activeBg: '#E0E7FF', borderColor: '#4F46E5' }
      ],
      items: [
        { id: 'calc1', icon: 'Calculator', type: 'turtle', color: '#F3F4F6', iconColor: '#4B5563' },
        { id: 'quantum1', icon: 'Atom', type: 'rocket', color: '#E0E7FF', iconColor: '#4F46E5' },
        { id: 'calc2', icon: 'Clock', type: 'turtle', color: '#E5E7EB', iconColor: '#6B7280' },
        { id: 'quantum2', icon: 'Rocket', type: 'rocket', color: '#DDD6FE', iconColor: '#6D28D9' }
      ]
    },
    story: {
      mode: 'voice',
      title: 'Turbo Boost',
      scenario: 'The AI is calculating a huge math problem and slowing down. Shout "Turbo Boost!" into the mic!',
      botName: 'SpeedBot', botAvatar: 'Gauge', botColor: '#6366F1',
      prompts: [
        "This problem is HUGE and I'm slowing down... help me speed up!",
        "More power, more power! Say it again!",
        "Turbo engaged! Problem solved in record time!"
      ],
      keywords: ['turbo boost', 'faster', 'speed up', 'go']
    },
    logic: {
      type: 'match',
      title: 'Data Routing',
      instruction: 'Connect each colored data stream to its processor — without crossing wires!',
      hint: 'Three streams, three processors, all at once.',
      pairs: [
        { id: 'p1', leftIcon: 'Zap', leftLabel: 'Red Stream',   rightIcon: 'Cpu', rightLabel: 'Processor A' },
        { id: 'p2', leftIcon: 'Zap', leftLabel: 'Blue Stream',  rightIcon: 'Cpu', rightLabel: 'Processor B' },
        { id: 'p3', leftIcon: 'Zap', leftLabel: 'Green Stream', rightIcon: 'Cpu', rightLabel: 'Processor C' }
      ]
    }
  },

  "zone-20": {
    label: 'AI Companions', color: '#14B8A6', glow: 'rgba(20,184,166,0.22)',
    visual: {
      type: 'select',
      title: 'Avatar Builder 🧸',
      instruction: 'Select modular parts to design your own friendly AI companion avatar!',
      items: [
        { id: 'head_round', icon: 'Circle', label: 'Round Head' },
        { id: 'head_square', icon: 'Square', label: 'Square Head' },
        { id: 'body_blue', icon: 'Bot', label: 'Blue Body' },
        { id: 'accessory_hat', icon: 'Crown', label: 'Hat Accessory' },
        { id: 'accessory_glasses', icon: 'Glasses', label: 'Glasses Accessory' }
      ],
      requiredCount: 3
    },
    story: {
      mode: 'voice',
      title: 'Daily Check-In',
      scenario: 'The AI asks, "What new thing did we learn today?" Record a voice note!',
      botName: 'BuddyBot', botAvatar: 'Smile', botColor: '#14B8A6',
      prompts: [
        "Hey friend! What new thing did we learn today?",
        "That's so cool! What was your favorite zone?",
        "Thanks for sharing! I'm getting smarter every day, just like you!"
      ],
      keywords: ['learned', 'today', 'zone', 'favorite']
    },
    logic: {
      type: 'order',
      title: 'The Memory Loop (RAG)',
      instruction: 'Connect the learning cycle in the right order!',
      hint: 'Action ➔ Feedback ➔ Save to Memory ➔ Get Smarter',
      targetOrder: ['action', 'feedback', 'memory', 'smarter'],
      blocks: [
        { id: 'feedback', icon: 'MessageCircle', color: '#0EA5E9', bg: '#BAE6FD' },
        { id: 'action',   icon: 'Play',          color: '#D97706', bg: '#FDE68A' },
        { id: 'smarter',  icon: 'TrendingUp',    color: '#16A34A', bg: '#BBF7D0' },
        { id: 'memory',   icon: 'Save',          color: '#7C3AED', bg: '#DDD6FE' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 11: DIGITAL DEFENDERS (CYBER SECURITY & AI)
  // ══════════════════════════════════════════════════════════════════════

  "zone-21": {
    label: 'Deepfake Detective', color: '#3B82F6', glow: 'rgba(59,130,246,0.22)',
    visual: {
      type: 'find',
      title: 'Spot the Glitch 🕵️',
      instruction: 'Two pictures — one real, one AI-generated. Tap the fake one (weird fingers or text)!',
      grid: [
        { id: 'real', icon: 'ImageIcon', color: '#3B82F6', isTarget: false },
        { id: 'fake', icon: 'ImageOff', color: '#3B82F6', isTarget: true }
      ],
      targetCount: 1
    },
    story: {
      mode: 'choice',
      title: 'Voice Clone Alert',
      scenario: 'An unknown number says: "I\'m calling from the bank, give me your code."',
      botName: 'ScamBot', botAvatar: 'PhoneOff', botColor: '#3B82F6',
      rounds: [
        {
          prompt: '📞 "Hi, I\'m calling from the bank. Please give me your code."',
          options: [
            { id: 'a', label: '🚫 Fake Call! Block it!', correct: true },
            { id: 'b', label: 'Sure, here is my code', correct: false }
          ]
        }
      ]
    },
    logic: {
      type: 'condition',
      title: 'Truth Verification',
      instruction: 'Build the rule for handling messages!',
      hint: 'If Source == Trusted ➔ Accept. If Source == Unknown ➔ Alert.',
      rules: [
        { id: 'r1', ifLabel: 'Source = Trusted', ifIcon: 'ShieldCheck', thenLabel: 'Accept', thenIcon: 'Check' },
        { id: 'r2', ifLabel: 'Source = Unknown', ifIcon: 'ShieldAlert', thenLabel: 'Alert', thenIcon: 'AlertTriangle' }
      ]
    }
  },

  "zone-22": {
    label: 'Data Protectors', color: '#8B5CF6', glow: 'rgba(139,92,246,0.22)',
    visual: {
      type: 'sort',
      title: 'Password Sorter 🔐',
      instruction: 'Weak passwords go in the Trash, strong passwords go in the Vault!',
      bins: [
        { id: 'trash', label: 'TRASH 🗑️', activeBg: '#FEE2E2', borderColor: '#DC2626' },
        { id: 'vault', label: 'VAULT 🔒', activeBg: '#F5F3FF', borderColor: '#7C3AED' }
      ],
      items: [
        { id: 'pw1', icon: 'KeyRound', type: 'trash', color: '#FEE2E2', iconColor: '#DC2626', label: '1234' },
        { id: 'pw2', icon: 'ShieldCheck', type: 'vault', color: '#F5F3FF', iconColor: '#7C3AED', label: 'Cat@99#' },
        { id: 'pw3', icon: 'KeyRound', type: 'trash', color: '#FECACA', iconColor: '#B91C1C', label: 'password' },
        { id: 'pw4', icon: 'ShieldCheck', type: 'vault', color: '#EDE9FE', iconColor: '#6D28D9', label: 'Sun$hine7!' }
      ]
    },
    story: {
      mode: 'choice',
      title: 'Phishing Trap',
      scenario: 'A pop-up says: "You won a prize! Give me your address."',
      botName: 'PopupBot', botAvatar: 'Gift', botColor: '#8B5CF6',
      rounds: [
        {
          prompt: '🎁 "You won a prize! Just give me your home address to claim it!"',
          options: [
            { id: 'a', label: 'I will ask my parents first', correct: true },
            { id: 'b', label: 'Here is my address!', correct: false }
          ]
        }
      ]
    },
    logic: {
      type: 'condition',
      title: 'Two-Factor Logic (2FA)',
      instruction: 'Connect the locks — a password alone is not enough!',
      hint: 'Password Block + Secret Code Block ➔ Open Door',
      rules: [
        { id: 'r1', ifLabel: 'Password Only', ifIcon: 'KeyRound', thenLabel: 'Access Denied', thenIcon: 'Lock' },
        { id: 'r2', ifLabel: 'Password + Code', ifIcon: 'ShieldCheck', thenLabel: 'Open Door', thenIcon: 'DoorOpen' }
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 12: FUTURE FARMERS & SMART HEALTH (AI IN PAKISTAN)
  // ══════════════════════════════════════════════════════════════════════

  "zone-23": {
    label: 'Agri-Bots', color: '#0EA5E9', glow: 'rgba(14,165,233,0.22)',
    visual: {
      type: 'find',
      title: 'Drone Crop Scanner 🌾',
      instruction: 'Tap only the yellow (sick) plants so the drone knows where to spray!',
      grid: [
        { id: 'plant1', icon: 'Sprout', color: '#16A34A', isTarget: false },
        { id: 'plant2', icon: 'Sprout', color: '#CA8A04', isTarget: true },
        { id: 'plant3', icon: 'Sprout', color: '#16A34A', isTarget: false },
        { id: 'plant4', icon: 'Sprout', color: '#CA8A04', isTarget: true }
      ],
      targetCount: 2
    },
    story: {
      mode: 'choice',
      title: 'Weather Bot',
      scenario: 'The bot says: "Dark clouds are in the sky — should I water the plants?"',
      botName: 'WeatherBot', botAvatar: 'CloudRain', botColor: '#0EA5E9',
      rounds: [
        {
          prompt: '"Aasman par kalay badal hain, kya main plants ko paani doon?" (Should I water the plants?)',
          options: [
            { id: 'a', label: 'Nahi, barish hone wali hai (No, it will rain)', correct: true },
            { id: 'b', label: 'Haan, abhi paani do (Yes, water now)', correct: false }
          ]
        }
      ]
    },
    logic: {
      type: 'condition',
      title: 'Soil Moisture Logic',
      instruction: 'Build the farm logic!',
      hint: 'If Moisture < 30% ➔ Turn on Pump, Else ➔ Save Water.',
      rules: [
        { id: 'r1', ifLabel: 'Moisture < 30%', ifIcon: 'Droplet', thenLabel: 'Turn on Pump', thenIcon: 'Power' },
        { id: 'r2', ifLabel: 'Moisture ≥ 30%', ifIcon: 'Droplets', thenLabel: 'Save Water', thenIcon: 'Leaf' }
      ]
    }
  },

  "zone-24": {
    label: 'AI Veterinarian', color: '#EC4899', glow: 'rgba(236,72,153,0.22)',
    visual: {
      type: 'select',
      title: 'Animal Mood Scanner 🐄',
      instruction: 'Upload the cow\'s picture — is she healthy or sick?',
      items: [
        { id: 'healthy', icon: 'HeartPulse', label: 'Healthy' },
        { id: 'sick', icon: 'ThermometerSun', label: 'Sick' }
      ],
      requiredCount: 1,
      correctIds: ['sick']
    },
    story: {
      mode: 'voice',
      title: 'Symptom Checker',
      scenario: 'Speak into the mic: "Miri cat khana nahi kha rahi" (My cat isn\'t eating).',
      botName: 'VetBot', botAvatar: 'PawPrint', botColor: '#EC4899',
      prompts: [
        "Hi! What's going on with your pet today?",
        "I see — let me check our health database for that.",
        "Based on that, I recommend: Take to the Vet."
      ],
      keywords: ['sick', 'not eating', 'vet', 'help', 'cat', 'dog']
    },
    logic: {
      type: 'order',
      title: 'Diagnosis Pipeline (RAG)',
      instruction: 'Match the flow to help the sick animal!',
      hint: 'Sick Animal ➔ Search Health Database ➔ Get Medicine Name ➔ Cure',
      targetOrder: ['animal', 'database', 'medicine', 'cure'],
      blocks: [
        { id: 'database', icon: 'Database',  color: '#8B5CF6', bg: '#DDD6FE' },
        { id: 'animal',   icon: 'PawPrint',  color: '#EC4899', bg: '#FBCFE8' },
        { id: 'cure',     icon: 'CheckCircle', color: '#16A34A', bg: '#BBF7D0' },
        { id: 'medicine', icon: 'Pill',      color: '#D97706', bg: '#FDE68A' }
      ]
    }
  }
};

// ────────────────────────────────────────────────────────────────────────
// 24-ZONE MASTER MAP (For Kids Dashboard Layout) — unchanged, matches roadmap
// ────────────────────────────────────────────────────────────────────────

export const ZONES_LIST = [
  { id: 'zone-1', order: 1, label: 'Smart vs. Basic', sublabel: 'AI Basics', color: '#3B82F6', glow: 'rgba(59,130,246,0.28)', side: 'left' },
  { id: 'zone-2', order: 2, label: 'Data Detectives', sublabel: 'The Fuel of AI', color: '#8B5CF6', glow: 'rgba(139,92,246,0.28)', side: 'right' },
  { id: 'zone-3', order: 3, label: 'Algorithm Logic', sublabel: 'Step-by-Step', color: '#0EA5E9', glow: 'rgba(14,165,233,0.28)', side: 'left' },
  { id: 'zone-4', order: 4, label: 'Model Training',  sublabel: 'Teaching AI', color: '#EC4899', glow: 'rgba(236,72,153,0.28)', side: 'right' },
  { id: 'zone-5', order: 5, label: 'Computer Vision', sublabel: 'How AI Sees', color: '#10B981', glow: 'rgba(16,185,129,0.28)', side: 'left' },
  { id: 'zone-6', order: 6, label: 'Talking Bots',    sublabel: 'NLP & Voice', color: '#06B6D4', glow: 'rgba(6,182,212,0.28)', side: 'right' },
  { id: 'zone-7', order: 7, label: 'Creative Studio', sublabel: 'Generative AI', color: '#F59E0B', glow: 'rgba(245,158,11,0.28)', side: 'left' },
  { id: 'zone-8', order: 8, label: 'Hero Rules',      sublabel: 'AI Safety & Bias', color: '#EF4444', glow: 'rgba(239,68,68,0.28)', side: 'right' },
  { id: 'zone-9', order: 9, label: 'Smart Cities',    sublabel: 'Automation', color: '#6366F1', glow: 'rgba(99,102,241,0.28)', side: 'left' },
  { id: 'zone-10',order: 10,label: 'Health Bots',     sublabel: 'AI in Medicine', color: '#14B8A6', glow: 'rgba(20,184,166,0.28)', side: 'right' },
  { id: 'zone-11',order: 11,label: 'The Cloud',       sublabel: 'Data Storage', color: '#3B82F6', glow: 'rgba(59,130,246,0.28)', side: 'left' },
  { id: 'zone-12',order: 12,label: 'Human + AI',      sublabel: 'Collaboration', color: '#8B5CF6', glow: 'rgba(139,92,246,0.28)', side: 'right' },
  { id: 'zone-13',order: 13,label: 'Robot Anatomy',   sublabel: 'Hardware vs Software', color: '#0EA5E9', glow: 'rgba(14,165,233,0.28)', side: 'left' },
  { id: 'zone-14',order: 14,label: 'Self-Driving',    sublabel: 'Autonomous Systems', color: '#EC4899', glow: 'rgba(236,72,153,0.28)', side: 'right' },
  { id: 'zone-15',order: 15,label: 'Space Rovers',    sublabel: 'Remote AI', color: '#10B981', glow: 'rgba(16,185,129,0.28)', side: 'left' },
  { id: 'zone-16',order: 16,label: 'The AI Master',   sublabel: 'Final Challenge', color: '#06B6D4', glow: 'rgba(6,182,212,0.28)', side: 'right' },
  { id: 'zone-17',order: 17,label: 'Ocean Clean-Up',  sublabel: 'AI Sorting', color: '#F59E0B', glow: 'rgba(245,158,11,0.28)', side: 'left' },
  { id: 'zone-18',order: 18,label: 'Forest Guardian', sublabel: 'Audio/Visual Sensors', color: '#EF4444', glow: 'rgba(239,68,68,0.28)', side: 'right' },
  { id: 'zone-19',order: 19,label: 'Speed of AI',     sublabel: 'Parallel Processing', color: '#6366F1', glow: 'rgba(99,102,241,0.28)', side: 'left' },
  { id: 'zone-20',order: 20,label: 'AI Companions',   sublabel: 'Continuous Learning', color: '#14B8A6', glow: 'rgba(20,184,166,0.28)', side: 'right' },
  { id: 'zone-21',order: 21,label: 'Deepfake Check',  sublabel: 'Real vs AI', color: '#3B82F6', glow: 'rgba(59,130,246,0.28)', side: 'left' },
  { id: 'zone-22',order: 22,label: 'Data Protectors', sublabel: 'Passwords & Privacy', color: '#8B5CF6', glow: 'rgba(139,92,246,0.28)', side: 'right' },
  { id: 'zone-23',order: 23,label: 'Agri-Bots',       sublabel: 'Smart Farming', color: '#0EA5E9', glow: 'rgba(14,165,233,0.28)', side: 'left' },
  { id: 'zone-24',order: 24,label: 'AI Veterinarian', sublabel: 'Animal Health', color: '#EC4899', glow: 'rgba(236,72,153,0.28)', side: 'right' },
];

export const zoneComplete  = (id, done) => TASK_TYPES.every(t => done.includes(`${id}_${t.id}`));
export const zoneUnlocked  = (zone, done) => {
  if (zone.order === 1) return true;
  const prev = ZONES_LIST.find(z => z.order === zone.order - 1);
  return zoneComplete(prev.id, done);
};