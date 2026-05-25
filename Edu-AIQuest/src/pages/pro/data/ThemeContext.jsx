import { createContext, useContext, useState, useCallback } from 'react'
import { DARK, LIGHT } from '../data/constants'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const toggle = useCallback(() => setIsDark(p => !p), [])
  const C = isDark ? DARK : LIGHT
  return (
    <ThemeCtx.Provider value={{ C, isDark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)