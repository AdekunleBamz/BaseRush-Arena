/**
 * Prize Pool Display Component
 * Animated prize pool visualization with live updates
 */

'use client'

import React, { useState, useEffect, useRef, memo } from 'react'

/**
 * Animated number display with rolling effect
 */
const AnimatedNumber = memo(function AnimatedNumber({ 
  value, 
  decimals = 4,
  prefix = '',
  suffix = '',
  duration = 1000,
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const animationRef = useRef(null)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return (
    <span className="animated-number">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
})

/**
 * Prize tier display
 */
const PrizeTier = memo(function PrizeTier({ 
  rank, 
  percentage, 
  amount, 
  isHighlighted = false,
}) {
  const getRankLabel = (rank) => {
    switch (rank) {
      case 1: return '🥇 1st Place'
      case 2: return '🥈 2nd Place'
      case 3: return '🥉 3rd Place'
      default: return `${rank}th Place`
    }
  }

  return (
    <div className={`prize-tier ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="tier-rank">{getRankLabel(rank)}</div>
      <div className="tier-percentage">{percentage}%</div>
      <div className="tier-amount">{amount.toFixed(4)} ETH</div>
      <style jsx>{`
        .prize-tier {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .prize-tier:hover,
        .prize-tier.highlighted {
          border-color: var(--primary-color);
          background: rgba(0, 255, 136, 0.05);
        }
        .tier-rank {
          font-weight: 600;
          color: var(--text-color);
        }
        .tier-percentage {
          color: var(--secondary-text);
          font-size: 0.9rem;
        }
        .tier-amount {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 700;
          color: var(--primary-color);
        }
      `}</style>
    </div>
  )
})

/**
 * Pool growth indicator
 */
const GrowthIndicator = memo(function GrowthIndicator({ 
  current, 
  previous, 
  period = '24h',
}) {
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0
  const isPositive = change >= 0

  return (
    <div className={`growth-indicator ${isPositive ? 'positive' : 'negative'}`}>
      <span className="growth-arrow">{isPositive ? '↑' : '↓'}</span>
      <span className="growth-value">{Math.abs(change).toFixed(1)}%</span>
      <span className="growth-period">{period}</span>
      <style jsx>{`
        .growth-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }
        .growth-indicator.positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .growth-indicator.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .growth-arrow {
          font-weight: bold;
        }
        .growth-period {
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
})

/**
 * Visual pool fill indicator
 */
const PoolFillIndicator = memo(function PoolFillIndicator({ 
  current, 
  target, 
  milestones = [],
}) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className="pool-fill-indicator">
      <div className="fill-bar">
        <div className="fill-progress" style={{ width: `${percentage}%` }} />
        {milestones.map((milestone, index) => (
          <div 
            key={index}
            className={`milestone ${current >= milestone.value ? 'reached' : ''}`}
            style={{ left: `${(milestone.value / target) * 100}%` }}
          >
            <span className="milestone-marker" />
            <span className="milestone-label">{milestone.label}</span>
          </div>
        ))}
      </div>
      <div className="fill-labels">
        <span>0 ETH</span>
        <span>{target.toFixed(2)} ETH</span>
      </div>
      <style jsx>{`
        .pool-fill-indicator {
          width: 100%;
          margin: 1rem 0;
        }
        .fill-bar {
          position: relative;
          height: 12px;
          background: var(--border-color);
          border-radius: 6px;
          overflow: visible;
        }
        .fill-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), #4ade80);
          border-radius: 6px;
          transition: width 0.5s ease;
        }
        .milestone {
          position: absolute;
          top: -8px;
          transform: translateX(-50%);
        }
        .milestone-marker {
          display: block;
          width: 4px;
          height: 28px;
          background: var(--secondary-text);
          border-radius: 2px;
        }
        .milestone.reached .milestone-marker {
          background: var(--primary-color);
        }
        .milestone-label {
          display: block;
          font-size: 0.7rem;
          color: var(--secondary-text);
          white-space: nowrap;
          margin-top: 4px;
        }
        .fill-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
})

/**
 * Main Prize Pool Display component
 */
export function PrizePoolDisplay({
  totalPool = 0,
  previousPool = 0,
  participants = 0,
  roundNumber = 1,
  timeRemaining,
  prizeDistribution = [
    { rank: 1, percentage: 50 },
    { rank: 2, percentage: 30 },
    { rank: 3, percentage: 20 },
  ],
  targetPool = 10,
  milestones = [],
  variant = 'default', // 'default', 'compact', 'detailed'
  showTiers = true,
  showGrowth = true,
  showProgress = false,
  className = '',
  ...props
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (totalPool !== previousPool) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [totalPool, previousPool])

  const calculatePrizeAmount = (percentage) => (totalPool * percentage) / 100

  if (variant === 'compact') {
    return (
      <div className={`prize-pool-compact ${className}`} {...props}>
        <div className="compact-label">Prize Pool</div>
        <div className={`compact-value ${isAnimating ? 'pulse' : ''}`}>
          <AnimatedNumber value={totalPool} suffix=" ETH" />
        </div>
        <style jsx>{`
          .prize-pool-compact {
            text-align: center;
          }
          .compact-label {
            font-size: 0.8rem;
            color: var(--secondary-text);
            margin-bottom: 0.25rem;
          }
          .compact-value {
            font-size: 1.5rem;
            font-weight: 700;
            font-family: 'Monaco', 'Menlo', monospace;
            color: var(--primary-color);
          }
          .compact-value.pulse {
            animation: valuePulse 0.5s ease;
          }
          @keyframes valuePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`prize-pool-display ${className}`} {...props}>
      <div className="pool-header">
        <div className="pool-main">
          <span className="pool-label">🏆 Total Prize Pool</span>
          <span className={`pool-value ${isAnimating ? 'pulse' : ''}`}>
            <AnimatedNumber value={totalPool} suffix=" ETH" />
          </span>
          {showGrowth && previousPool > 0 && (
            <GrowthIndicator current={totalPool} previous={previousPool} />
          )}
        </div>
        
        <div className="pool-stats">
          <div className="stat">
            <span className="stat-label">Round</span>
            <span className="stat-value">#{roundNumber}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Players</span>
            <span className="stat-value">{participants}</span>
          </div>
          {timeRemaining && (
            <div className="stat">
              <span className="stat-label">Ends In</span>
              <span className="stat-value time">{timeRemaining}</span>
            </div>
          )}
        </div>
      </div>

      {showProgress && (
        <PoolFillIndicator 
          current={totalPool} 
          target={targetPool}
          milestones={milestones}
        />
      )}

      {showTiers && variant === 'detailed' && (
        <div className="prize-tiers">
          <h4 className="tiers-title">Prize Distribution</h4>
          <div className="tiers-list">
            {prizeDistribution.map((tier) => (
              <PrizeTier
                key={tier.rank}
                rank={tier.rank}
                percentage={tier.percentage}
                amount={calculatePrizeAmount(tier.percentage)}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .prize-pool-display {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
        }
        
        .pool-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .pool-main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .pool-label {
          font-size: 0.9rem;
          color: var(--secondary-text);
        }
        
        .pool-value {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--primary-color);
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .pool-value.pulse {
          animation: valuePulse 0.5s ease;
        }
        
        .pool-stats {
          display: flex;
          gap: 1.5rem;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--secondary-text);
          text-transform: uppercase;
        }
        
        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
        }
        
        .stat-value.time {
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--primary-color);
        }
        
        .prize-tiers {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        
        .tiers-title {
          font-size: 0.9rem;
          color: var(--secondary-text);
          margin-bottom: 1rem;
        }
        
        .tiers-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        @keyframes valuePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @media (max-width: 600px) {
          .pool-header {
            flex-direction: column;
          }
          .pool-value {
            font-size: 2rem;
          }
          .pool-stats {
            width: 100%;
            justify-content: space-around;
          }
        }
      `}</style>
    </div>
  )
}

export default PrizePoolDisplay
