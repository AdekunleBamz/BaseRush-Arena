/**
 * useCountdown Hook
 * Provides countdown timer functionality for game rounds
 */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useCountdown(targetTime, options = {}) {
  const {
    interval = 1000,
    onComplete,
    autoStart = true,
  } = options

  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Calculate time remaining
  const calculateTimeLeft = useCallback(() => {
    const now = Date.now()
    const target = typeof targetTime === 'number' ? targetTime : targetTime?.getTime() || 0
    return Math.max(0, target - now)
  }, [targetTime])

  // Start the countdown
  const start = useCallback(() => {
    setIsRunning(true)
    setIsComplete(false)
  }, [])

  // Pause the countdown
  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  // Reset the countdown
  const reset = useCallback(() => {
    setTimeLeft(calculateTimeLeft())
    setIsComplete(false)
    setIsRunning(autoStart)
  }, [calculateTimeLeft, autoStart])

  // Main countdown effect
  useEffect(() => {
    if (!isRunning) return

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    intervalRef.current = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)

      if (remaining <= 0) {
        setIsComplete(true)
        setIsRunning(false)
        clearInterval(intervalRef.current)
        onCompleteRef.current?.()
      }
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, calculateTimeLeft, interval])

  // Parse time into components
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  // Format as string
  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const formattedWithDays = days > 0 ? `${days}d ${formatted}` : formatted

  return {
    timeLeft,
    days,
    hours,
    minutes,
    seconds,
    formatted,
    formattedWithDays,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
  }
}

export default useCountdown
