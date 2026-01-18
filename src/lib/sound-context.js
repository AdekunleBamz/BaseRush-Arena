// Sound Context
// Provides sound effects and audio controls for the app.
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const SoundContext = createContext()

export function SoundProvider({ children }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  // Load sound preference from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem('baserush-sound')
    if (savedSound !== null) {
      setIsSoundEnabled(savedSound === 'true')
    }
  }, [])

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('baserush-sound', isSoundEnabled.toString())
  }, [isSoundEnabled])

  // Play sound effect
  const playSound = (soundType) => {
    if (!isSoundEnabled) return

    // Simple audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different sounds
      const frequencies = {
        win: 800,
        entry: 600,
        error: 300,
        click: 500
      }

      oscillator.frequency.setValueAtTime(frequencies[soundType] || 500, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev)
  }

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}