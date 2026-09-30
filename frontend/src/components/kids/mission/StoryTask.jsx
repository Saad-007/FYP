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
  // ── DYNAMIC MODE: 'voice' (default) | 'text' | 'choice' ──
  const mode = data?.mode || 'voice'
  const isVoiceMode = mode === 'voice'
  const isChoiceMode = mode === 'choice'

  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([{ role: 'bot', text: data?.prompts?.[0] || data?.rounds?.[0]?.prompt || "Hello!", id: 0, audioUrl: null }])
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [done, setDone] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [turnCount, setTurnCount] = useState(0)

  // ── CHOICE MODE STATE ──
  const [roundIndex, setRoundIndex] = useState(0)
  const [wrongOptionId, setWrongOptionId] = useState(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const bottomRef = useRef(null)

  // ── RESET ON ZONE CHANGE ──
  useEffect(() => {
    const firstMsg = mode === 'choice' ? data?.rounds?.[0]?.prompt : data?.prompts?.[0]
    setMessages([{ role: 'bot', text: firstMsg || "Hello!", id: 0, audioUrl: null }])
    setTurnCount(0)
    setDone(false)
    setProcessing(false)
    setInput('')
    setRoundIndex(0)
    setWrongOptionId(null)
    setAnsweredCorrectly(false)
  }, [data])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, processing])

  // ── DYNAMIC COMPLETION CHECK (voice / text modes) ──
  const checkCompletion = () => {
    setTurnCount(p => {
      const newCount = p + 1
      const requiredTurns = data?.prompts?.length ? data.prompts.length - 1 : 2;
      if (newCount >= requiredTurns) {
        setTimeout(() => setDone(true), 2500)
      }
      return newCount
    })
  }

  // ── TEXT MODE LOGIC ──
  const submitText = async (text) => {
    if (!text.trim()) return
    const newUserMsg = { role: 'user', text, id: Date.now() }

    setMessages(p => [...p, newUserMsg])
    setInput('')
    setProcessing(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/story-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: text,
          chatHistory: [...messages, newUserMsg].slice(0, -1),
          botName: data?.botName || "AI",
          scenario: data?.scenario || "Chatting",
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

        if (audioBlob.size < 1000) {
          setProcessing(false);
          return;
        }

        const userAudioUrl = URL.createObjectURL(audioBlob)
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
    formData.append('botName', data?.botName || "AI")
    formData.append('scenario', data?.scenario || "Chatting")
    formData.append('language', lang)

    const history = [...messages, newUserMsg].slice(0, -1).map(m => ({ role: m.role, text: m.text }))
    formData.append('chatHistory', JSON.stringify(history))

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/story-voice`, {
        method: 'POST',
        body: formData
      })

      const aiData = await response.json()
      const botAudioUrl = `data:audio/mp3;base64,${aiData.audioBase64}`

      setMessages(p => [...p, { role: 'bot', text: aiData.replyText, audioUrl: botAudioUrl, id: Date.now() }])

      const audio = new Audio(botAudioUrl)
      audio.play()

      checkCompletion()
    } catch (error) {
      setMessages(p => [...p, { role: 'bot', text: "Voice processing failed.", id: Date.now() }])
    } finally {
      setProcessing(false)
    }
  }

  // ── CHOICE MODE LOGIC ──
  const handleOptionTap = (option) => {
    if (answeredCorrectly) return
    if (!option.correct) {
      setWrongOptionId(option.id)
      setTimeout(() => setWrongOptionId(null), 700)
      return
    }

    setAnsweredCorrectly(true)
    setMessages(p => [...p, { role: 'user', text: option.label, id: Date.now() }])

    const rounds = data?.rounds || []
    const isLastRound = roundIndex >= rounds.length - 1

    setTimeout(() => {
      if (isLastRound) {
        setDone(true)
      } else {
        const nextRound = rounds[roundIndex + 1]
        setMessages(p => [...p, { role: 'bot', text: nextRound.prompt, id: Date.now() + 1 }])
        setRoundIndex(r => r + 1)
        setAnsweredCorrectly(false)
      }
    }, 900)
  }

  const playAudio = (url) => {
    if (url) new Audio(url).play()
  }

  const currentOptions = isChoiceMode ? (data?.rounds?.[roundIndex]?.options || []) : []

  return (
    <div className="story-task-wrapper" style={{ margin: '-32px', padding: '24px 20px', borderRadius: '32px', background: 'linear-gradient(180deg, #B2D8D8 0%, #E9DCA3 100%)', minHeight: '750px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .shake { animation: shake 0.35s ease; }
      `}</style>

      {/* ── INLINE SUCCESS BANNER — no auto-jump. The person taps Continue
           whenever they're ready, so the last message always gets read
           before we hand off to KidMissionPage's "Task Completed" screen. ── */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'sticky', top: 0, zIndex: 50, margin: '0 auto 12px', background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: 99, padding: '8px 10px 8px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16,185,129,0.2)', width: 'fit-content' }}>
            <Trophy size={16} color="#16A34A" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#166534' }}>
              Great job! +{XP_MAP.story} XP
            </span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#16A34A', color: '#fff', border: 'none', borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
              Continue ➜
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, color: '#1A1A1A', margin: '10px 0 24px', fontFamily: "'Syne',serif" }}>
        {isVoiceMode ? `Walkie-Talkie with ${data?.botName || "AI"}!` : isChoiceMode ? `Help ${data?.botName || "AI"} Decide!` : `Chat with ${data?.botName || "AI"}!`}
      </h2>

      {!isChoiceMode && (
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
      )}

      {/* ── Chat Window ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end', gap: 10, alignItems: 'flex-end' }}>

            {msg.role === 'bot' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DynamicIcon name={data?.botAvatar || 'Bot'} size={18} color="#1E3A8A" />
              </div>
            )}

            <div className="chat-bubble" style={{
              maxWidth: '75%', padding: '14px 18px', borderRadius: msg.role === 'bot' ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
              background: msg.role === 'bot' ? '#F3F4F6' : 'linear-gradient(90deg, #F9A8D4, #F472B6)', color: msg.role === 'bot' ? '#1F2937' : '#ffffff',
              fontSize: 14, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10
            }}>
              {msg.text}
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
              <Loader2 size={16} className="spin-animation" color="#9CA3AF" /> <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* ── Input Bar (mode-dependent) ── */}
      {!done && isChoiceMode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentOptions.map(option => {
            const isWrong = wrongOptionId === option.id
            return (
              <motion.button
                key={option.id}
                className={isWrong ? 'shake' : ''}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleOptionTap(option)}
                disabled={answeredCorrectly}
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: 18, textAlign: 'left',
                  background: isWrong ? '#FEE2E2' : '#ffffff',
                  border: `2px solid ${isWrong ? '#EF4444' : '#E4E4E7'}`,
                  fontSize: 14, fontWeight: 800, color: '#1F2937', cursor: answeredCorrectly ? 'default' : 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontFamily: "'Nunito',sans-serif"
                }}>
                {option.label}
              </motion.button>
            )
          })}
        </div>
      )}

      {!done && !isChoiceMode && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isVoiceMode ? (
            <motion.button
              onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
              onTouchStart={startRecording} onTouchEnd={stopRecording}
              whileTap={{ scale: 0.95 }}
              style={{ width: '100%', padding: '16px', borderRadius: 30, background: recording ? '#EF4444' : '#A855F7', color: '#fff', border: 'none', fontSize: 16, fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.15)', touchAction: 'none' }}
            >
              {recording ? <><MicOff size={24} /> Release to Send</> : <><Mic size={24} /> Hold to Speak</>}
            </motion.button>
          ) : (
            <>
              <input
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitText(input)}
                placeholder="Type your answer here..."
                style={{ flex: 1, padding: '16px 20px', background: '#E5E7EB', border: 'none', borderRadius: 30, fontSize: 14, fontWeight: 700, outline: 'none' }}
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => submitText(input)}
                style={{ width: 52, height: 52, borderRadius: '50%', background: '#A855F7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Send size={20} />
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  )
}