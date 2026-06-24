import { createContext, useState, useContext } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false)
  const toggle = () => setDark(d => !d)
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div style={{ background: dark ? '#0f0f1a' : '#f5f5f5', minHeight: '100vh', color: dark ? '#eee' : '#111', transition: 'all 0.2s' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
