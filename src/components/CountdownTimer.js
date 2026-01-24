/**
 * Countdown Timer Component
 * A dedicated countdown display with animations
 */

'use client'

import React, { useState, useEffect, useCallback, memo } from 'react'

/**
 * Individual digit component with flip animation
 */
const FlipDigit = memo(function FlipDigit({ digit, prevDigit }) {
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (digit !== prevDigit) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 300)
      return () => clearTimeout(timer)
    }
  }, [digit, prevDigit])

  return (
    <span className={`countdown-digit ${isFlipping ? 'flip' : ''}`}>
      {digit}
      <style jsx>{`
        .countdown-digit {
          display: inline-block;
          width: 1ch;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .countdown-digit.flip {
          animation: flipDigit 0.3s ease-in-out;
        }
        @keyframes flipDigit {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </span>
  )
})

/**
 * Time unit display (hours, minutes, seconds)
 */
const TimeUnit = memo(function TimeUnit({ value, label, size = 'md' }) {
  const sizeClasses = {
    sm: 'time-unit-sm',
    md: 'time-unit-md',
    lg: 'time-unit-lg',
  }

  return (
    <div className={`time-unit ${sizeClasses[size]}`}>
      <div className="time-value">{String(value).padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
      <style jsx>{`
        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 1rem;
          background: var(--card-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .time-value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 700;
          color: var(--text-color);
        }
        .time-label {
          font-size: 0.7em;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }
        .time-unit-sm .time-value { font-size: 1.5rem; }
        .time-unit-md .time-value { font-size: 2rem; }
        .time-unit-lg .time-value { font-size: 3rem; }
      `}</style>
    </div>
  )
})

/**
 * Separator between time units
 */
const Separator = memo(function Separator({ blinking = true }) {
  return (
    <span className={`separator ${blinking ? 'blink' : ''}`}>
      :
      <style jsx>{`
        .separator {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin: 0 0.25rem;
          align-self: center;
        }
        .separator.blink {
          animation: blink 1s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </span>
  )
})

/**
 * Main Countdown Timer component
 */
export function CountdownTimer({
  targetTime,
  onComplete,
  onTick,
  variant = 'default', // 'default', 'compact', 'detailed', 'minimal'
  size = 'md',
  showDays = false,
  showLabels = true,
  showProgress = false,
  totalDuration,
  className = '',
  urgentThreshold = 300, // 5 minutes in seconds
  criticalThreshold = 60, // 1 minute in seconds
  ...props
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })
  const [prevTimeLeft, setPrevTimeLeft] = useState(timeLeft)
  const [status, setStatus] = useState('normal') // 'normal', 'urgent', 'critical', 'complete'

  const calculateTimeLeft = useCallback(() => {
    const now = Date.now()
    const target = typeof targetTime === 'number' ? targetTime : new Date(targetTime).getTime()
    const difference = target - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const totalSeconds = Math.floor(difference / 1000)
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      total: totalSeconds,
    }
  }, [targetTime])

  useEffect(() => {
    const updateTimer = () => {
      setPrevTimeLeft(timeLeft)
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      // Update status
      if (newTimeLeft.total === 0) {
        setStatus('complete')
        onComplete?.()
      } else if (newTimeLeft.total <= criticalThreshold) {
        setStatus('critical')
      } else if (newTimeLeft.total <= urgentThreshold) {
        setStatus('urgent')
      } else {
        setStatus('normal')
      }

      onTick?.(newTimeLeft)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetTime, calculateTimeLeft, onComplete, onTick, urgentThreshold, criticalThreshold])

  const progress = totalDuration 
    ? ((totalDuration - timeLeft.total) / totalDuration) * 100 
    : 0

  const formatCompact = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    }
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
    }
    return `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
  }

  const renderMinimal = () => (
    <span className={`countdown-minimal ${status}`}>
      {formatCompact()}
    </span>
  )

  const renderCompact = () => (
    <div className={`countdown-compact ${status}`}>
      {timeLeft.hours > 0 && (
        <>
          <FlipDigit digit={String(timeLeft.hours).padStart(2, '0')[0]} prevDigit={String(prevTimeLeft.hours).padStart(2, '0')[0]} />
          <FlipDigit digit={String(timeLeft.hours).padStart(2, '0')[1]} prevDigit={String(prevTimeLeft.hours).padStart(2, '0')[1]} />
          <Separator />
        </>
      )}
      <FlipDigit digit={String(timeLeft.minutes).padStart(2, '0')[0]} prevDigit={String(prevTimeLeft.minutes).padStart(2, '0')[0]} />
      <FlipDigit digit={String(timeLeft.minutes).padStart(2, '0')[1]} prevDigit={String(prevTimeLeft.minutes).padStart(2, '0')[1]} />
      <Separator />
      <FlipDigit digit={String(timeLeft.seconds).padStart(2, '0')[0]} prevDigit={String(prevTimeLeft.seconds).padStart(2, '0')[0]} />
      <FlipDigit digit={String(timeLeft.seconds).padStart(2, '0')[1]} prevDigit={String(prevTimeLeft.seconds).padStart(2, '0')[1]} />
    </div>
  )

  const renderDetailed = () => (
    <div className={`countdown-detailed ${status}`}>
      {showDays && timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" size={size} />
          <Separator blinking={false} />
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hours" size={size} />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Minutes" size={size} />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Seconds" size={size} />
    </div>
  )

  const renderDefault = () => (
    <div className={`countdown-default ${status}`}>
      <span className="time-display">{formatCompact()}</span>
      {showLabels && <span className="time-status">remaining</span>}
    </div>
  )

  const variants = {
    minimal: renderMinimal,
    compact: renderCompact,
    detailed: renderDetailed,
    default: renderDefault,
  }

  return (
    <div 
      className={`countdown-timer countdown-${variant} countdown-${size} status-${status} ${className}`}
      role="timer"
      aria-label={`${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
      {...props}
    >
      {showProgress && (
        <div className="countdown-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {variants[variant]?.() || renderDefault()}
      
      <style jsx>{`
        .countdown-timer {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .countdown-progress {
          width: 100%;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: var(--primary-color);
          transition: width 1s linear;
        }
        
        .countdown-compact,
        .countdown-detailed {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .countdown-default .time-display {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-color);
        }
        
        .countdown-default .time-status {
          font-size: 0.75rem;
          color: var(--secondary-text);
          text-transform: uppercase;
        }
        
        .countdown-minimal {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
        }
        
        .countdown-sm .countdown-compact,
        .countdown-sm .countdown-detailed { font-size: 1rem; }
        .countdown-lg .countdown-compact,
        .countdown-lg .countdown-detailed { font-size: 2.5rem; }
        
        .status-urgent .time-display,
        .status-urgent .countdown-compact,
        .status-urgent .countdown-minimal {
          color: #f59e0b;
        }
        
        .status-critical .time-display,
        .status-critical .countdown-compact,
        .status-critical .countdown-minimal {
          color: #ef4444;
          animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

/**
 * Simple countdown hook for custom implementations
 */
export function useCountdownTimer(targetTime, options = {}) {
  const { onComplete, onTick, interval = 1000 } = options
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const target = typeof targetTime === 'number' ? targetTime : new Date(targetTime).getTime()
      return Math.max(0, Math.floor((target - now) / 1000))
    }

    const updateTimer = () => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      onTick?.(remaining)

      if (remaining === 0) {
        onComplete?.()
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, interval)
    return () => clearInterval(timer)
  }, [targetTime, interval, onComplete, onTick])

  return {
    total: timeLeft,
    days: Math.floor(timeLeft / 86400),
    hours: Math.floor((timeLeft % 86400) / 3600),
    minutes: Math.floor((timeLeft % 3600) / 60),
    seconds: timeLeft % 60,
    isComplete: timeLeft === 0,
  }
}

export default CountdownTimer
