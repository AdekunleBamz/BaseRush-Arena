/**
 * Achievement Display Component
 * Show user achievements and progress
 */

'use client'

import React, { memo, useState } from 'react'

/**
 * Achievement badge with unlock status
 */
const AchievementBadge = memo(function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = true,
  onClick,
}) {
  const {
    id,
    name,
    description,
    icon,
    rarity = 'common',
    unlocked = false,
    progress = 0,
    target = 1,
    unlockedAt,
    reward,
  } = achievement

  const rarityColors = {
    common: { bg: '#6b7280', glow: 'rgba(107, 114, 128, 0.3)' },
    uncommon: { bg: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
    rare: { bg: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' },
    epic: { bg: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
    legendary: { bg: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
  }

  const colors = rarityColors[rarity] || rarityColors.common
  const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0

  const sizeClasses = {
    sm: 'achievement-sm',
    md: 'achievement-md',
    lg: 'achievement-lg',
  }

  return (
    <div 
      className={`achievement-badge ${sizeClasses[size]} ${unlocked ? 'unlocked' : 'locked'}`}
      style={{ 
        '--rarity-color': colors.bg,
        '--rarity-glow': colors.glow,
      }}
      onClick={() => onClick?.(achievement)}
    >
      <div className="achievement-icon-wrapper">
        <span className="achievement-icon">{icon || '🏆'}</span>
        {unlocked && <span className="unlock-indicator">✓</span>}
      </div>
      
      <div className="achievement-info">
        <h4 className="achievement-name">{name}</h4>
        <p className="achievement-description">{description}</p>
        
        {!unlocked && showProgress && target > 1 && (
          <div className="achievement-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-text">{progress}/{target}</span>
          </div>
        )}

        {unlocked && unlockedAt && (
          <span className="unlock-date">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </span>
        )}

        {reward && (
          <span className="achievement-reward">
            🎁 {reward}
          </span>
        )}
      </div>

      <div className="rarity-tag">{rarity}</div>

      <style jsx>{`
        .achievement-badge {
          position: relative;
          display: flex;
          gap: 16px;
          padding: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .achievement-badge.unlocked {
          border-color: var(--rarity-color);
          box-shadow: 0 0 20px var(--rarity-glow);
        }
        .achievement-badge.locked {
          opacity: 0.7;
        }
        .achievement-badge:hover {
          transform: translateY(-2px);
        }
        .achievement-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--rarity-color), color-mix(in srgb, var(--rarity-color) 70%, black));
          border-radius: 12px;
          flex-shrink: 0;
        }
        .achievement-badge.locked .achievement-icon-wrapper {
          background: var(--border-color);
          filter: grayscale(1);
        }
        .achievement-icon {
          font-size: 2rem;
        }
        .unlock-indicator {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: white;
          border: 2px solid var(--card-bg);
        }
        .achievement-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .achievement-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
        }
        .achievement-description {
          margin: 0;
          font-size: 0.85rem;
          color: var(--secondary-text);
          line-height: 1.4;
        }
        .achievement-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .progress-bar {
          flex: 1;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--rarity-color);
          border-radius: 3px;
          transition: width 0.5s ease;
        }
        .progress-text {
          font-size: 0.75rem;
          color: var(--secondary-text);
          font-family: 'Monaco', 'Menlo', monospace;
        }
        .unlock-date {
          font-size: 0.75rem;
          color: var(--secondary-text);
          margin-top: 4px;
        }
        .achievement-reward {
          font-size: 0.8rem;
          color: var(--primary-color);
          margin-top: 4px;
        }
        .rarity-tag {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 2px 8px;
          background: var(--rarity-color);
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }
        
        .achievement-sm {
          padding: 12px;
          gap: 12px;
        }
        .achievement-sm .achievement-icon-wrapper {
          width: 40px;
          height: 40px;
        }
        .achievement-sm .achievement-icon {
          font-size: 1.5rem;
        }
        
        .achievement-lg {
          padding: 24px;
          gap: 20px;
        }
        .achievement-lg .achievement-icon-wrapper {
          width: 80px;
          height: 80px;
        }
        .achievement-lg .achievement-icon {
          font-size: 2.5rem;
        }
      `}</style>
    </div>
  )
})

/**
 * Achievement category section
 */
const AchievementCategory = memo(function AchievementCategory({
  title,
  achievements,
  defaultExpanded = true,
  onAchievementClick,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="achievement-category">
      <button 
        className="category-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="category-title">{title}</span>
        <span className="category-count">
          {unlockedCount}/{achievements.length}
        </span>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="category-content">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              onClick={onAchievementClick}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .achievement-category {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        .category-header {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .category-header:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .category-title {
          flex: 1;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          text-align: left;
        }
        .category-count {
          font-size: 0.9rem;
          color: var(--secondary-text);
          margin-right: 12px;
        }
        .expand-icon {
          font-size: 0.8rem;
          color: var(--secondary-text);
          transition: transform 0.3s;
        }
        .expand-icon.expanded {
          transform: rotate(180deg);
        }
        .category-content {
          display: grid;
          gap: 12px;
          padding: 0 16px 16px;
        }
      `}</style>
    </div>
  )
})

/**
 * Achievement progress summary
 */
const AchievementSummary = memo(function AchievementSummary({ achievements }) {
  const totalCount = achievements.length
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  const rarityBreakdown = {
    common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
    uncommon: achievements.filter(a => a.rarity === 'uncommon' && a.unlocked).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
  }

  return (
    <div className="achievement-summary">
      <div className="summary-main">
        <div className="summary-circle">
          <svg viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--primary-color)"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="summary-value">
            <span className="value-main">{unlockedCount}</span>
            <span className="value-sub">/{totalCount}</span>
          </div>
        </div>
        <div className="summary-info">
          <h3>Achievement Progress</h3>
          <p>{percentage.toFixed(1)}% Complete</p>
        </div>
      </div>

      <div className="rarity-breakdown">
        {Object.entries(rarityBreakdown).map(([rarity, count]) => (
          <div key={rarity} className={`rarity-item ${rarity}`}>
            <span className="rarity-label">{rarity}</span>
            <span className="rarity-count">{count}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .achievement-summary {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
        }
        .summary-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .summary-circle {
          position: relative;
          width: 100px;
          height: 100px;
        }
        .summary-circle svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .summary-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .value-main {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-color);
        }
        .value-sub {
          font-size: 1rem;
          color: var(--secondary-text);
        }
        .summary-info h3 {
          margin: 0 0 4px;
          font-size: 1.1rem;
          color: var(--text-color);
        }
        .summary-info p {
          margin: 0;
          color: var(--secondary-text);
        }
        .rarity-breakdown {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .rarity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
        }
        .rarity-label {
          font-size: 0.8rem;
          text-transform: capitalize;
          color: var(--secondary-text);
        }
        .rarity-count {
          font-weight: 600;
          color: var(--text-color);
        }
        .rarity-item.common { border-left: 3px solid #6b7280; }
        .rarity-item.uncommon { border-left: 3px solid #10b981; }
        .rarity-item.rare { border-left: 3px solid #3b82f6; }
        .rarity-item.epic { border-left: 3px solid #8b5cf6; }
        .rarity-item.legendary { border-left: 3px solid #f59e0b; }
      `}</style>
    </div>
  )
})

/**
 * Main Achievement Display component
 */
export function AchievementDisplay({
  achievements = [],
  showSummary = true,
  groupByCategory = true,
  onAchievementClick,
  className = '',
  ...props
}) {
  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(achievement)
    return acc
  }, {})

  return (
    <div className={`achievement-display ${className}`} {...props}>
      {showSummary && (
        <AchievementSummary achievements={achievements} />
      )}

      <div className="achievements-list">
        {groupByCategory ? (
          Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <AchievementCategory
              key={category}
              title={category}
              achievements={categoryAchievements}
              onAchievementClick={onAchievementClick}
            />
          ))
        ) : (
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                onClick={onAchievementClick}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .achievement-display {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
      `}</style>
    </div>
  )
}

export { AchievementBadge, AchievementCategory, AchievementSummary }
export default AchievementDisplay
