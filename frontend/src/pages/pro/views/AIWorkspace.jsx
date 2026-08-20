import { useState, useRef, useEffect } from 'react'

// ─── IDE COLOUR PALETTE ────────────────────────────────────────────────────
const IDE = {
  bg:         '#0A0B0E',
  sidebar:    '#0F1115',
  editor:     '#0D0F12',
  titlebar:   '#090B0D',
  tabBar:     '#0F1115',
  tabActive:  '#0D0F12',
  panel:      '#09090C',
  border:     '#1E2028',
  text:       '#CDD6F4',
  textDim:    '#6C7086',
  textFaint:  '#313244',
  lineNum:    '#3D3F52',
  cursorLine: '#181A21',
  keyword:    '#C678DD',
  string:     '#98C379',
  comment:    '#5C6370',
  func:       '#61AFEF',
  number:     '#D19A66',
  operator:   '#56B6C2',
}

// ─── ICONS (inline SVG to avoid lucide dependency issues) ──────────────────
const Icon = ({ d, size = 14, color = 'currentColor', fill = 'none', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)
const PlayIcon      = ({ size, color }) => <Icon size={size} color={color} fill={color || 'currentColor'} d="M5 3l14 9-14 9V3z" />
const BrainIcon     = ({ size, color }) => <Icon size={size} color={color} d={["M9.5 2a2.5 2.5 0 0 1 5 0","M4 10h16","M4 14h16","M9.5 22a2.5 2.5 0 0 1-5 0","M19.5 22a2.5 2.5 0 0 1-5 0","M2 12a10 10 0 1 0 20 0A10 10 0 0 0 2 12"]} />
const TerminalIcon  = ({ size, color }) => <Icon size={size} color={color} d={["M4 17l6-6-6-6","M12 19h8"]} />
const XIcon         = ({ size, color }) => <Icon size={size} color={color} d="M18 6L6 18M6 6l12 12" />
const SaveIcon      = ({ size, color }) => <Icon size={size} color={color} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />
const CopyIcon      = ({ size, color }) => <Icon size={size} color={color} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M16 2v4a2 2 0 0 1-2 2H8"]} />
const CheckIcon     = ({ size, color }) => <Icon size={size} color={color} d="M20 6L9 17l-5-5" />
const FolderIcon    = ({ size, color, open }) => open
  ? <Icon size={size} color={color} d={["M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z","M2 10h20"]} />
  : <Icon size={size} color={color} d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
const FileIcon      = ({ size, color }) => <Icon size={size} color={color} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} />
const ChevRightIcon = ({ size, color }) => <Icon size={size} color={color} d="M9 18l6-6-6-6" strokeWidth={2.5} />
const ChevDownIcon  = ({ size, color }) => <Icon size={size} color={color} d="M6 9l6 6 6-6" strokeWidth={2.5} />
const SparkIcon     = ({ size, color }) => <Icon size={size} color={color} d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
const GitIcon       = ({ size, color }) => <Icon size={size} color={color} d={["M6 3v12","M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M18 9a9 9 0 0 1-12 8.7"]} />
const PanelIcon     = ({ size, color }) => <Icon size={size} color={color} d={["M3 3h18v18H3z","M3 15h18"]} />
const MenuIcon      = ({ size, color }) => <Icon size={size} color={color} d={["M3 12h18","M3 6h18","M3 18h18"]} />
const ActivityIcon  = ({ size, color }) => <Icon size={size} color={color} d="M22 12h-4l-3 9L9 3l-3 9H2" />

// ─── FILE TREE DATA ────────────────────────────────────────────────────────
const TREE = [
  {
    name: 'src', type: 'folder', open: true,
    children: [
      {
        name: 'models', type: 'folder', open: true,
        children: [
          { name: 'unsupervised_learning.py', type: 'file', lang: 'py' },
          { name: 'clustering_utils.py',      type: 'file', lang: 'py' },
          { name: 'evaluation.py',            type: 'file', lang: 'py' },
        ],
      },
      {
        name: 'data', type: 'folder', open: false,
        children: [
          { name: 'customers.csv',  type: 'file', lang: 'csv'  },
          { name: 'processed.json', type: 'file', lang: 'json' },
        ],
      },
      { name: 'requirements.txt', type: 'file', lang: 'txt' },
    ],
  },
]

const DEFAULT_CODE = `import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# ── Load & inspect dataset ──────────────────────────────────────
df = pd.read_csv('data/customers.csv')
print(f"Dataset shape: {df.shape}")
print(df.describe())

# ── Feature selection ───────────────────────────────────────────
features = ['age', 'annual_income', 'spending_score', 'tenure']
X = df[features].copy()

# Handle missing values
X.fillna(X.median(), inplace=True)

# ── Normalise features ──────────────────────────────────────────
scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Elbow method: find optimal k ────────────────────────────────
inertias = []
for k in range(2, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

# ── Fit final model (k=4) ───────────────────────────────────────
kmeans        = KMeans(n_clusters=4, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(X_scaled)

# ── Evaluate ────────────────────────────────────────────────────
sil_score = silhouette_score(X_scaled, df['cluster'])

print("\\n── Results ─────────────────────────────────────")
print(f"Inertia        : {kmeans.inertia_:.2f}")
print(f"Silhouette     : {sil_score:.4f}")
print("\\nCluster sizes  :")
print(df['cluster'].value_counts().sort_index())

# ── Cluster profiles ─────────────────────────────────────────────
profiles = df.groupby('cluster')[features].mean().round(2)
print("\\nCluster profiles:")
print(profiles)
`

const SIMULATED_OUTPUT = `$ python unsupervised_learning.py

Dataset shape: (800, 8)
       age  annual_income  spending_score  tenure
count  800.00        800.00          800.00  800.00
mean    38.42      62340.50           49.38    4.21
std     13.87      26543.78           25.64    2.93
min     18.00      15000.00            1.00    0.00
max     70.00     137000.00           99.00   10.00

── Results ─────────────────────────────────────
Inertia        : 1847.32
Silhouette     : 0.4821

Cluster sizes  :
0    234
1    198
2    221
3    147
dtype: int64

Cluster profiles:
           age  annual_income  spending_score  tenure
cluster
0         28.1        45200.0            72.4     1.8
1         42.8        89100.0            18.2     6.4
2         35.5        62400.0            51.9     4.1
3         54.2        78600.0            34.7     7.9

Process finished with exit code 0`

// ─── SYNTAX HIGHLIGHTER ────────────────────────────────────────────────────
function tokenize(line) {
  if (/^\s*#/.test(line)) return [{ t: line, c: IDE.comment }]
  const out = []
  let rest = line
  const rules = [
    { re: /^(import|from|as|def|class|return|if|else|elif|for|in|and|or|not|True|False|None|with|try|except|raise|print|range|f)\b/, c: IDE.keyword },
    { re: /^(f?"[^"]*"|f?'[^']*')/, c: IDE.string },
    { re: /^\b\d+\.?\d*\b/, c: IDE.number },
    { re: /^[a-zA-Z_]\w*(?=\s*\()/, c: IDE.func },
    { re: /^[a-zA-Z_]\w*/, c: IDE.text },
    { re: /^[+\-*\/=<>!&|^%:]+/, c: IDE.operator },
    { re: /^[\s\S]/, c: IDE.textDim },
  ]
  let guard = 0
  while (rest.length && guard++ < 800) {
    for (const { re, c } of rules) {
      const m = rest.match(re)
      if (m) { out.push({ t: m[0], c }); rest = rest.slice(m[0].length); break }
    }
  }
  return out
}

// ─── CODE EDITOR ──────────────────────────────────────────────────────────
function CodeEditor({ code, onChange, onCursorLine }) {
  const textareaRef = useRef(null)
  const overlayRef  = useRef(null)
  const lines = code.split('\n')

  const syncScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop  = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const handleSelect = e => {
    const before = e.target.value.slice(0, e.target.selectionStart)
    onCursorLine(before.split('\n').length)
  }

  const handleKeyDown = e => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const s = e.target.selectionStart
      const v = code.slice(0, s) + '    ' + code.slice(e.target.selectionEnd)
      onChange(v)
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4 }, 0)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: IDE.editor }}>
      {/* Gutter */}
      <div style={{
        width: 44, background: IDE.editor, flexShrink: 0,
        borderRight: `1px solid ${IDE.border}`,
        paddingTop: 14, overflowY: 'hidden',
        userSelect: 'none',
      }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            height: '1.72em', lineHeight: '1.72em',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingRight: 10, fontSize: 11,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            color: IDE.lineNum,
          }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            padding: '14px 0 14px 14px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 12.5, lineHeight: '1.72em',
            whiteSpace: 'pre', overflowX: 'auto', overflowY: 'auto',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ minHeight: '1.72em' }}>
              {tokenize(line).map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>{tok.t}</span>
              ))}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyUp={handleSelect}
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            position: 'absolute', inset: 0,
            padding: '14px 0 14px 14px',
            background: 'transparent', color: 'transparent',
            caretColor: '#528BFF',
            border: 'none', outline: 'none', resize: 'none',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 12.5, lineHeight: '1.72em',
            whiteSpace: 'pre', overflowX: 'auto', overflowY: 'auto',
            tabSize: 4,
          }}
        />
      </div>
    </div>
  )
}

// ─── TREE NODE ────────────────────────────────────────────────────────────
function TreeNode({ node, depth = 0, activeFile, onFileClick }) {
  const [open, setOpen] = useState(node.open ?? true)
  const isFile = node.type === 'file'
  const isActive = isFile && node.name === activeFile
  const ext = node.name?.split('.').pop()
  const iconColor = ext === 'py' ? '#4F8EF7' : ext === 'csv' ? '#34D399' : ext === 'json' ? '#F59E0B' : IDE.textDim

  return (
    <>
      <div
        onClick={() => isFile ? onFileClick(node.name) : setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: `3px 8px 3px ${8 + depth * 12}px`,
          cursor: 'pointer', userSelect: 'none',
          background: isActive ? 'rgba(79,142,247,0.12)' : 'transparent',
          borderLeft: `2px solid ${isActive ? '#4F8EF7' : 'transparent'}`,
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#141720' }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      >
        {!isFile && (open
          ? <ChevDownIcon size={10} color={IDE.textDim} />
          : <ChevRightIcon size={10} color={IDE.textDim} />
        )}
        {isFile
          ? <FileIcon size={12} color={iconColor} />
          : <FolderIcon size={12} color="#F59E0B" open={open} />
        }
        <span style={{
          fontSize: 11.5, lineHeight: '1.8em',
          color: isActive ? IDE.text : IDE.textDim,
          fontWeight: isActive ? 600 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {node.name}
        </span>
      </div>
      {!isFile && open && node.children?.map(c => (
        <TreeNode key={c.name} node={c} depth={depth + 1} activeFile={activeFile} onFileClick={onFileClick} />
      ))}
    </>
  )
}

// ─── SPINNING ICON ────────────────────────────────────────────────────────
function SpinIcon({ Icon: Ic, size, color }) {
  const ref = useRef(null)
  useEffect(() => {
    let deg = 0
    const id = setInterval(() => {
      deg += 6
      if (ref.current) ref.current.style.transform = `rotate(${deg}deg)`
    }, 16)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref} style={{ display: 'inline-flex' }}><Ic size={size} color={color} /></span>
}

// ─── PULSING DOT ─────────────────────────────────────────────────────────
function PulseDot({ color }) {
  const ref = useRef(null)
  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t += 0.05
      const o = 0.4 + 0.6 * Math.abs(Math.sin(t))
      if (ref.current) ref.current.style.opacity = o
    }, 30)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color }} />
}

// ─── FADE IN ─────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(8px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, delay)
    return () => clearTimeout(t)
  }, [delay])
  return <div ref={ref}>{children}</div>
}

// ═══ MAIN COMPONENT ═══════════════════════════════════════════════════════
export default function AIWorkspace({ onClose }) {
  const [code, setCode]             = useState(DEFAULT_CODE)
  const [output, setOutput]         = useState('')
  const [aiNote, setAiNote]         = useState('')
  const [aiLoad, setAiLoad]         = useState(false)
  const [running, setRunning]       = useState(false)
  const [panelTab, setPanelTab]     = useState('terminal')
  const [panelOpen, setPanelOpen]   = useState(true)
  const [panelH, setPanelH]         = useState(220)
  const [cursorLine, setCursorLine] = useState(1)
  const [activeFile, setActiveFile] = useState('unsupervised_learning.py')
  const [copied, setCopied]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [explorerW, setExplorerW]   = useState(200)
  const [sidebarOpen, setSidebarOpen] = useState(true)   // mobile toggle
  const [isMobile, setIsMobile]     = useState(false)

  const containerRef = useRef(null)
  const hDragActive  = useRef(false)
  const vDragActive  = useRef(false)

  // ── Detect mobile ──
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) { setSidebarOpen(false); setPanelH(160) }
      else { setSidebarOpen(true) }
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Resize handlers ──
  useEffect(() => {
    const onMove = e => {
      if (hDragActive.current && !isMobile) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) setExplorerW(Math.max(140, Math.min(300, e.clientX - rect.left)))
      }
      if (vDragActive.current) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) setPanelH(Math.max(80, Math.min(isMobile ? 280 : 500, rect.bottom - e.clientY)))
      }
    }
    const onUp = () => { hDragActive.current = false; vDragActive.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [isMobile])

  const handleRun = () => {
    setRunning(true); setOutput(''); setPanelTab('terminal'); setPanelOpen(true)
    if (isMobile) setSidebarOpen(false)
    let i = 0
    const id = setInterval(() => {
      i += 6; setOutput(SIMULATED_OUTPUT.slice(0, i))
      if (i >= SIMULATED_OUTPUT.length) { clearInterval(id); setRunning(false) }
    }, 16)
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200) }

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }

  const handleAIReview = async () => {
    setAiLoad(true); setAiNote(''); setPanelTab('ai'); setPanelOpen(true)
    if (isMobile) setSidebarOpen(false)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a senior data scientist doing a code review. Respond with EXACTLY this structure:

✓ STRENGTHS
• [specific strength]
• [specific strength]

⚠ IMPROVEMENTS
• [improvement + short inline code fix]
• [improvement + short inline code fix]

→ NEXT STEP
[One actionable next step]

Technical, concise, no preamble.

\`\`\`python\n${code}\n\`\`\``,
          }],
        }),
      })
      const d = await res.json()
      setAiNote(d.content?.map(b => b.text || '').join('\n') || 'No response.')
    } catch {
      setAiNote('⚠ AI Tutor unavailable. Check your network connection.')
    }
    setAiLoad(false)
  }

  const lineCount = code.split('\n').length
  const effectiveExplorerW = isMobile ? 0 : (sidebarOpen ? explorerW : 0)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: IDE.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: IDE.text,
      userSelect: 'none',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
        .ide-btn { transition: opacity 0.12s, background 0.12s !important; }
        .ide-btn:hover { opacity: 0.78 !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #252830; border-radius: 99px; }
        textarea { user-select: text !important; }
        @media (max-width: 480px) {
          .tb-label { display: none !important; }
          .tb-btn-pad { padding: 4px 8px !important; }
        }
      `}</style>

      {/* ═══ TITLEBAR ═════════════════════════════════════════════════════════ */}
      <div style={{
        height: isMobile ? 44 : 42,
        background: IDE.titlebar,
        borderBottom: `1px solid ${IDE.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 10px 0 12px', gap: 8, flexShrink: 0,
        minWidth: 0,
      }}>
        {/* Traffic lights / mobile menu */}
        {isMobile ? (
          <button
            onClick={() => setSidebarOpen(p => !p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: IDE.textDim, display: 'flex' }}
          >
            <MenuIcon size={16} color={IDE.textDim} />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer', padding: 0 }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          </div>
        )}

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <SparkIcon size={12} color="#4F8EF7" />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: IDE.textDim, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {isMobile ? 'AI Workspace' : 'EduAIQuest — AI Workspace'}
          </span>
        </div>

        {/* Active file label - centered, hidden on very small */}
        {!isMobile && (
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileIcon size={11} color="#4F8EF7" />
            <span style={{ fontSize: 11.5, color: IDE.textDim, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
              {activeFile}
            </span>
            {saved && (
              <span style={{ fontSize: 10, color: '#34D399', fontWeight: 600 }}>— Saved</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <button onClick={handleCopy} className="ide-btn tb-btn-pad" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: `1px solid ${IDE.border}`,
            borderRadius: 6, padding: '4px 9px', cursor: 'pointer',
            color: copied ? '#34D399' : IDE.textDim, fontSize: 11, fontWeight: 500,
          }}>
            {copied ? <CheckIcon size={11} color="#34D399" /> : <CopyIcon size={11} color={IDE.textDim} />}
            <span className="tb-label">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {!isMobile && (
            <button onClick={handleSave} className="ide-btn" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: `1px solid ${IDE.border}`,
              borderRadius: 6, padding: '4px 9px', cursor: 'pointer',
              color: IDE.textDim, fontSize: 11, fontWeight: 500,
            }}>
              <SaveIcon size={11} color={IDE.textDim} />
              <span>Save</span>
            </button>
          )}

          <div style={{ width: 1, height: 16, background: IDE.border }} />

          <button onClick={handleAIReview} disabled={aiLoad} className="ide-btn tb-btn-pad" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 6, padding: '4px 11px',
            cursor: aiLoad ? 'default' : 'pointer',
            color: '#A78BFA', fontSize: 11.5, fontWeight: 600,
            opacity: aiLoad ? 0.6 : 1, whiteSpace: 'nowrap',
          }}>
            <BrainIcon size={12} color="#A78BFA" />
            <span className="tb-label">{aiLoad ? 'Analyzing…' : 'AI Review'}</span>
          </button>

          <button onClick={handleRun} disabled={running} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: running ? 'rgba(52,211,153,0.12)' : '#34D399',
            border: `1px solid ${running ? 'rgba(52,211,153,0.3)' : 'transparent'}`,
            borderRadius: 6, padding: '5px 13px',
            cursor: running ? 'default' : 'pointer',
            color: running ? '#34D399' : '#000',
            fontSize: 11.5, fontWeight: 700,
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>
            {running
              ? <SpinIcon Icon={({ size, color }) => <ActivityIcon size={size} color={color} />} size={11} color="#34D399" />
              : <PlayIcon size={11} color="#000" />
            }
            <span className="tb-label">{running ? 'Running…' : 'Run'}</span>
          </button>

          <div style={{ width: 1, height: 16, background: IDE.border }} />

          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${IDE.border}`,
            borderRadius: 6, width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.12s', flexShrink: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <XIcon size={12} color={IDE.textDim} />
          </button>
        </div>
      </div>

      {/* ═══ TAB BAR ══════════════════════════════════════════════════════════ */}
      <div style={{
        height: 34, background: IDE.tabBar,
        borderBottom: `1px solid ${IDE.border}`,
        display: 'flex', alignItems: 'flex-end',
        paddingLeft: sidebarOpen && !isMobile ? effectiveExplorerW + 3 : 0,
        flexShrink: 0, overflowX: 'auto', overflowY: 'hidden',
      }}>
        {[
          { name: 'unsupervised_learning.py', modified: false },
          { name: 'clustering_utils.py',      modified: true  },
        ].map(tab => {
          const isActive = tab.name === activeFile
          return (
            <div
              key={tab.name}
              onClick={() => setActiveFile(tab.name)}
              style={{
                height: 34, display: 'flex', alignItems: 'center', gap: 5,
                padding: '0 12px',
                background: isActive ? IDE.tabActive : 'transparent',
                borderTop: `1.5px solid ${isActive ? '#4F8EF7' : 'transparent'}`,
                borderRight: `1px solid ${IDE.border}`,
                cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#141720' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <FileIcon size={11} color={isActive ? '#4F8EF7' : IDE.textDim} />
              <span style={{ fontSize: 11.5, color: isActive ? IDE.text : IDE.textDim, whiteSpace: 'nowrap' }}>
                {isMobile ? tab.name.replace('.py', '') : tab.name}
              </span>
              {tab.modified && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B' }} title="Unsaved" />
              )}
            </div>
          )
        })}
      </div>

      {/* ═══ BODY ═════════════════════════════════════════════════════════════ */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'rgba(0,0,0,0.55)',
            }}
          />
        )}

        {/* ── File Explorer ── */}
        {(sidebarOpen) && (
          <div style={{
            width: isMobile ? 200 : effectiveExplorerW,
            background: IDE.sidebar,
            borderRight: `1px solid ${IDE.border}`,
            display: 'flex', flexDirection: 'column',
            flexShrink: 0, overflow: 'hidden',
            ...(isMobile ? {
              position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 11,
            } : {}),
          }}>
            <div style={{
              padding: '9px 12px 6px',
              fontSize: 9.5, fontWeight: 700, color: IDE.textDim,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              borderBottom: `1px solid ${IDE.border}`,
              flexShrink: 0, userSelect: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>Explorer</span>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: IDE.textDim, display: 'flex' }}>
                  <XIcon size={12} color={IDE.textDim} />
                </button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
              {TREE.map(n => (
                <TreeNode
                  key={n.name} node={n}
                  activeFile={activeFile}
                  onFileClick={name => { setActiveFile(name); if (isMobile) setSidebarOpen(false) }}
                />
              ))}
            </div>
            <div style={{ padding: '6px 10px', borderTop: `1px solid ${IDE.border}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <GitIcon size={10} color="#4F8EF7" />
                <span style={{ fontSize: 10, color: '#4F8EF7', fontWeight: 600 }}>main</span>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal resize handle (desktop only) */}
        {!isMobile && sidebarOpen && (
          <div
            onMouseDown={() => { hDragActive.current = true }}
            style={{
              width: 3, flexShrink: 0, cursor: 'col-resize',
              background: 'transparent', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#4F8EF7'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          />
        )}

        {/* ── Editor + Panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Editor */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <CodeEditor code={code} onChange={setCode} onCursorLine={setCursorLine} />
          </div>

          {/* Vertical resize handle */}
          {panelOpen && (
            <div
              onMouseDown={() => { vDragActive.current = true }}
              style={{
                height: 4, flexShrink: 0, cursor: 'row-resize',
                background: 'transparent', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4F8EF7'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            />
          )}

          {/* ── Bottom Panel ── */}
          {panelOpen && (
            <div style={{
              height: panelH,
              background: IDE.panel,
              borderTop: `1px solid ${IDE.border}`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {/* Panel tab bar */}
              <div style={{
                display: 'flex', alignItems: 'center', height: 32,
                borderBottom: `1px solid ${IDE.border}`, flexShrink: 0,
              }}>
                {[
                  { id: 'terminal', label: 'Output',    Ic: TerminalIcon },
                  { id: 'ai',       label: 'AI Review', Ic: BrainIcon    },
                ].map(({ id, label, Ic }) => {
                  const isActive = panelTab === id
                  return (
                    <button key={id} onClick={() => setPanelTab(id)} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '0 14px', height: '100%',
                      background: 'none', border: 'none',
                      borderBottom: `2px solid ${isActive ? '#4F8EF7' : 'transparent'}`,
                      cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 11, fontWeight: isActive ? 600 : 400,
                      color: isActive ? IDE.text : IDE.textDim,
                      transition: 'all 0.12s', whiteSpace: 'nowrap',
                    }}>
                      <Ic size={11} color={id === 'ai' && isActive ? '#A78BFA' : undefined} />
                      {label}
                      {id === 'terminal' && running && <PulseDot color="#34D399" />}
                    </button>
                  )
                })}

                <button onClick={() => setPanelOpen(false)} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '0 10px', color: IDE.textDim,
                  display: 'flex', alignItems: 'center',
                }}>
                  <XIcon size={12} color={IDE.textDim} />
                </button>
              </div>

              {/* Panel body */}
              <div style={{ flex: 1, overflow: 'auto', padding: '10px 16px' }}>
                {panelTab === 'terminal' && (
                  <pre style={{
                    margin: 0,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: isMobile ? 11 : 12, lineHeight: 1.75,
                    color: output ? '#34D399' : IDE.textDim,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {output || (running ? '$ Running…' : '$ Ready — press Run to execute.')}
                  </pre>
                )}
                {panelTab === 'ai' && (
                  aiLoad ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <SpinIcon Icon={ActivityIcon} size={13} color="#A78BFA" />
                      <span style={{ fontSize: 12, color: IDE.textDim }}>Analyzing your code…</span>
                    </div>
                  ) : aiNote ? (
                    <FadeIn>
                      <div style={{
                        fontSize: isMobile ? 12 : 13, color: '#CDD6F4', lineHeight: 1.9,
                        whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif",
                      }}>
                        {aiNote}
                      </div>
                    </FadeIn>
                  ) : (
                    <span style={{ fontSize: 12, color: IDE.textDim }}>
                      Click "AI Review" to get feedback on your code.
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ STATUS BAR ═══════════════════════════════════════════════════════ */}
      <div style={{
        height: 22, background: '#071526',
        borderTop: `1px solid ${IDE.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 12px', gap: 12, flexShrink: 0, minWidth: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <GitIcon size={9} color="#4F8EF7" />
            <span style={{ fontSize: 9.5, color: '#4F8EF7', fontWeight: 600 }}>main</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: output ? '#34D399' : running ? '#F59E0B' : IDE.textDim,
            }} />
            <span style={{ fontSize: 9.5, color: IDE.textDim }}>
              {running ? 'Running' : output ? 'Done' : 'Ready'}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, overflow: 'hidden' }}>
          {(isMobile
            ? [`Ln ${cursorLine}`, `${lineCount} lines`]
            : ['Python 3.11', 'UTF-8', `Ln ${cursorLine}`, `${lineCount} lines`]
          ).map((s, i) => (
            <span key={i} style={{ fontSize: 9.5, color: IDE.textDim, whiteSpace: 'nowrap' }}>{s}</span>
          ))}
        </div>

        <button onClick={() => setPanelOpen(p => !p)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 3, color: IDE.textDim, padding: 0,
        }}>
          <PanelIcon size={9} color={IDE.textDim} />
          {!isMobile && <span style={{ fontSize: 9.5, color: IDE.textDim }}>Panel</span>}
        </button>
      </div>
    </div>
  )
}