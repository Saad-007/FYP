/**
 * KidsMissionPage.jsx
 * Route: /kids/mission/:zoneId/:taskType  (visual | story | logic)
 *
 * Curriculum-aligned 3-task mission flow for Edu AI-Quest Kids Mode.
 * Each zone has unique content for all 3 task types.
 *
 * Dependencies (already in your stack):
 *   framer-motion, lucide-react, react-router-dom
 *   supabase client at ../../lib/supabase
 *
 * Optional (degrade gracefully if missing):
 *   Web Speech API  — used for Story Task voice recognition (browser-native, no package needed)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  ArrowLeft, Star, CheckCircle2, Mic, MicOff, Volume2,
  ChevronRight, RefreshCw, Trophy, Zap, X, Sparkles,
  Brain, Eye, MessageSquare, Palette, Shield, Layers,
  GripVertical, RotateCcw, Play, Pause, Send
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 1.  ZONE CURRICULUM DATA
// ─────────────────────────────────────────────────────────────────────────────
const ZONE_DATA = {
  what_is_ai: {
    label: 'AI Explorer',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.25)',
    icon: Brain,
    badge: '🤖',
    visual: {
      title: 'Sort Smart vs Dumb!',
      instruction: 'Drag each card into the correct bucket — does it use AI (learns from data) or just follow fixed rules?',
      items: [
        { id: 'c1', label: 'Calculator adds numbers',       category: 'rule',  emoji: '🔢' },
        { id: 'c2', label: 'Spam filter learns from emails', category: 'ai',    emoji: '📧' },
        { id: 'c3', label: 'Traffic light timer',           category: 'rule',  emoji: '🚦' },
        { id: 'c4', label: 'Face recognition unlock',       category: 'ai',    emoji: '📱' },
        { id: 'c5', label: 'Voice assistant understands you', category: 'ai',  emoji: '🎙️' },
        { id: 'c6', label: 'Alarm rings at 7am',            category: 'rule',  emoji: '⏰' },
      ],
      buckets: [
        { id: 'ai',   label: 'Uses AI 🧠', color: '#3B82F6', hint: 'Learns from data' },
        { id: 'rule', label: 'Fixed Rules ⚙️', color: '#8B5CF6', hint: 'Always does the same thing' },
      ],
    },
    story: {
      title: 'Meet ARIA — Your AI Friend!',
      scenario: 'You just turned on a brand-new robot named ARIA. She doesn\'t know what AI is yet! Explain it to her in your own words.',
      botName: 'ARIA',
      botAvatar: '🤖',
      botColor: '#3B82F6',
      prompts: [
        'Hi! I just woke up. What am I exactly?',
        'How am I different from a regular computer program?',
        'Can you give me an example of AI in real life?',
      ],
      successKeywords: ['learn', 'data', 'train', 'smart', 'predict', 'pattern', 'example', 'improve'],
    },
    logic: {
      title: 'Fix the AI Decision Tree!',
      instruction: 'Rearrange these steps so the AI can correctly decide if an email is spam. Drag the blocks into the right order.',
      steps: [
        { id: 's1', correct: 0, label: '📨 Receive new email',         color: '#E0F2FE' },
        { id: 's2', correct: 1, label: '🔍 Scan for spam keywords',    color: '#DBEAFE' },
        { id: 's3', correct: 2, label: '📊 Check sender reputation',   color: '#EDE9FE' },
        { id: 's4', correct: 3, label: '🤖 AI predicts: spam or not?', color: '#FCE7F3' },
        { id: 's5', correct: 4, label: '📁 Move to spam / inbox',      color: '#D1FAE5' },
      ],
    },
  },

  robots: {
    label: 'Data Detectives',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.25)',
    icon: Layers,
    badge: '🔍',
    visual: {
      title: 'Train the Pattern Bot!',
      instruction: 'The bot is learning! Drag the correct label onto each data point so the AI can learn the pattern.',
      items: [
        { id: 'p1', label: '🌡️ Temp: 38°C, Cough: Yes', category: 'sick',    emoji: '🤒' },
        { id: 'p2', label: '🌡️ Temp: 36°C, Cough: No',  category: 'healthy', emoji: '😊' },
        { id: 'p3', label: '🌡️ Temp: 39°C, Cough: Yes', category: 'sick',    emoji: '🤒' },
        { id: 'p4', label: '🌡️ Temp: 36.5°C, Cough: No', category: 'healthy',emoji: '😊' },
        { id: 'p5', label: '🌡️ Temp: 37°C, Cough: Yes', category: 'sick',    emoji: '🤒' },
        { id: 'p6', label: '🌡️ Temp: 36.2°C, Cough: No', category: 'healthy',emoji: '😊' },
      ],
      buckets: [
        { id: 'sick',    label: '🤒 Sick Patient',    color: '#EF4444', hint: 'High temp + cough' },
        { id: 'healthy', label: '😊 Healthy Patient', color: '#10B981', hint: 'Normal temp, no cough' },
      ],
    },
    story: {
      title: 'Detective Bot Needs Clues!',
      scenario: 'You\'re a Data Detective! Detective Bot found 1000 cat photos and 1000 dog photos. Explain how it should use this data to learn the difference.',
      botName: 'Detective Bot',
      botAvatar: '🕵️',
      botColor: '#8B5CF6',
      prompts: [
        'I have tons of photos. What should I do with them to learn?',
        'What\'s a "label" and why do I need it?',
        'How do I know if I\'ve learned correctly?',
      ],
      successKeywords: ['label', 'train', 'pattern', 'feature', 'accuracy', 'test', 'data', 'correct', 'example'],
    },
    logic: {
      title: 'Build the Data Pipeline!',
      instruction: 'Put these data science steps in the right order so the AI can make accurate predictions.',
      steps: [
        { id: 's1', correct: 0, label: '📦 Collect raw data',           color: '#EDE9FE' },
        { id: 's2', correct: 1, label: '🧹 Clean & remove bad data',    color: '#F3E8FF' },
        { id: 's3', correct: 2, label: '🏷️ Label the data',              color: '#E0F2FE' },
        { id: 's4', correct: 3, label: '🤖 Train the AI model',          color: '#FCE7F3' },
        { id: 's5', correct: 4, label: '✅ Test & measure accuracy',     color: '#D1FAE5' },
      ],
    },
  },

  coding_basics: {
    label: 'Algorithm Logic',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.25)',
    icon: Layers,
    badge: '⚡',
    visual: {
      title: 'Fix the Robot\'s Program!',
      instruction: 'This robot should water the plant every morning. Drag the logic blocks to fix the broken algorithm!',
      items: [
        { id: 'b1', label: 'Water the plant 💧',       category: 'correct', emoji: '✅' },
        { id: 'b2', label: 'Check if morning ☀️',      category: 'correct', emoji: '✅' },
        { id: 'b3', label: 'Take a selfie 🤳',         category: 'wrong',   emoji: '❌' },
        { id: 'b4', label: 'If morning → water plant', category: 'correct', emoji: '✅' },
        { id: 'b5', label: 'Start dancing 💃',         category: 'wrong',   emoji: '❌' },
        { id: 'b6', label: 'Repeat every 24hrs ⏰',    category: 'correct', emoji: '✅' },
      ],
      buckets: [
        { id: 'correct', label: '✅ Keep in Program', color: '#0EA5E9', hint: 'Part of the algorithm' },
        { id: 'wrong',   label: '❌ Remove It!',      color: '#EF4444', hint: 'Not needed' },
      ],
    },
    story: {
      title: 'Teach the Logic Bot!',
      scenario: 'Logic Bot is learning about IF-THEN rules. Give it an example of an IF-THEN rule from real life to help it understand.',
      botName: 'Logic Bot',
      botAvatar: '⚡',
      botColor: '#0EA5E9',
      prompts: [
        'What is an IF-THEN statement? I don\'t get it!',
        'Give me a real-life example using IF-THEN.',
        'What happens when the condition is false?',
      ],
      successKeywords: ['if', 'then', 'else', 'condition', 'true', 'false', 'rule', 'when', 'example'],
    },
    logic: {
      title: 'Sort the Algorithm Steps!',
      instruction: 'A self-driving car needs to stop safely. Put these algorithm steps in the correct order!',
      steps: [
        { id: 's1', correct: 0, label: '👁️ Detect obstacle ahead',       color: '#E0F2FE' },
        { id: 's2', correct: 1, label: '📏 Calculate stopping distance', color: '#DBEAFE' },
        { id: 's3', correct: 2, label: '⚖️ Decide: brake or swerve?',   color: '#EDE9FE' },
        { id: 's4', correct: 3, label: '🛑 Apply brakes gradually',      color: '#FCE7F3' },
        { id: 's5', correct: 4, label: '✅ Car stops safely',             color: '#D1FAE5' },
      ],
    },
  },

  pattern_puzzles: {
    label: 'Machine Learning',
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.25)',
    icon: Brain,
    badge: '🧠',
    visual: {
      title: 'Supervised Learning Lab!',
      instruction: 'The ML model saw these fruits during training. Match each fruit to its correct learned label!',
      items: [
        { id: 'f1', label: '🔴 Round, Red, Sweet',    category: 'apple',  emoji: '🍎' },
        { id: 'f2', label: '🟡 Long, Yellow, Curved', category: 'banana', emoji: '🍌' },
        { id: 'f3', label: '🟠 Round, Orange, Juicy', category: 'orange', emoji: '🍊' },
        { id: 'f4', label: '🔴 Small, Red, Tart',     category: 'apple',  emoji: '🍎' },
        { id: 'f5', label: '🟡 Short, Yellow, Soft',  category: 'banana', emoji: '🍌' },
        { id: 'f6', label: '🟠 Oval, Orange, Peeled', category: 'orange', emoji: '🍊' },
      ],
      buckets: [
        { id: 'apple',  label: '🍎 Apple',  color: '#EC4899', hint: 'Round, red, sweet' },
        { id: 'banana', label: '🍌 Banana', color: '#F59E0B', hint: 'Long, yellow, curved' },
        { id: 'orange', label: '🍊 Orange', color: '#F97316', hint: 'Round, orange, citrus' },
      ],
    },
    story: {
      title: 'Train Me — I\'m a Baby AI!',
      scenario: 'You\'re training a brand-new AI to recognize cats vs dogs. Tell it what features (clues) it should look for!',
      botName: 'Baby AI',
      botAvatar: '🧠',
      botColor: '#EC4899',
      prompts: [
        'What should I look at to tell cats from dogs?',
        'What if the image is blurry?',
        'How do I know I\'ve trained enough?',
      ],
      successKeywords: ['feature', 'ear', 'tail', 'fur', 'shape', 'size', 'training', 'more', 'data', 'accuracy'],
    },
    logic: {
      title: 'The ML Training Loop!',
      instruction: 'Machine Learning has a loop it repeats over and over. Put the steps in the right order!',
      steps: [
        { id: 's1', correct: 0, label: '📸 Feed training image to model', color: '#FCE7F3' },
        { id: 's2', correct: 1, label: '🤔 Model makes a guess',           color: '#FDF4FF' },
        { id: 's3', correct: 2, label: '❌ Calculate how wrong it was',    color: '#E0F2FE' },
        { id: 's4', correct: 3, label: '🔧 Adjust model weights',          color: '#DBEAFE' },
        { id: 's5', correct: 4, label: '🔁 Repeat until accurate!',        color: '#D1FAE5' },
      ],
    },
  },

  smart_machines: {
    label: 'Computer Vision',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.25)',
    icon: Eye,
    badge: '👁️',
    visual: {
      title: 'Pixel Detective!',
      instruction: 'AI sees images as grids of numbers (pixels). Sort these descriptions — does it describe a PIXEL property or a HUMAN description?',
      items: [
        { id: 'v1', label: 'RGB value: 255, 0, 0',     category: 'pixel',  emoji: '🔢' },
        { id: 'v2', label: '"This is a red flower"',   category: 'human',  emoji: '💬' },
        { id: 'v3', label: 'Brightness: 0.87',          category: 'pixel',  emoji: '🔢' },
        { id: 'v4', label: '"The sky looks blue"',      category: 'human',  emoji: '💬' },
        { id: 'v5', label: 'Pixel grid: 224×224',       category: 'pixel',  emoji: '🔢' },
        { id: 'v6', label: '"A happy dog photo"',       category: 'human',  emoji: '💬' },
      ],
      buckets: [
        { id: 'pixel', label: '🔢 Pixel Data',       color: '#10B981', hint: 'Numbers computers see' },
        { id: 'human', label: '💬 Human Description', color: '#F59E0B', hint: 'Words people use' },
      ],
    },
    story: {
      title: 'Guide the Vision Bot!',
      scenario: 'Vision Bot can see the world but doesn\'t understand what it sees yet. Explain how AI camera systems detect faces!',
      botName: 'Vision Bot',
      botAvatar: '👁️',
      botColor: '#10B981',
      prompts: [
        'I can see pixels but how do I know if there\'s a face?',
        'What features make a face different from, say, a door?',
        'How did I learn to recognize faces in the first place?',
      ],
      successKeywords: ['pixel', 'feature', 'edge', 'shape', 'eye', 'nose', 'mouth', 'train', 'data', 'pattern'],
    },
    logic: {
      title: 'How AI Reads an Image!',
      instruction: 'Put these Computer Vision processing steps in order — from raw photo to final prediction!',
      steps: [
        { id: 's1', correct: 0, label: '📷 Capture raw image',             color: '#D1FAE5' },
        { id: 's2', correct: 1, label: '🔢 Convert to pixel numbers',      color: '#A7F3D0' },
        { id: 's3', correct: 2, label: '🔍 Extract edges and shapes',      color: '#6EE7B7' },
        { id: 's4', correct: 3, label: '🧠 Pass through neural network',   color: '#E0F2FE' },
        { id: 's5', correct: 4, label: '🏷️ Output label: "Cat detected!"', color: '#FCE7F3' },
      ],
    },
  },

  ai_art: {
    label: 'Creative Studio',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.25)',
    icon: Palette,
    badge: '🎨',
    visual: {
      title: 'Prompt Engineer!',
      instruction: 'A generative AI needs a good prompt! Sort these text fragments — are they good prompt components or useless noise?',
      items: [
        { id: 'a1', label: '"Photorealistic, 8K resolution"',  category: 'good',  emoji: '✅' },
        { id: 'a2', label: '"uhh... something nice maybe"',    category: 'bad',   emoji: '❌' },
        { id: 'a3', label: '"Dramatic lighting, sunset"',      category: 'good',  emoji: '✅' },
        { id: 'a4', label: '"I dunno, make it cool"',          category: 'bad',   emoji: '❌' },
        { id: 'a5', label: '"Digital art by Studio Ghibli"',   category: 'good',  emoji: '✅' },
        { id: 'a6', label: '"Stuff... things... yeah"',        category: 'bad',   emoji: '❌' },
      ],
      buckets: [
        { id: 'good', label: '✅ Great Prompt!', color: '#10B981', hint: 'Clear and specific' },
        { id: 'bad',  label: '❌ Vague Noise',   color: '#EF4444', hint: 'Too unclear for AI' },
      ],
    },
    story: {
      title: 'Creative AI Studio Session!',
      scenario: 'Muse, your Creative AI, wants to generate a painting. Help it understand what makes a great AI art prompt!',
      botName: 'Muse',
      botAvatar: '🎨',
      botColor: '#F59E0B',
      prompts: [
        'How do I make something beautiful if I\'ve never seen beauty?',
        'What makes a prompt produce amazing art vs terrible art?',
        'Is what I make really "creative" or just remixing?',
      ],
      successKeywords: ['specific', 'detail', 'style', 'describe', 'clear', 'prompt', 'training', 'data', 'remix', 'generate'],
    },
    logic: {
      title: 'How Generative AI Creates Art!',
      instruction: 'Put these steps in order to show how a diffusion model creates an image from a text prompt!',
      steps: [
        { id: 's1', correct: 0, label: '📝 User types text prompt',         color: '#FEF3C7' },
        { id: 's2', correct: 1, label: '🔤 Model converts text to vectors', color: '#FDE68A' },
        { id: 's3', correct: 2, label: '🌫️ Start with random noise image',  color: '#E0F2FE' },
        { id: 's4', correct: 3, label: '🧠 Remove noise step by step',      color: '#DBEAFE' },
        { id: 's5', correct: 4, label: '🖼️ Final image appears!',           color: '#D1FAE5' },
      ],
    },
  },

  voice_bots: {
    label: 'Talking Bots (NLP)',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.25)',
    icon: MessageSquare,
    badge: '🗣️',
    visual: {
      title: 'Sentiment Sorter!',
      instruction: 'The NLP bot needs to learn sentiment! Sort these phrases — Positive, Negative, or Neutral?',
      items: [
        { id: 'n1', label: '"This movie is amazing! 🤩"',  category: 'positive', emoji: '😊' },
        { id: 'n2', label: '"Worst experience ever 😤"',   category: 'negative', emoji: '😠' },
        { id: 'n3', label: '"The store opens at 9am."',    category: 'neutral',  emoji: '😐' },
        { id: 'n4', label: '"I love this product!"',       category: 'positive', emoji: '😊' },
        { id: 'n5', label: '"Terrible service, 0 stars"',  category: 'negative', emoji: '😠' },
        { id: 'n6', label: '"The meeting is on Tuesday."', category: 'neutral',  emoji: '😐' },
      ],
      buckets: [
        { id: 'positive', label: '😊 Positive', color: '#10B981', hint: 'Happy / good feelings' },
        { id: 'negative', label: '😠 Negative', color: '#EF4444', hint: 'Unhappy / bad feelings' },
        { id: 'neutral',  label: '😐 Neutral',  color: '#6B7280', hint: 'Just information' },
      ],
    },
    story: {
      title: 'Teach ECHO to Understand You!',
      scenario: 'ECHO is a brand new voice assistant. It can hear words but doesn\'t understand meaning yet. Help it understand how NLP works!',
      botName: 'ECHO',
      botAvatar: '🗣️',
      botColor: '#06B6D4',
      prompts: [
        'I heard you say words, but how do I know what they mean?',
        'What is "context" and why does it matter?',
        'How do I understand sarcasm or jokes?',
      ],
      successKeywords: ['meaning', 'context', 'word', 'sentence', 'understand', 'language', 'token', 'train', 'sarcasm', 'sentiment'],
    },
    logic: {
      title: 'How a Chatbot Understands You!',
      instruction: 'Order these NLP processing steps from when you speak to when the bot responds!',
      steps: [
        { id: 's1', correct: 0, label: '🎤 User speaks a question',          color: '#CFFAFE' },
        { id: 's2', correct: 1, label: '🔊 Speech converted to text',        color: '#A5F3FC' },
        { id: 's3', correct: 2, label: '✂️ Text split into tokens (words)',  color: '#E0F2FE' },
        { id: 's4', correct: 3, label: '🧠 AI understands intent & meaning', color: '#DBEAFE' },
        { id: 's5', correct: 4, label: '💬 Bot generates a smart reply',     color: '#D1FAE5' },
      ],
    },
  },

  fun_math: {
    label: 'AI Ethics Hero',
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.25)',
    icon: Shield,
    badge: '🛡️',
    visual: {
      title: 'Spot the AI Bias!',
      instruction: 'Some AI decisions are fair, some are biased. Sort these into FAIR or BIASED!',
      items: [
        { id: 'e1', label: 'Loan AI rejects all women applicants',      category: 'biased', emoji: '⚠️' },
        { id: 'e2', label: 'Hiring AI scores based on skills only',     category: 'fair',   emoji: '✅' },
        { id: 'e3', label: 'Face AI less accurate for dark skin tones', category: 'biased', emoji: '⚠️' },
        { id: 'e4', label: 'Medical AI tested on diverse patients',     category: 'fair',   emoji: '✅' },
        { id: 'e5', label: 'Translation AI ignores minority languages', category: 'biased', emoji: '⚠️' },
        { id: 'e6', label: 'Content filter applied equally to all',     category: 'fair',   emoji: '✅' },
      ],
      buckets: [
        { id: 'fair',   label: '✅ Fair AI',    color: '#10B981', hint: 'Equal and balanced' },
        { id: 'biased', label: '⚠️ Biased AI', color: '#EF4444', hint: 'Discriminates unfairly' },
      ],
    },
    story: {
      title: 'Debate the Ethics Bot!',
      scenario: 'Judge Bot must decide: should AI be used to predict if a person will commit a crime? Argue your position!',
      botName: 'Judge Bot',
      botAvatar: '⚖️',
      botColor: '#EF4444',
      prompts: [
        'Should I predict criminal behavior before it happens?',
        'What if my training data is biased against certain groups?',
        'Who is responsible if I make a wrong — and harmful — prediction?',
      ],
      successKeywords: ['bias', 'fair', 'responsible', 'data', 'privacy', 'rights', 'harm', 'transparent', 'accountable'],
    },
    logic: {
      title: 'AI Ethics Decision Tree!',
      instruction: 'Before deploying an AI system, these checks must be done. Order them from first to last!',
      steps: [
        { id: 's1', correct: 0, label: '📋 Define the AI\'s purpose clearly', color: '#FEF2F2' },
        { id: 's2', correct: 1, label: '🔍 Audit training data for bias',      color: '#FEE2E2' },
        { id: 's3', correct: 2, label: '🧪 Test on diverse groups of people',  color: '#E0F2FE' },
        { id: 's4', correct: 3, label: '📢 Be transparent about how it works', color: '#DBEAFE' },
        { id: 's5', correct: 4, label: '🔄 Continuously monitor for harm',     color: '#D1FAE5' },
      ],
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  TASK XP VALUES
// ─────────────────────────────────────────────────────────────────────────────
const TASK_XP = { visual: 50, story: 75, logic: 100 }

// ─────────────────────────────────────────────────────────────────────────────
// 3.  VISUAL TASK  (Drag & Drop — pointer events, no extra library needed)
// ─────────────────────────────────────────────────────────────────────────────
function VisualTask({ zone, data, onComplete }) {
  const [buckets, setBuckets] = useState(() => {
    const init = {}
    data.buckets.forEach(b => { init[b.id] = [] })
    return init
  })
  const [remaining, setRemaining] = useState([...data.items].sort(() => Math.random() - 0.5))
  const [dragging, setDragging] = useState(null)
  const [feedback, setFeedback] = useState({})
  const [done, setDone] = useState(false)
  const [wrongBounce, setWrongBounce] = useState(null)

  const handleDrop = (bucketId) => {
    if (!dragging) return
    const correct = dragging.category === bucketId
    if (correct) {
      setBuckets(prev => ({ ...prev, [bucketId]: [...prev[bucketId], dragging] }))
      setRemaining(prev => prev.filter(i => i.id !== dragging.id))
      setFeedback(prev => ({ ...prev, [dragging.id]: 'correct' }))
    } else {
      setFeedback(prev => ({ ...prev, [dragging.id]: 'wrong' }))
      setWrongBounce(dragging.id)
      setTimeout(() => setWrongBounce(null), 600)
    }
    setDragging(null)
  }

  useEffect(() => {
    if (remaining.length === 0 && Object.values(buckets).some(b => b.length > 0)) {
      setTimeout(() => setDone(true), 600)
    }
  }, [remaining, buckets])

  const totalItems = data.items.length
  const placed = totalItems - remaining.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#52525B' }}>Items sorted</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: zone.color, fontFamily: "'DM Mono',monospace" }}>{placed}/{totalItems}</span>
        </div>
        <div style={{ height: 6, background: '#F4F4F5', borderRadius: 99 }}>
          <motion.div animate={{ width: `${(placed / totalItems) * 100}%` }}
            style={{ height: '100%', borderRadius: 99, background: zone.color }} />
        </div>
      </div>

      {/* Drag source cards */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#71717A', marginBottom: 12 }}>
          👆 Drag each card to the correct bucket
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {remaining.map(item => (
            <motion.div key={item.id}
              animate={wrongBounce === item.id ? { x: [-8, 8, -8, 8, 0] } : {}}
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#fff', border: `2px solid ${dragging?.id === item.id ? zone.color : '#E4E4E7'}`,
                borderRadius: 14, padding: '10px 16px', cursor: 'grab',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: dragging?.id === item.id ? `0 8px 24px ${zone.glow}` : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                userSelect: 'none'
              }}>
              <span style={{ fontSize: 22 }}>{item.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#09090B' }}>{item.label}</span>
              <GripVertical size={14} color="#D4D4D8" />
            </motion.div>
          ))}
          {remaining.length === 0 && !done && (
            <div style={{ fontSize: 13, color: '#71717A', fontStyle: 'italic', padding: '8px 0' }}>
              All items sorted! ✨
            </div>
          )}
        </div>
      </div>

      {/* Drop buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.buckets.length}, 1fr)`, gap: 14 }}>
        {data.buckets.map(bucket => (
          <div key={bucket.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(bucket.id)}
            style={{
              minHeight: 140, borderRadius: 20, padding: 16,
              border: `2px dashed ${bucket.color}55`,
              background: `${bucket.color}08`,
              transition: 'all 0.2s'
            }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: bucket.color, marginBottom: 4 }}>{bucket.label}</div>
            <div style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 600, marginBottom: 12 }}>{bucket.hint}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {buckets[bucket.id].map(item => (
                <motion.div key={item.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ background: '#fff', border: `1px solid ${bucket.color}44`, borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#09090B' }}>{item.label}</span>
                  <CheckCircle2 size={14} color={bucket.color} style={{ marginLeft: 'auto' }} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Done state */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: `${zone.color}10`, border: `2px solid ${zone.color}44`, borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>
              Perfect Sort! +{TASK_XP.visual} XP
            </div>
            <div style={{ fontSize: 13, color: '#52525B', marginTop: 6, marginBottom: 20 }}>
              You correctly sorted all {totalItems} items!
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Claim XP & Continue <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  STORY TASK  (Voice / Chat conversation)
// ─────────────────────────────────────────────────────────────────────────────
function StoryTask({ zone, data, onComplete }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: data.prompts[0], id: 0 }
  ])
  const [promptIndex, setPromptIndex] = useState(0)
  const [inputText, setInputText] = useState('')
  const [listening, setListening] = useState(false)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)
  const recognitionRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const evalResponse = (text) => {
    const lower = text.toLowerCase()
    const hits = data.successKeywords.filter(kw => lower.includes(kw)).length
    return Math.min(hits, 3)
  }

  const submitAnswer = (text) => {
    if (!text.trim()) return
    const hit = evalResponse(text)
    setScore(prev => prev + hit)

    const userMsg = { role: 'user', text, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInputText('')

    const next = promptIndex + 1
    if (next < data.prompts.length) {
      setTimeout(() => {
        const reactions = [
          'Interesting! Let me ask you something else...',
          'Hmm, I\'m thinking about that! Now...',
          'That helps me understand! One more question...',
        ]
        setMessages(prev => [...prev,
          { role: 'bot', text: reactions[promptIndex % reactions.length] + ' ' + data.prompts[next], id: Date.now() + 1 }
        ])
        setPromptIndex(next)
      }, 800)
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev,
          { role: 'bot', text: '🎉 Amazing! You\'ve explained everything so well! You\'re a true AI expert!', id: Date.now() + 1 }
        ])
        setTimeout(() => setDone(true), 1000)
      }, 800)
    }
  }

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please type your answer!')
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInputText(transcript)
      setListening(false)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Bot intro */}
      <div style={{ background: `${zone.color}08`, border: `1px solid ${zone.color}22`, borderRadius: 16, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 36, flexShrink: 0 }}>{data.botAvatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: zone.color, marginBottom: 4 }}>{data.botName} is ready to learn from you!</div>
          <div style={{ fontSize: 13, color: '#52525B', lineHeight: 1.55 }}>{data.scenario}</div>
        </div>
      </div>

      {/* Chat window */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: 20, padding: 16, maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end', gap: 10 }}>
            {msg.role === 'bot' && (
              <div style={{ width: 32, height: 32, borderRadius: 10, background: zone.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {data.botAvatar}
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
              background: msg.role === 'bot' ? '#fff' : zone.color,
              border: msg.role === 'bot' ? '1px solid #E4E4E7' : 'none',
              color: msg.role === 'bot' ? '#09090B' : '#fff',
              fontSize: 13, fontWeight: 600, lineHeight: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Keywords hint */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#71717A', fontWeight: 700, marginRight: 4, alignSelf: 'center' }}>💡 Try using:</span>
        {data.successKeywords.slice(0, 6).map(kw => (
          <span key={kw} style={{ background: `${zone.color}10`, color: zone.color, border: `1px solid ${zone.color}30`, borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
            {kw}
          </span>
        ))}
      </div>

      {/* Input row */}
      {!done && (
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitAnswer(inputText)}
              placeholder="Type or speak your answer..."
              style={{ width: '100%', padding: '14px 16px', background: '#fff', border: '1.5px solid #E4E4E7', borderRadius: 14, fontSize: 14, outline: 'none', fontFamily: "'Nunito',sans-serif", color: '#09090B' }}
            />
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={toggleVoice}
            style={{ width: 48, height: 48, borderRadius: 14, background: listening ? '#FEE2E2' : '#F4F4F5', border: `1.5px solid ${listening ? '#FECACA' : '#E4E4E7'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {listening ? <MicOff size={18} color="#EF4444" /> : <Mic size={18} color="#52525B" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => submitAnswer(inputText)}
            style={{ padding: '0 20px', height: 48, background: zone.color, border: 'none', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: "'Nunito',sans-serif" }}>
            <Send size={16} /> Send
          </motion.button>
        </div>
      )}

      {/* Done */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: `${zone.color}10`, border: `2px solid ${zone.color}44`, borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎙️</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>
              Brilliant Explanation! +{TASK_XP.story} XP
            </div>
            <div style={{ fontSize: 13, color: '#52525B', marginTop: 6, marginBottom: 20 }}>
              {data.botName} learned so much from you!
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Claim XP & Continue <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5.  LOGIC TASK  (Drag-to-reorder flowchart puzzle)
// ─────────────────────────────────────────────────────────────────────────────
function LogicTask({ zone, data, onComplete }) {
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
  const [steps, setSteps] = useState(() => shuffle(data.steps))
  const [dragIdx, setDragIdx] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const onDragStart = (i) => setDragIdx(i)
  const onDragOver = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const arr = [...steps]
    const [moved] = arr.splice(dragIdx, 1)
    arr.splice(i, 0, moved)
    setSteps(arr)
    setDragIdx(i)
    setChecked(false)
  }
  const onDragEnd = () => setDragIdx(null)

  const checkOrder = () => {
    const isCorrect = steps.every((s, i) => s.correct === i)
    setChecked(true)
    setCorrect(isCorrect)
    setAttempts(prev => prev + 1)
    if (isCorrect) setTimeout(() => {}, 0)
  }

  const reset = () => {
    setSteps(shuffle(data.steps))
    setChecked(false)
    setCorrect(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontSize: 13, color: '#71717A', fontWeight: 700 }}>
        👆 Drag the steps to reorder them — top to bottom
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, i) => {
          const isRight = checked && step.correct === i
          const isWrong = checked && step.correct !== i
          return (
            <motion.div key={step.id}
              layout
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              animate={isWrong && !correct ? { x: [-6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: isRight ? step.color : isWrong ? '#FEE2E2' : '#fff',
                border: `1.5px solid ${isRight ? '#10B981' : isWrong ? '#FECACA' : '#E4E4E7'}`,
                borderRadius: 16, padding: '14px 16px', cursor: 'grab',
                boxShadow: dragIdx === i ? '0 8px 24px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'background 0.3s, border-color 0.3s',
                userSelect: 'none'
              }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${zone.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: zone.color, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#09090B', flex: 1 }}>{step.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isRight && <CheckCircle2 size={18} color="#10B981" />}
                {isWrong && <X size={18} color="#EF4444" />}
                <GripVertical size={16} color="#D4D4D8" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action buttons */}
      {!correct && (
        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={checkOrder}
            style={{ flex: 1, padding: '14px', background: zone.color, color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 6px 20px ${zone.glow}` }}>
            <Zap size={16} /> Check Order
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={reset}
            style={{ padding: '14px 20px', background: '#F4F4F5', color: '#52525B', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={15} /> Reset
          </motion.button>
        </div>
      )}

      {checked && !correct && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#DC2626', fontWeight: 700 }}>
          ❌ Not quite right yet! Attempt #{attempts} — try rearranging and check again.
        </motion.div>
      )}

      <AnimatePresence>
        {correct && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: `${zone.color}10`, border: `2px solid ${zone.color}44`, borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🧩</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>
              Logic Master! +{TASK_XP.logic} XP
            </div>
            <div style={{ fontSize: 13, color: '#52525B', marginTop: 6, marginBottom: 20 }}>
              Perfect order in {attempts} attempt{attempts !== 1 ? 's' : ''}!
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Claim XP & Continue <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6.  BADGE CELEBRATION OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
function BadgeCelebration({ zone, onDone }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(12px)' }}>

      {/* Burst particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: Math.cos((i / 16) * Math.PI * 2) * (120 + Math.random() * 80), y: Math.sin((i / 16) * Math.PI * 2) * (120 + Math.random() * 80), scale: [0, 1, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: ['#FF6B6B','#FF9F43','#FFCF43','#48DBFB','#FF9FF3','#54A0FF'][i % 6] }}
        />
      ))}

      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
        style={{ background: '#fff', borderRadius: 32, padding: '48px 56px', textAlign: 'center', maxWidth: 400, boxShadow: `0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)` }}>

        <motion.div animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, delay: 0.5 }}
          style={{ fontSize: 80, marginBottom: 16 }}>
          {zone.badge}
        </motion.div>

        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: zone.color, marginBottom: 8 }}>
          Zone Badge Unlocked!
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px', marginBottom: 8 }}>
          {zone.label} Complete!
        </div>
        <div style={{ fontSize: 14, color: '#71717A', marginBottom: 12 }}>
          You earned all 3 task rewards!
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Visual', xp: TASK_XP.visual, emoji: '🎨' },
            { label: 'Story',  xp: TASK_XP.story,  emoji: '🎙️' },
            { label: 'Logic',  xp: TASK_XP.logic,  emoji: '🧩' },
          ].map(t => (
            <div key={t.label} style={{ background: `${zone.color}10`, border: `1px solid ${zone.color}30`, borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{t.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: zone.color }}>+{t.xp} XP</div>
              <div style={{ fontSize: 10, color: '#A1A1AA', fontWeight: 600 }}>{t.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#F4F4F5', borderRadius: 12, padding: '10px 16px', marginBottom: 24 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#09090B', fontFamily: "'DM Mono',monospace" }}>
            +{TASK_XP.visual + TASK_XP.story + TASK_XP.logic} XP Total
          </span>
          <span style={{ fontSize: 13, color: '#71717A', fontWeight: 600, marginLeft: 8 }}>this mission</span>
        </div>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onDone}
          style={{ width: '100%', padding: '16px', background: zone.color, color: '#fff', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 8px 24px ${zone.glow}` }}>
          Back to World Map <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7.  MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TASK_ORDER = ['visual', 'story', 'logic']
const TASK_META = {
  visual: { label: 'Visual Task',  emoji: '🎨', color: '#EC4899', xp: TASK_XP.visual, desc: 'Drag & Drop' },
  story:  { label: 'Story Task',   emoji: '🎙️', color: '#3B82F6', xp: TASK_XP.story,  desc: 'Voice / Chat' },
  logic:  { label: 'Logic Task',   emoji: '🧩', color: '#10B981', xp: TASK_XP.logic,  desc: 'Puzzle / Sort' },
}

export default function KidsMissionPage() {
  const { zoneId, taskType } = useParams()
  const navigate = useNavigate()

  const zone = ZONE_DATA[zoneId]
  const [activeTask, setActiveTask] = useState(taskType || 'visual')
  const [completed, setCompleted] = useState([])
  const [showBadge, setShowBadge] = useState(false)
  const [totalXp, setTotalXp] = useState(0)

  useEffect(() => {
    if (taskType && TASK_ORDER.includes(taskType)) {
      setActiveTask(taskType)
    }
  }, [taskType])

  if (!zone) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#09090B' }}>Zone not found!</div>
          <button onClick={() => navigate('/kids/dashboard')} style={{ marginTop: 16, padding: '12px 24px', background: '#09090B', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>
            Back to Map
          </button>
        </div>
      </div>
    )
  }

  const handleTaskComplete = useCallback(() => {
    const xpEarned = TASK_XP[activeTask]
    setTotalXp(prev => prev + xpEarned)
    setCompleted(prev => {
      const next = prev.includes(activeTask) ? prev : [...prev, activeTask]
      if (next.length === TASK_ORDER.length) {
        setTimeout(() => setShowBadge(true), 400)
      } else {
        const remaining = TASK_ORDER.find(t => !next.includes(t))
        if (remaining) setTimeout(() => setActiveTask(remaining), 600)
      }
      return next
    })
  }, [activeTask])

  const ZoneIcon = zone.icon
  const allDone = completed.length === TASK_ORDER.length

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 4px; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E4E4E7', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => navigate('/kids/dashboard')}
          style={{ background: '#F4F4F5', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#52525B', fontWeight: 700, fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>
          <ArrowLeft size={16} /> Map
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `${zone.color}15`, border: `1.5px solid ${zone.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZoneIcon size={18} color={zone.color} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.3px' }}>{zone.label}</div>
            <div style={{ fontSize: 11, color: '#71717A', fontWeight: 600 }}>Complete all 3 tasks to earn your badge</div>
          </div>
        </div>

        {/* XP earned pill */}
        {totalXp > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 99, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={13} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#92400E', fontFamily: "'DM Mono',monospace" }}>+{totalXp} XP</span>
          </motion.div>
        )}
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── TASK SELECTOR TABS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {TASK_ORDER.map((taskId, i) => {
            const meta = TASK_META[taskId]
            const isDone = completed.includes(taskId)
            const isActive = activeTask === taskId
            const isLocked = !isDone && i > 0 && !completed.includes(TASK_ORDER[i - 1])

            return (
              <motion.button key={taskId}
                whileHover={!isLocked ? { y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.97 } : {}}
                onClick={() => !isLocked && setActiveTask(taskId)}
                style={{
                  padding: '16px', borderRadius: 20, textAlign: 'center',
                  background: isActive ? `${meta.color}10` : isDone ? '#F0FDF4' : '#fff',
                  border: `2px solid ${isActive ? meta.color : isDone ? '#86EFAC' : '#E4E4E7'}`,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.45 : 1,
                  transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>
                  {isDone ? '✅' : meta.emoji}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? meta.color : '#09090B' }}>{meta.label}</div>
                <div style={{ fontSize: 11, color: '#71717A', fontWeight: 600, marginTop: 2 }}>{meta.desc}</div>
                <div style={{ marginTop: 8, background: isActive ? meta.color : '#F4F4F5', color: isActive ? '#fff' : '#71717A', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800, display: 'inline-block', fontFamily: "'DM Mono',monospace" }}>
                  +{meta.xp} XP
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* ── ACTIVE TASK CONTENT ── */}
        <motion.div key={activeTask}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 28, padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>

          {/* Task Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{TASK_META[activeTask].emoji}</span>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: TASK_META[activeTask].color }}>
                {TASK_META[activeTask].label}
              </div>
              <div style={{ marginLeft: 'auto', background: `${TASK_META[activeTask].color}10`, border: `1px solid ${TASK_META[activeTask].color}30`, borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: TASK_META[activeTask].color, fontFamily: "'DM Mono',monospace" }}>
                +{TASK_META[activeTask].xp} XP
              </div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.4px', marginBottom: 8 }}>
              {zone[activeTask].title}
            </h2>
            {zone[activeTask].instruction && (
              <p style={{ fontSize: 14, color: '#52525B', lineHeight: 1.6, margin: 0, background: '#FAFAFA', padding: '12px 16px', borderRadius: 12, border: '1px solid #E4E4E7' }}>
                {zone[activeTask].instruction}
              </p>
            )}
          </div>

          {/* Task Component */}
          <AnimatePresence mode="wait">
            {completed.includes(activeTask) ? (
              <motion.div key="already-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#09090B', fontFamily: "'Syne',sans-serif" }}>
                  Task Completed!
                </div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 6 }}>
                  You already earned +{TASK_XP[activeTask]} XP for this task.
                </div>
                {!allDone && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTask(TASK_ORDER.find(t => !completed.includes(t)))}
                    style={{ marginTop: 20, padding: '12px 28px', background: zone.color, color: '#fff', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Next Task <ChevronRight size={16} />
                  </motion.button>
                )}
              </motion.div>
            ) : activeTask === 'visual' ? (
              <VisualTask key="visual" zone={zone} data={zone.visual} onComplete={handleTaskComplete} />
            ) : activeTask === 'story' ? (
              <StoryTask key="story" zone={zone} data={zone.story} onComplete={handleTaskComplete} />
            ) : (
              <LogicTask key="logic" zone={zone} data={zone.logic} onComplete={handleTaskComplete} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom progress tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24, padding: '16px', background: '#fff', border: '1px solid #E4E4E7', borderRadius: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#71717A' }}>Mission Progress:</div>
          {TASK_ORDER.map(taskId => (
            <div key={taskId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: completed.includes(taskId) ? '#10B981' : activeTask === taskId ? TASK_META[taskId].color : '#E4E4E7', transition: 'background 0.3s' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: completed.includes(taskId) ? '#10B981' : activeTask === taskId ? TASK_META[taskId].color : '#A1A1AA' }}>
                {TASK_META[taskId].label}
              </span>
            </div>
          ))}
          <div style={{ marginLeft: 8, fontSize: 12, fontWeight: 800, color: '#09090B', fontFamily: "'DM Mono',monospace" }}>
            {completed.length}/3
          </div>
        </div>
      </div>

      {/* Badge Celebration */}
      <AnimatePresence>
        {showBadge && (
          <BadgeCelebration zone={zone} onDone={() => navigate('/kids/dashboard')} />
        )}
      </AnimatePresence>
    </div>
  )
}