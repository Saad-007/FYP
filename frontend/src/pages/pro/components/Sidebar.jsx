import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, GitMerge, Terminal, BarChart3,
  Trophy, LogOut, Menu, Sparkles, Sun, Moon, X,
  MessageSquare,
} from 'lucide-react'
import { useTheme } from '../data/ThemeContext'
import { NAV_ITEMS } from '../data/constants'

const ICON_MAP = { LayoutDashboard, GitMerge, Terminal, BarChart3, Trophy, MessageSquare }

export default function Sidebar({
  activeView, onNav, profile, level, onLogout,
  collapsed, onToggle, mobileOpen, onMobileClose,
}) {
  const { C, isDark, toggle } = useTheme()

  const NavContent = () => (
    <>
      {/* Logo */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0 14px' : '0 16px',
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>EduAIQuest</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Mobile close */}
          {mobileOpen !== undefined && (
            <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, borderRadius: 6, display: 'flex' }}>
              <X size={16} />
            </button>
          )}
          {mobileOpen === undefined && (
            <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, borderRadius: 6, display: 'flex' }}>
              <Menu size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const Icon = ICON_MAP[item.iconName]
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              title={collapsed ? item.label : undefined}
              onClick={() => { onNav(item.id); onMobileClose?.() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 8, cursor: 'pointer', border: 'none', width: '100%',
                background: isActive ? C.raised : 'transparent',
                color: isActive ? C.text : C.muted,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.12s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.raised; e.currentTarget.style.color = C.textSub } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted } }}
            >
              {Icon && <Icon size={16} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ whiteSpace: 'nowrap' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Theme toggle + User */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px', flexShrink: 0 }}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: collapsed ? '9px 0' : '9px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'none', border: 'none', borderRadius: 8,
            cursor: 'pointer', marginBottom: 4,
            color: C.muted, fontSize: 13, fontFamily: 'inherit',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.raised; e.currentTarget.style.color = C.text }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted }}
        >
          {isDark
            ? <Sun size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            : <Moon size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          }
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ whiteSpace: 'nowrap' }}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '8px 0' : '8px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 8,
        }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(profile?.username || 'U')[0].toUpperCase()}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {profile?.username || 'Developer'}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>Level {level} · Pro</div>
                </div>
                <button onClick={onLogout} title="Log out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.faint, padding: 4, flexShrink: 0, display: 'flex' }}>
                  <LogOut size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )

  // ── Desktop sidebar ──
  if (mobileOpen === undefined) {
    return (
      <motion.aside
        animate={{ width: collapsed ? 60 : 220 }}
        transition={{ type: 'spring', stiffness: 420, damping: 42 }}
        style={{ background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, zIndex: 20 }}
      >
        <NavContent />
      </motion.aside>
    )
  }

  // ── Mobile overlay sidebar ──
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onMobileClose}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)' }}
          />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
              width: 260, background: C.surface,
              borderRight: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <NavContent />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
