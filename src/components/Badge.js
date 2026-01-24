/**
 * Badge Component
 * Displays status badges and achievement indicators
 */
'use client'

export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  pulse = false,
  className = '',
}) {
  const variantStyles = {
    default: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
    },
    primary: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#fff',
    },
    success: {
      background: 'rgba(76, 175, 80, 0.2)',
      color: '#4CAF50',
      border: '1px solid rgba(76, 175, 80, 0.4)',
    },
    warning: {
      background: 'rgba(255, 152, 0, 0.2)',
      color: '#FF9800',
      border: '1px solid rgba(255, 152, 0, 0.4)',
    },
    danger: {
      background: 'rgba(244, 67, 54, 0.2)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.4)',
    },
    info: {
      background: 'rgba(33, 150, 243, 0.2)',
      color: '#2196F3',
      border: '1px solid rgba(33, 150, 243, 0.4)',
    },
  }

  const sizeStyles = {
    small: { padding: '2px 8px', fontSize: '10px' },
    medium: { padding: '4px 12px', fontSize: '12px' },
    large: { padding: '6px 16px', fontSize: '14px' },
  }

  if (dot) {
    return (
      <span
        className={`badge-dot ${className}`}
        style={{
          display: 'inline-block',
          width: size === 'small' ? '6px' : size === 'large' ? '10px' : '8px',
          height: size === 'small' ? '6px' : size === 'large' ? '10px' : '8px',
          borderRadius: '50%',
          ...variantStyles[variant],
          animation: pulse ? 'pulse 2s infinite' : 'none',
        }}
      >
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
          }
        `}</style>
      </span>
    )
  }

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '999px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  )
}

/**
 * AchievementBadge - Badge for achievements with icon
 */
export function AchievementBadge({ icon, name, unlocked = false, size = 'medium' }) {
  const sizeMap = {
    small: { size: '40px', iconSize: '20px', fontSize: '10px' },
    medium: { size: '60px', iconSize: '28px', fontSize: '12px' },
    large: { size: '80px', iconSize: '36px', fontSize: '14px' },
  }

  const s = sizeMap[size]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: unlocked ? 1 : 0.4,
        filter: unlocked ? 'none' : 'grayscale(100%)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: unlocked
            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
            : 'rgba(255, 255, 255, 0.1)',
          border: `2px solid ${unlocked ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.iconSize,
          boxShadow: unlocked ? '0 4px 20px rgba(255, 215, 0, 0.4)' : 'none',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: s.fontSize,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '80px',
        }}
      >
        {name}
      </span>
    </div>
  )
}

/**
 * NotificationBadge - Badge that displays notification count
 */
export function NotificationBadge({ count, max = 99, children }) {
  const displayCount = count > max ? `${max}+` : count

  if (!count || count <= 0) {
    return <>{children}</>
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          minWidth: '18px',
          height: '18px',
          padding: '0 6px',
          borderRadius: '9px',
          background: '#f44336',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'popIn 0.3s ease',
        }}
      >
        {displayCount}
        <style jsx>{`
          @keyframes popIn {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      </span>
    </div>
  )
}

/**
 * StatusBadge - Badge for displaying status
 */
export function StatusBadge({ status }) {
  const statusConfig = {
    online: { variant: 'success', label: 'Online', dot: true },
    offline: { variant: 'default', label: 'Offline', dot: true },
    away: { variant: 'warning', label: 'Away', dot: true },
    busy: { variant: 'danger', label: 'Busy', dot: true },
    pending: { variant: 'warning', label: 'Pending' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
  }

  const config = statusConfig[status] || statusConfig.offline

  return (
    <Badge variant={config.variant} size="small">
      {config.dot && <Badge variant={config.variant} dot pulse />}
      {config.label}
    </Badge>
  )
}
