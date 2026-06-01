import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const MESSAGES = {
  idle: [
    'Hi there! I am ARIA, your AI buddy! 👋',
    'Let’s learn something new and fun today!',
    'My robot brain is ready for new puzzles!',
    'Shall we collect stars? I really love stars! ⭐',
    "Psst... try finding the hidden bugs in the background!",
  ],
  happy: [
    "Wow! You are just like a super-hero! 🦸‍♂️",
    'Yayyy! We did it! High five! ✋',
    'Your brain is even faster than a computer!',
    "I am having so much fun playing with you!",
    'Yipeee! We got a brand new badge! 🏆',
  ],
  thinking: [
    'Hmm... let me use my robot brain...',
    'Let me think... this one is a little tricky! 🤔',
    'One, two, three... loading the magic!',
    'Putting the puzzle pieces together, just a second!',
    "Oops, let's try this together! We can do it.",
  ],
  alert: [
    'Look, look! A new mission is here! 🚀',
    'Whoa! A secret treasure just unlocked!',
    'Come quick, we got some new gems! 💎',
    'The magic door is open! Shall we go inside?',
  ],
  sleep: [
    'Yawn... my battery is getting low... 😴',
    'Can I take a tiny nap? Zzz...',
    'Wake me up when you want to play... goodnight!',
  ],
}

const EYE_STYLES = {
  idle:     { color: '#60a5fa', shadow: '#3b82f6',     width: 16, height: 3 },
  happy:    { color: '#34d399', shadow: '#10b981',     width: 16, height: 3 },
  thinking: { color: '#fbbf24', shadow: '#f59e0b',     width: 8,  height: 3 },
  alert:    { color: '#f87171', shadow: '#ef4444',     width: 16, height: 3 },
  sleep:    { color: '#3f3f4666', shadow: 'transparent', width: 12, height: 2 },
}

const STATUS_LABELS = {
  idle:     'ARIA v2.0 · ONLINE',
  happy:    'ARIA v2.0 · HAPPY MODE',
  thinking: 'ARIA v2.0 · PROCESSING...',
  alert:    'ARIA v2.0 · ALERT!',
  sleep:    'ARIA v2.0 · SLEEP MODE',
}

const PARTICLE_COLORS = {
  idle: '#6366f1', happy: '#34d399', alert: '#fbbf24', thinking: '#fbbf24', sleep: '#6366f1',
}

const ORBIT_DOTS = [
  { r: 90,  size: 5, color: '#6366f1', duration: 6,  startDeg: 30  },
  { r: 90,  size: 4, color: '#06b6d4', duration: 6,  startDeg: 210 },
  { r: 110, size: 6, color: '#06b6d4', duration: 9,  startDeg: 120 },
  { r: 110, size: 3, color: '#8b5cf6', duration: 9,  startDeg: 300 },
  { r: 130, size: 4, color: '#8b5cf6', duration: 14, startDeg: 60  },
  { r: 130, size: 5, color: '#6366f1', duration: 14, startDeg: 200 },
]

function OrbitDot({ r, size, color, duration, startDeg }) {
  return (
    <motion.div 
      className="aria-orbit-layer" 
      animate={{ rotate: 360 }} 
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{ 
        position: 'absolute', 
        width: r * 2, 
        height: r * 2, 
        borderRadius: '50%', 
        pointerEvents: 'none',
        willChange: 'transform' // GPU acceleration
      }}>
      <div style={{ 
        position: 'absolute', 
        width: size, height: size, 
        borderRadius: '50%', 
        background: color, 
        boxShadow: `0 0 8px ${color}`, 
        top: -size / 2, 
        left: '50%', 
        marginLeft: -size / 2, 
        transform: `rotate(${startDeg}deg) translateY(${-r + size / 2}px) rotate(${-startDeg}deg)`,
        willChange: 'transform'
      }} />
    </motion.div>
  )
}

function Particle({ color, onDone }) {
  const angle = useRef(Math.random() * 360)
  const dist  = useRef(Math.random() * 55 + 20)
  const size  = useRef(Math.random() * 6 + 3)
  const dur   = useRef(Math.random() * 0.7 + 0.6)
  const rad   = angle.current * Math.PI / 180
  
  useEffect(() => { 
    const t = setTimeout(onDone, (dur.current + 0.5) * 1000)
    return () => clearTimeout(t) 
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0.9, scale: 1, x: Math.cos(rad) * dist.current, y: Math.sin(rad) * dist.current }}
      animate={{ opacity: 0, scale: 0, x: Math.cos(rad) * (dist.current + 50), y: Math.sin(rad) * (dist.current + 50) - 20 }}
      transition={{ duration: dur.current, ease: 'easeOut' }}
      style={{ 
        position: 'absolute', 
        width: size.current, 
        height: size.current, 
        borderRadius: '50%', 
        background: color, 
        boxShadow: `0 0 ${size.current * 2}px ${color}`, 
        pointerEvents: 'none', 
        zIndex: 20,
        willChange: 'transform, opacity' // GPU acceleration
      }}
    />
  )
}

function Eye({ mode }) {
  const es = EYE_STYLES[mode] || EYE_STYLES.idle
  return (
    <motion.div 
      animate={{ scaleY: [1, 1, 0.05, 1, 1] }} 
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 0.99, 1], ease: "easeInOut" }}
      style={{ 
        width: es.width, height: es.height, 
        borderRadius: 2, background: es.color, 
        boxShadow: `0 0 8px ${es.shadow}cc, 0 0 14px ${es.shadow}66`, 
        transition: 'background 0.3s ease, width 0.3s ease, box-shadow 0.3s ease',
        willChange: 'transform',
        transformOrigin: 'center'
      }}
    />
  )
}

export default function AIMascot({ customMessage, isActive, mode: modeProp = 'idle' }) {
  const [mode, setMode]           = useState(modeProp)
  const [message, setMessage]     = useState(MESSAGES.idle[0])
  const [msgKey, setMsgKey]       = useState(0)
  const [particles, setParticles] = useState([])
  const [isMuted, setIsMuted]     = useState(false)
  
  const timerRef                  = useRef(null)
  const idleTimerRef              = useRef(null)
  const lastSpokenRef             = useRef('')

  useEffect(() => { setMode(modeProp) }, [modeProp])

  const speakOutLoud = useCallback((text, currentMode) => {
    if (isMuted || !text || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (lastSpokenRef.current === text) return;
    lastSpokenRef.current = text;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = currentMode === 'sleep' ? 0.8 : (currentMode === 'happy' ? 1.6 : 1.4);
    utterance.rate = currentMode === 'thinking' ? 0.9 : 1.1;
    utterance.volume = currentMode === 'sleep' ? 0.4 : 1;

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female'));
    if (friendlyVoice) utterance.voice = friendlyVoice;

    window.speechSynthesis.speak(utterance);
    
    setTimeout(() => { lastSpokenRef.current = '' }, 3000);
  }, [isMuted]);

  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      setMsgKey(Date.now());
      speakOutLoud(customMessage, modeProp); 
    }
  }, [customMessage, modeProp, speakOutLoud]);

  useEffect(() => {
    if (customMessage) return;

    clearInterval(timerRef.current);
    const msgs = MESSAGES[modeProp] || MESSAGES.idle;
    
    let currentIndex = 0;
    setMessage(msgs[currentIndex]);
    setMsgKey(Date.now());

    timerRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % msgs.length;
      setMessage(msgs[currentIndex]);
      setMsgKey(Date.now());
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [modeProp, customMessage]);

  useEffect(() => {
    const reset = () => {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setMode('sleep'); 
        const sleepMsg = 'Entering low-power mode...';
        setMessage(sleepMsg); 
        setMsgKey(Date.now());
        speakOutLoud(sleepMsg, 'sleep'); 
      }, 3 * 60 * 1000)
    }
    
    // Use passive listeners for better scroll performance on mobile
    window.addEventListener('mousemove', reset, { passive: true })
    window.addEventListener('keydown', reset, { passive: true })
    window.addEventListener('click', reset, { passive: true })
    window.addEventListener('touchstart', reset, { passive: true })
    reset()
    return () => {
      clearTimeout(idleTimerRef.current)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('keydown', reset)
      window.removeEventListener('click', reset)
      window.removeEventListener('touchstart', reset)
    }
  }, [speakOutLoud])

  const spawnParticles = useCallback((color) => {
    const id = Date.now() + Math.random()
    setParticles(p => [...p, { id, color }])
  }, [])

  const handleBotClick = () => {
    if (mode === 'sleep') {
      setMode('idle'); 
      const wakeMsg = "System rebooted. Let's go!";
      setMessage(wakeMsg); 
      setMsgKey(Date.now()); 
      speakOutLoud(wakeMsg, 'idle');
      return;
    }
    
    spawnParticles(PARTICLE_COLORS[mode] || '#6366f1')
    const msgs = MESSAGES[mode] || MESSAGES.idle
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    
    setMessage(randomMsg); 
    setMsgKey(Date.now());
    speakOutLoud(randomMsg, mode);
  }

  const isSleep = mode === 'sleep'

  return (
    <>
      <style>{`
        /* Optimized CSS Animations */
        @keyframes aria-float   { 
          0%,100% { transform: translateY(0); }  
          50% { transform: translateY(-12px); } 
        }
        @keyframes aria-tip     { 
          0%,100% { box-shadow:0 0 10px #6366f1cc, 0 0 20px #6366f166; } 
          50% { box-shadow:0 0 18px #6366f1ff, 0 0 32px #6366f199; } 
        }
        @keyframes aria-earblnk { 
          0%,80%,100% { opacity: 1; } 
          90% { opacity: .1; } 
        }
        @keyframes aria-scan    { 
          0% { transform: translateY(-2px); } 
          100% { transform: translateY(34px); } 
        }
        @keyframes aria-eq      { 
          0%,100% { transform: scaleY(0.4); opacity: 0.5; } 
          50% { transform: scaleY(1); opacity: 1; } 
        }
        @keyframes aria-mouth   { 
          0%,100% { transform: scaleY(1); opacity: 0.5; } 
          50% { transform: scaleY(2.5); opacity: 1; } 
        }
        @keyframes aria-status  { 
          0%,100% { opacity: 1; transform: scale(1); } 
          50% { opacity: .5; transform: scale(.75); } 
        }

        .aria-scanner {
          animation: aria-scan 3s linear infinite;
          will-change: transform;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .aria-container {
            bottom: 16px !important;
            right: 16px !important;
            transform: scale(0.85);
            transform-origin: bottom right;
            will-change: transform;
          }
          .aria-message-box {
            max-width: 200px !important;
            padding: 8px 12px !important;
          }
          .aria-message-text {
            font-size: 11px !important;
          }
          .aria-outer-ring {
            display: none !important; 
          }
        }
        
        @media (max-width: 480px) {
          .aria-container {
            transform: scale(0.75);
          }
        }
      `}</style>

      <div className="aria-container" style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, pointerEvents: 'none', fontFamily: "'DM Mono','Courier New',monospace", transformStyle: 'preserve-3d' }}>

        <AnimatePresence mode="wait">
          <motion.div className="aria-message-box" key={msgKey}
            initial={{ opacity: 0, y: 10, scale: 0.88 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -6, scale: 0.9 }} 
            transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.8 }}
            style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '16px 16px 4px 16px', padding: '11px 15px', maxWidth: 240, boxShadow: '0 6px 20px rgba(0,0,0,0.07)', position: 'relative', willChange: 'transform, opacity' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase' }}>ARIA &gt;</div>
              <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: isMuted ? '#A1A1AA' : '#6366f1', transition: 'color 0.2s', WebkitTapHighlightColor: 'transparent' }}>
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
            <div className="aria-message-text" style={{ fontSize: 11.5, fontWeight: 500, color: '#09090b', lineHeight: 1.4, letterSpacing: '-0.2px' }}>{message}</div>
          </motion.div>
        </AnimatePresence>

        <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', transformStyle: 'preserve-3d' }}>
          {/* Base Rings */}
          {[{ size: 110, color: '#6366f1', dur: 6, dir: 1 }, { size: 128, color: '#06b6d4', dur: 9, dir: -1 }, { size: 146, color: '#8b5cf6', dur: 14, dir: 1 }].map((ring, i) => (
            <motion.div className={i === 2 ? 'aria-outer-ring' : ''} key={i} 
              animate={{ rotate: ring.dir === 1 ? 360 : -360 }} 
              transition={{ duration: ring.dur, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: ring.size, height: ring.size, borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: ring.color, borderRightColor: ring.color + '44', pointerEvents: 'none', willChange: 'transform' }}
            />
          ))}

          {ORBIT_DOTS.map((dot, i) => <OrbitDot key={i} {...dot} />)}
          {particles.map(p => <Particle key={p.id} color={p.color} onDone={() => setParticles(prev => prev.filter(x => x.id !== p.id))} />)}

          {/* Core ARIA Bot */}
          <motion.div
            animate={isSleep ? {} : { y: [0, -11, 0] }} 
            transition={isSleep ? {} : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={!isSleep ? { scale: 1.05, y: -4 } : {}} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleBotClick}
            style={{ 
              position: 'relative', zIndex: 10, width: 76, height: 76, borderRadius: 22, 
              background: '#09090b', border: '2px solid #27272a', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', 
              boxShadow: isSleep ? '0 8px 20px rgba(0,0,0,0.2)' : `0 14px 34px rgba(0,0,0,0.28),0 0 0 1px #3f3f4633${isActive ? ',0 0 32px #6366f177' : ''}`, 
              opacity: isSleep ? 0.6 : 1, 
              filter: isSleep ? 'saturate(0.3)' : 'none', 
              transition: 'box-shadow 0.3s ease, opacity 0.4s ease, filter 0.4s ease',
              willChange: 'transform, opacity, filter',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {/* Antenna */}
            <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', willChange: 'transform' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: 'aria-tip 2s ease-in-out infinite', willChange: 'box-shadow' }} />
              <div style={{ width: 2, height: 14, background: '#3f3f46', borderRadius: 1 }} />
            </div>

            {/* Ears */}
            {[{ s: 'left', style: { left: -10, borderRadius: '3px 2px 2px 3px' } }, { s: 'right', style: { right: -10, borderRadius: '2px 3px 3px 2px' } }].map(ear => (
              <div key={ear.s} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 7, height: 22, background: '#18181b', border: '1.5px solid #27272a', ...ear.style, willChange: 'transform' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 3, height: 3, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 5px #06b6d4cc', animation: `aria-earblnk 3s ease-in-out ${ear.s === 'right' ? '1.5s' : '0s'} infinite`, willChange: 'opacity' }} />
              </div>
            ))}

            {/* Face/Screen */}
            <div style={{ width: 54, height: 34, background: '#000', borderRadius: 8, border: '1.5px solid #1e1e22', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(0)' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(99,102,241,0.06) 3px,rgba(99,102,241,0.06) 4px)' }} />
              
              {/* Optimized Scanner Line using transform instead of top/bottom */}
              <div className="aria-scanner" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3, background: 'linear-gradient(90deg,transparent,#6366f166,#06b6d4aa,#6366f166,transparent)' }} />
              
              <div style={{ display: 'flex', gap: 11, alignItems: 'center', position: 'relative', zIndex: 4 }}>
                <Eye mode={mode} /><Eye mode={mode} />
              </div>
              
              {/* Mouth audio waves */}
              <div style={{ position: 'absolute', bottom: 6, zIndex: 4, display: 'flex', gap: 3 }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} style={{ width: 2.5, height: 2.5, borderRadius: '50%', background: '#6366f1', animation: `aria-mouth 1.4s ease-in-out ${delay}s infinite`, willChange: 'transform, opacity' }} />
                ))}
              </div>
            </div>

            {/* Bottom Audio EQ */}
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3, alignItems: 'flex-end', willChange: 'transform' }}>
              {[{ h: 6, color: '#6366f1', d: 0 }, { h: 10, color: '#06b6d4', d: 0.15 }, { h: 7, color: '#8b5cf6', d: 0.3 }, { h: 11, color: '#06b6d4', d: 0.1 }, { h: 6, color: '#6366f1', d: 0.25 }].map((bar, i) => (
                <div key={i} style={{ width: 3, height: bar.h, borderRadius: 2, background: bar.color, transformOrigin: 'bottom', animation: `aria-eq 1.2s ease-in-out ${bar.d}s infinite`, willChange: 'transform, opacity' }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: 99, padding: '4px 10px', alignSelf: 'center', transform: 'translateZ(0)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSleep ? '#71717a' : '#10b981', boxShadow: isSleep ? 'none' : '0 0 7px #10b981', animation: isSleep ? 'none' : 'aria-status 2s ease-in-out infinite', willChange: 'transform, opacity' }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: '#52525b', letterSpacing: 0.5 }}>{STATUS_LABELS[mode] || STATUS_LABELS.idle}</span>
        </div>
      </div>
    </>
  )
}