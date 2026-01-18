
// Theme Context
// Provides dark/light theme state and toggling for the app using React context.
'use client'


// React context and hooks
import { createContext, useContext, useEffect, useState } from 'react'


// Create theme context
const ThemeContext = createContext()


// ThemeProvider component to wrap app and provide theme state
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('baserush-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      setIsDark(false)
    }
  }, [])

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('baserush-theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [isDark])

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
