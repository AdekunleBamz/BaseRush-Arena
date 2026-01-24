/**
 * Stats Card Component
 * Display game statistics and metrics
 */

'use client'

import React, { memo, useEffect, useState, useRef } from 'react'

/**
 * Animated counter hook
 */
function useAnimatedCounter(end, duration = 1000, enabled = true) {
  const [value, setValue] = useState(0)
  const previousEnd = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const startValue = previousEnd.current
    const startTime = performance.now()
    const endValue = end

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(startValue + (endValue - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousEnd.current = endValue
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, enabled])

  return value
}

/**
 * Trend indicator
 */
const TrendIndicator = memo(function TrendIndicator({ value, showPercentage = true }) {
  const isPositive = value > 0
  const isNeutral = value === 0

  return (
    <span className={`trend ${isPositive ? 'up' : isNeutral ? 'neutral' : 'down'}`}>
      <span className="trend-arrow">
        {isPositive ? '↑' : isNeutral ? '→' : '↓'}
      </span>
      {showPercentage && (
        <span className="trend-value">{Math.abs(value).toFixed(1)}%</span>
      )}
      
      <style jsx>{`
        .trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .trend.up {
          color: #10b981;
        }
        .trend.down {
          color: #ef4444;
        }
        .trend.neutral {
          color: var(--secondary-text);
        }
        .trend-arrow {
          font-size: 0.9em;
        }
      `}</style>
    </span>
  )
})

/**
 * Sparkline chart
 */
const Sparkline = memo(function Sparkline({ data, color = 'var(--primary-color)', height = 40 }) {
  if (!data || data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style jsx>{`
        .sparkline {
          width: 100%;
          display: block;
        }
      `}</style>
    </svg>
  )
})

/**
 * Mini progress bar
 */
const MiniProgress = memo(function MiniProgress({ value, max = 100, color }) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="mini-progress">
      <div 
        className="progress-fill" 
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color || 'var(--primary-color)',
        }} 
      />
      <style jsx>{`
        .mini-progress {
          width: 100%;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  )
})

/**
 * Single stat card
 */
export const StatCard = memo(function StatCard({
  label,
  value,
  previousValue,
  prefix = '',
  suffix = '',
  icon,
  color,
  trend,
  sparklineData,
  progress,
  progressMax = 100,
  size = 'md', // 'sm', 'md', 'lg'
  animated = true,
  className = '',
  ...props
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0
  const animatedValue = useAnimatedCounter(numericValue, 1000, animated)
  const displayValue = animated ? animatedValue : numericValue

  // Calculate trend if previousValue provided
  const calculatedTrend = previousValue 
    ? ((numericValue - previousValue) / previousValue) * 100
    : trend

  const sizeClasses = {
    sm: 'stat-card-sm',
    md: 'stat-card-md',
    lg: 'stat-card-lg',
  }

  return (
    <div 
      className={`stat-card ${sizeClasses[size]} ${className}`}
      style={{ '--stat-color': color }}
      {...props}
    >
      <div className="stat-header">
        {icon && <span className="stat-icon">{icon}</span>}
        <span className="stat-label">{label}</span>
        {calculatedTrend !== undefined && (
          <TrendIndicator value={calculatedTrend} />
        )}
      </div>

      <div className="stat-value">
        {prefix}
        {typeof value === 'number' 
          ? displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : value
        }
        {suffix}
      </div>

      {sparklineData && (
        <div className="stat-sparkline">
          <Sparkline data={sparklineData} color={color} />
        </div>
      )}

      {progress !== undefined && (
        <div className="stat-progress">
          <MiniProgress value={progress} max={progressMax} color={color} />
          <span className="progress-label">{Math.round((progress / progressMax) * 100)}%</span>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--stat-color, var(--primary-color));
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .stat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        .stat-icon {
          font-size: 1.2rem;
        }
        .stat-label {
          flex: 1;
          font-size: 0.85rem;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--stat-color, var(--text-color));
          font-family: 'Monaco', 'Menlo', monospace;
        }
        .stat-sparkline {
          margin-top: 0.75rem;
        }
        .stat-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 0.75rem;
        }
        .progress-label {
          font-size: 0.75rem;
          color: var(--secondary-text);
        }
        
        .stat-card-sm {
          padding: 0.75rem;
        }
        .stat-card-sm .stat-value {
          font-size: 1.25rem;
        }
        
        .stat-card-lg {
          padding: 1.5rem;
        }
        .stat-card-lg .stat-value {
          font-size: 2.5rem;
        }
      `}</style>
    </div>
  )
})

/**
 * Stats grid container
 */
export const StatsGrid = memo(function StatsGrid({
  children,
  columns = 4,
  gap = '1rem',
  className = '',
  ...props
}) {
  return (
    <div 
      className={`stats-grid ${className}`}
      style={{ '--columns': columns, '--gap': gap }}
      {...props}
    >
      {children}
      
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(var(--columns), 1fr);
          gap: var(--gap);
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
})

/**
 * Stats row (horizontal layout)
 */
export const StatsRow = memo(function StatsRow({
  children,
  gap = '1rem',
  className = '',
  ...props
}) {
  return (
    <div 
      className={`stats-row ${className}`}
      style={{ '--gap': gap }}
      {...props}
    >
      {children}
      
      <style jsx>{`
        .stats-row {
          display: flex;
          align-items: stretch;
          gap: var(--gap);
          flex-wrap: wrap;
        }
        .stats-row > :global(*) {
          flex: 1;
          min-width: 150px;
        }
      `}</style>
    </div>
  )
})

/**
 * Comparison stat (before/after or vs)
 */
export const ComparisonStat = memo(function ComparisonStat({
  label,
  leftValue,
  leftLabel = 'Before',
  rightValue,
  rightLabel = 'After',
  icon,
  className = '',
  ...props
}) {
  const change = rightValue - leftValue
  const percentChange = leftValue ? (change / leftValue) * 100 : 0

  return (
    <div className={`comparison-stat ${className}`} {...props}>
      {icon && <span className="comparison-icon">{icon}</span>}
      <span className="comparison-label">{label}</span>
      
      <div className="comparison-values">
        <div className="comparison-item left">
          <span className="item-label">{leftLabel}</span>
          <span className="item-value">{leftValue.toLocaleString()}</span>
        </div>
        
        <div className="comparison-arrow">
          <span className={`arrow ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '→' : '←'}
          </span>
          <span className="change-value">{percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%</span>
        </div>
        
        <div className="comparison-item right">
          <span className="item-label">{rightLabel}</span>
          <span className="item-value">{rightValue.toLocaleString()}</span>
        </div>
      </div>
      
      <style jsx>{`
        .comparison-stat {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
        }
        .comparison-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .comparison-label {
          font-size: 0.85rem;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .comparison-values {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          gap: 0.5rem;
        }
        .comparison-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-label {
          font-size: 0.75rem;
          color: var(--secondary-text);
        }
        .item-value {
          font-size: 1.25rem;
          font-weight: 600;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--text-color);
        }
        .comparison-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .arrow {
          font-size: 1.5rem;
        }
        .arrow.positive {
          color: #10b981;
        }
        .arrow.negative {
          color: #ef4444;
        }
        .change-value {
          font-size: 0.75rem;
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
})

export default StatCard
