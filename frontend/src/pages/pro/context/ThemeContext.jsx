import { createContext, useContext, useState, useEffect } from 'react'
import { DARK, LIGHT } from '../data/constants'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('proTheme') !== 'light' }
    catch { return true }
  })

  const C = isDark ? DARK : LIGHT

  const toggle = () => {
    setIsDark(p => {
      const next = !p
      try { localStorage.setItem('proTheme', next ? 'dark' : 'light') } catch {}
      return next
    })
  }

  useEffect(() => {
    document.body.style.background = C.bg
    return () => { document.body.style.background = '' }
  }, [C.bg])

  return (
    <ThemeCtx.Provider value={{ C, isDark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
