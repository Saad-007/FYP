import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Mic, MicOff, Send, ChevronRight, Trophy, User, Lightbulb } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

// Helper component for dynamic vector icons
const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.Bot
  return <IconComponent size={size} color={color} {...props} />
}

export default function StoryTask({ zone, data, onComplete }) {
  const [messages, setMessages]   = useState([{ role: 'bot', text: data.prompts[0], id: 0 }])
  const [promptIdx, setPromptIdx] = useState(0)
  const [input, setInput]         = useState('')
  const [listening, setListening] = useState(false)
  const [done, setDone]           = useState(false)
  const [typing, setTyping]       = useState(false)
  
  const recognitionRef = useRef(null)
  const bottomRef      = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, typing])

  const evalScore = text => data.keywords.filter(k => text.toLowerCase().includes(k)).length

  const submit = (text) => {
    if (!text.trim()) return
    setMessages(p => [...p, { role: 'user', text, id: Date.now() }])
    setInput('')
    setTyping(true)
    
    const next = promptIdx + 1
    
    setTimeout(() => {
      setTyping(false)
      const score = evalScore(text)
      const reactions = score >= 2
        ? ["Great thinking! 🎯", "You really know your stuff! 🌟", "Brilliant! 💡"]
        : ["Interesting! Tell me more...", "Let's explore further...", "Good start!"]
      
      const reaction = reactions[promptIdx % reactions.length]
      
      if (next < data.prompts.length) {
        setMessages(p => [...p, { role: 'bot', text: `${reaction} Now — ${data.prompts[next]}`, id: Date.now() + 1 }])
        setPromptIdx(next)
      } else {
        setMessages(p => [...p, { role: 'bot', text: `🎉 ${reaction} You've explained everything perfectly!`, id: Date.now() + 1 }])
        setTimeout(() => setDone(true), 1500) // Trigger success modal
      }
    }, 1200)
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Speech not supported. Please type!'); return }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false) }
    r.onend = () => setListening(false)
    recognitionRef.current = r
    r.start(); setListening(true)
  }

  return (
    // ── Negative Margins & Exact Gradient from Image ──
    <div style={{ 
      margin: '-32px', 
      padding: '24px 20px', 
      borderRadius: '32px', 
      background: 'linear-gradient(180deg, #B2D8D8 0%, #E9DCA3 100%)', // Pastel Teal to Soft Yellow
      minHeight: '750px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>

      {/* ── SUCCESS MODAL OVERLAY ── */}
      <AnimatePresence>
        {done && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{ background: '#ffffff', borderRadius: 32, padding: '36px 24px', width: '100%', maxWidth: 340, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Trophy size={64} color="#FACC15" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#1F2937', margin: '0 0 12px', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px' }}>
                Great Job!
              </h2>
              <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 8px', fontWeight: 600 }}>
                {data.botName} learned so much from you!
              </p>
              <p style={{ fontSize: 20, color: '#22C55E', margin: '0 0 28px', fontWeight: 900, textShadow: '0 2px 4px rgba(34,197,94,0.2)' }}>
                +{XP_MAP.story} XP!
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete}
                style={{ width: '100%', padding: '16px 10px', background: 'linear-gradient(90deg, #F472B6, #D946EF)', color: '#fff', borderRadius: 16, border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", boxShadow: '0 8px 20px rgba(217,70,239,0.3)' }}
              >
                Next Task
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, color: '#1A1A1A', margin: '10px 0 24px', fontFamily: "'Syne',serif", letterSpacing: '-0.5px' }}>
        Chat with {data.botName}!
      </h2>

      {/* ── Transparent Chat Window ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4, paddingBottom: 20 }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ display: 'flex', justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end', gap: 10, alignItems: 'flex-end' }}>
            
            {/* Bot Avatar */}
            {msg.role === 'bot' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                 <DynamicIcon name={data.botAvatar} size={18} color="#1E3A8A" />
              </div>
            )}
            
            {/* Message Bubble */}
            <div style={{ 
              maxWidth: '75%', 
              padding: '14px 18px', 
              borderRadius: msg.role === 'bot' ? '20px 20px 20px 4px' : '20px 20px 4px 20px', 
              background: msg.role === 'bot' ? '#F3F4F6' : 'linear-gradient(90deg, #F9A8D4, #F472B6)', // Image specific user bubble color
              color: msg.role === 'bot' ? '#1F2937' : '#ffffff', 
              fontSize: 14, 
              fontWeight: 700, 
              lineHeight: 1.4, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontFamily: "'Nunito',sans-serif"
            }}>
              {msg.text}
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FDA4AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                 <User size={18} color="#9F1239" />
              </div>
            )}

          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {typing && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
               <DynamicIcon name={data.botAvatar} size={18} color="#1E3A8A" />
            </div>
            <div style={{ background: '#F3F4F6', borderRadius: '20px 20px 20px 4px', padding: '16px 20px', display: 'flex', gap: 6, alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF' }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* ── Hint Keywords (Floating below chat) ── */}
      {!done && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {data.keywords.slice(0, 4).map(kw => (
            <motion.span whileHover={{ scale: 1.05 }} key={kw} onClick={() => setInput(prev => prev + (prev ? ' ' : '') + kw)}
              style={{ background: 'rgba(255,255,255,0.6)', color: '#4B5563', border: `1px solid rgba(255,255,255,0.8)`, borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', backdropFilter: 'blur(4px)' }}>
              +{kw}
            </motion.span>
          ))}
        </div>
      )}

      {/* ── Input Bar ── */}
      {!done && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit(input)}
              placeholder={listening ? 'Listening...' : 'Type your Answer here...'}
              style={{ 
                width: '100%',
                padding: '16px 20px', 
                background: '#E5E7EB', // Gray background exactly like the image
                border: listening ? '2px solid #8B5CF6' : '2px solid transparent', 
                borderRadius: 30, // Heavily rounded
                fontSize: 14, 
                fontWeight: 700,
                outline: 'none', 
                fontFamily: "'Nunito',sans-serif", 
                color: '#1F2937',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.3s'
              }}
            />
            {/* Mic Toggle inside the input field */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleVoice}
              style={{ position: 'absolute', right: 12, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: listening ? '#EF4444' : '#9CA3AF' }}>
              {listening ? <MicOff size={22} /> : <Mic size={22} />}
            </motion.button>
          </div>
          
          {/* Circular Purple Send Button */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => submit(input)}
            style={{ 
              width: 52, 
              height: 52, 
              borderRadius: '50%', 
              background: '#A855F7', // Purple/Magenta
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ffffff', 
              boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
              flexShrink: 0
            }}>
            <Send size={20} style={{ marginLeft: -2, marginTop: 2 }} />
          </motion.button>
        </div>
      )}

    </div>
  )
}