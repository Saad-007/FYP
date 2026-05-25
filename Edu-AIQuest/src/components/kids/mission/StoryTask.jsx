import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Mic, MicOff, Send, ChevronRight, Lightbulb, Sparkles } from 'lucide-react'
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
        setTimeout(() => setDone(true), 1200)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Bot Intro Card ── */}
      <div style={{ background: '#ffffff', border: `1px solid ${zone.color}40`, borderRadius: 20, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 4px 20px ${zone.glow}` }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `${zone.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${zone.color}30` }}>
           <DynamicIcon name={data.botAvatar} size={28} color={zone.color} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#09090B', marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>
            {data.botName} is ready to chat!
          </div>
          <div style={{ fontSize: 13, color: '#52525B', lineHeight: 1.5, fontWeight: 600 }}>
            {data.scenario}
          </div>
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div style={{ background: '#ffffff', border: '1px solid #E4E4E7', borderRadius: 24, padding: '20px', height: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ display: 'flex', justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end', gap: 12 }}>
            
            {/* Bot Avatar next to message */}
            {msg.role === 'bot' && (
              <div style={{ width: 34, height: 34, borderRadius: 12, background: `${zone.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${zone.color}30` }}>
                 <DynamicIcon name={data.botAvatar} size={18} color={zone.color} />
              </div>
            )}
            
            {/* Message Bubble */}
            <div style={{ 
              maxWidth: '80%', 
              padding: '12px 18px', 
              borderRadius: msg.role === 'bot' ? '4px 20px 20px 20px' : '20px 4px 20px 20px', 
              background: msg.role === 'bot' ? '#F4F4F5' : zone.color, 
              color: msg.role === 'bot' ? '#09090B' : '#ffffff', 
              fontSize: 14, 
              fontWeight: 700, 
              lineHeight: 1.5, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              fontFamily: "'Nunito',sans-serif"
            }}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {typing && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, background: `${zone.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${zone.color}30` }}>
               <DynamicIcon name={data.botAvatar} size={18} color={zone.color} />
            </div>
            <div style={{ background: '#F4F4F5', borderRadius: '4px 20px 20px 20px', padding: '14px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#A1A1AA' }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Hint Keywords ── */}
      {!done && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFFBEB', padding: '4px 10px', borderRadius: 10, border: '1px solid #FDE68A' }}>
            <Lightbulb size={14} color="#D97706" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>Try using:</span>
          </div>
          {data.keywords.slice(0, 6).map(kw => (
            <span key={kw} style={{ background: '#ffffff', color: '#52525B', border: `1px solid #E4E4E7`, borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* ── Input Controls ── */}
      {!done && (
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Text Input */}
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit(input)}
            placeholder={listening ? 'Listening to your voice...' : 'Type your answer here...'}
            style={{ 
              flex: 1, 
              padding: '16px 20px', 
              background: '#ffffff', 
              border: `2px solid ${listening ? zone.color : '#E4E4E7'}`, 
              borderRadius: 16, 
              fontSize: 14, 
              fontWeight: 600,
              outline: 'none', 
              fontFamily: "'Nunito',sans-serif", 
              color: '#09090B',
              boxShadow: listening ? `0 0 0 4px ${zone.glow}` : '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.2s'
            }}
          />
          
          {/* Voice Mic Button */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleVoice}
            style={{ 
              width: 54, 
              height: 54, 
              borderRadius: 16, 
              background: listening ? '#FEF2F2' : '#ffffff', 
              border: `2px solid ${listening ? '#FECACA' : '#E4E4E7'}`, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
            {listening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                <MicOff size={22} color="#EF4444" />
              </motion.div>
            ) : (
              <Mic size={22} color="#71717A" />
            )}
          </motion.button>
          
          {/* Send Button */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => submit(input)}
            style={{ 
              padding: '0 24px', 
              height: 54, 
              background: zone.color, 
              border: 'none', 
              borderRadius: 16, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              color: '#ffffff', 
              fontWeight: 900, 
              fontSize: 15, 
              fontFamily: "'Nunito',sans-serif",
              boxShadow: `0 8px 20px ${zone.glow}`
            }}>
            <Send size={18} /> <span className="hide-mobile">Send</span>
          </motion.button>
        </div>
      )}

      {/* ── Success Celebration ── */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{ background: `${zone.color}08`, border: `2px solid ${zone.color}40`, borderRadius: 24, padding: '32px', textAlign: 'center', boxShadow: `0 12px 40px ${zone.glow}`, marginTop: 10 }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
                <Mic size={36} color="#ffffff" />
              </div>
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: '#09090B', fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>
              Communication Expert!
            </div>
            <div style={{ fontSize: 15, color: '#52525B', marginBottom: 24, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span>{data.botName} learned so much from you!</span>
              <span style={{ color: '#D97706', fontWeight: 800 }}>+{XP_MAP.story} XP Earned</span>
            </div>
            
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
              style={{ background: zone.color, color: '#ffffff', border: 'none', borderRadius: 16, padding: '16px 36px', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: `0 8px 24px ${zone.glow}` }}>
              Claim XP & Continue <ChevronRight size={20} strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}