import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Mic, MicOff, Send, Trophy, User, Play, Loader2 } from 'lucide-react'
import { XP_MAP } from '../../../data/kids/zoneData'

const DynamicIcon = ({ name, size = 20, color = 'currentColor', ...props }) => {
  const IconComponent = Icons[name] || Icons.Bot
  return <IconComponent size={size} color={color} {...props} />
}

export default function StoryTask({ zone, data, onComplete }) {
  // data.mode can be 'text' or 'voice'
  const isVoiceMode = true;
  const [lang, setLang] = useState('en')
  const [messages, setMessages]   = useState([{ role: 'bot', text: data.prompts[0], id: 0, audioUrl: null }])
  const [input, setInput]         = useState('')
  const [recording, setRecording] = useState(false)
  const [done, setDone]           = useState(false)
  const [processing, setProcessing] = useState(false)
  const [turnCount, setTurnCount] = useState(0) 
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])
  const bottomRef        = useRef(null)

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, processing])

  // ── TEXT MODE LOGIC ──
  const submitText = async (text) => {
    if (!text.trim()) return
    const newUserMsg = { role: 'user', text, id: Date.now() }

    setMessages(p => [...p, newUserMsg])
    setInput('')
    setProcessing(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/story-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: text,
          chatHistory: [...messages, newUserMsg].slice(0, -1),
          botName: data.botName,
          scenario: data.scenario,
          language: lang
        })
      })
      const aiData = await response.json()
      setMessages(p => [...p, { role: 'bot', text: aiData.reply, id: Date.now() }])
      checkCompletion()
    } catch (error) {
      setMessages(p => [...p, { role: 'bot', text: "Oops! My AI brain is sleeping.", id: Date.now() }])
    } finally {
      setProcessing(false)
    }
  }

  // ── REAL VOICE MODE LOGIC ──
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const userAudioUrl = URL.createObjectURL(audioBlob)
        
        // Show user voice note in UI
        const newUserMsg = { role: 'user', text: "🎤 Voice Note", audioUrl: userAudioUrl, id: Date.now() }
        setMessages(p => [...p, newUserMsg])
        setProcessing(true)
        
        await sendAudioToBackend(audioBlob, newUserMsg)
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      alert("Microphone access denied!")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const sendAudioToBackend = async (audioBlob, newUserMsg) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'user_voice.webm')
    formData.append('botName', data.botName)
    formData.append('scenario', data.scenario)
   formData.append('language', lang) 
    // Passing history as stringified JSON
    const history = [...messages, newUserMsg].slice(0, -1).map(m => ({ role: m.role, text: m.text }))
    formData.append('chatHistory', JSON.stringify(history))

    try {
      const response = await fetch('http://localhost:5000/api/story-voice', {
        method: 'POST',
        body: formData
      })
      
      const aiData = await response.json()
      
      // Assume backend sends back the transcribed text AND a base64 audio response
      // aiData.replyText, aiData.audioBase64
      const botAudioUrl = `data:audio/mp3;base64,${aiData.audioBase64}`
      
      setMessages(p => [...p, { role: 'bot', text: aiData.replyText, audioUrl: botAudioUrl, id: Date.now() }])
      
      // Auto-play bot response
      const audio = new Audio(botAudioUrl)
      audio.play()

      checkCompletion()
    } catch (error) {
      setMessages(p => [...p, { role: 'bot', text: "Voice processing failed.", id: Date.now() }])
    } finally {
      setProcessing(false)
    }
  }

  const checkCompletion = () => {
    setTurnCount(p => {
      const newCount = p + 1
      if (newCount >= 2) setTimeout(() => setDone(true), 2000)
      return newCount
    })
  }

  const playAudio = (url) => {
    if (url) new Audio(url).play()
  }

  return (
    <div className="story-task-wrapper" style={{ margin: '-32px', padding: '24px 20px', borderRadius: '32px', background: 'linear-gradient(180deg, #B2D8D8 0%, #E9DCA3 100%)', minHeight: '750px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* SUCCESS MODAL (Same as before) */}
{/* SUCCESS MODAL OVERLAY */}
      <AnimatePresence>
        {done && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}
          >
            <motion.div 
              className="modal-card"
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

      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, color: '#1A1A1A', margin: '10px 0 24px', fontFamily: "'Syne',serif" }}>
        {isVoiceMode ? `Walkie-Talkie with ${data.botName}!` : `Chat with ${data.botName}!`}
      </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
    <button 
      onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
      style={{
        padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
        background: '#fff', color: '#8B5CF6', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}
    >
      Language: {lang === 'en' ? '🇬🇧 English' : '🇵🇰 اردو'}
    </button>
  </div>
      {/* ── Chat Window ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end', gap: 10, alignItems: 'flex-end' }}>
            
            {msg.role === 'bot' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <DynamicIcon name={data.botAvatar} size={18} color="#1E3A8A" />
              </div>
            )}
            
            <div className="chat-bubble" style={{ 
              maxWidth: '75%', padding: '14px 18px', borderRadius: msg.role === 'bot' ? '20px 20px 20px 4px' : '20px 20px 4px 20px', 
              background: msg.role === 'bot' ? '#F3F4F6' : 'linear-gradient(90deg, #F9A8D4, #F472B6)', color: msg.role === 'bot' ? '#1F2937' : '#ffffff', 
              fontSize: 14, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10
            }}>
              {msg.text}
              {/* Play Button for Voice Notes */}
              {msg.audioUrl && (
                <button onClick={() => playAudio(msg.audioUrl)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A855F7' }}>
                  <Play size={14} style={{ marginLeft: 2 }} />
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FDA4AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <User size={18} color="#9F1239" />
              </div>
            )}
          </motion.div>
        ))}
        
        {processing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div className="chat-bubble" style={{ background: '#F3F4F6', borderRadius: '20px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={16} className="spin-animation" color="#9CA3AF" /> <span style={{fontSize: 12, fontWeight: 700, color: '#6B7280'}}>Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* ── Dynamic Input Bar ── */}
      {!done && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          
          {isVoiceMode ? (
             // VOICE MODE UI: Big Record Button
             <motion.button 
               onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
               onTouchStart={startRecording} onTouchEnd={stopRecording}
               whileTap={{ scale: 0.95 }}
               style={{ width: '100%', padding: '16px', borderRadius: 30, background: recording ? '#EF4444' : '#A855F7', color: '#fff', border: 'none', fontSize: 16, fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.15)', touchAction: 'none' }}
             >
               {recording ? <><MicOff size={24} /> Release to Send</> : <><Mic size={24} /> Hold to Speak</>}
             </motion.button>
          ) : (
            // TEXT MODE UI: Standard Input Field
            <>
              <input 
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitText(input)}
                placeholder="Type your answer here..."
                style={{ flex: 1, padding: '16px 20px', background: '#E5E7EB', border: 'none', borderRadius: 30, fontSize: 14, fontWeight: 700, outline: 'none' }}
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => submitText(input)}
                style={{ width: 52, height: 52, borderRadius: '50%', background: '#A855F7', border: 'none', display: 'flex', alignItems: 'center', justify: 'center', color: '#ffffff' }}>
                <Send size={20} />
              </motion.button>
            </>
          )}

        </div>
      )}
    </div>
  )
}