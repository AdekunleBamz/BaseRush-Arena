/**
 * Avatar Component
 * User avatar with fallback and status indicator
 */
'use client'

export default function Avatar({
  src,
  alt = 'User avatar',
  name,
  size = 'medium',
  status,
  className = '',
}) {
  const sizeMap = {
    small: { width: 32, fontSize: 12 },
    medium: { width: 40, fontSize: 14 },
    large: { width: 56, fontSize: 18 },
    xlarge: { width: 80, fontSize: 24 },
  }

  const s = sizeMap[size]

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate consistent color from name
  const getBackgroundColor = (name) => {
    if (!name) return '#667eea'
    const colors = [
      '#667eea', '#764ba2', '#4CAF50', '#FF9800', 
      '#2196F3', '#9C27B0', '#E91E63', '#00BCD4'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const statusColors = {
    online: '#4CAF50',
    offline: '#9e9e9e',
    away: '#FF9800',
    busy: '#f44336',
  }

  return (
    <div
      className={`avatar ${className}`}
      style={{
        position: 'relative',
        width: s.width,
        height: s.width,
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: getBackgroundColor(name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s.fontSize,
            fontWeight: 600,
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: s.width * 0.25,
            height: s.width * 0.25,
            borderRadius: '50%',
            background: statusColors[status] || statusColors.offline,
            border: '2px solid rgba(0, 0, 0, 0.5)',
          }}
        />
      )}
    </div>
  )
}

/**
 * AvatarGroup - Group of overlapping avatars
 */
export function AvatarGroup({ users, max = 4, size = 'medium' }) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((user, index) => (
        <div
          key={user.id || index}
          style={{
            marginLeft: index > 0 ? '-12px' : 0,
            zIndex: visible.length - index,
          }}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            size={size}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          style={{
            marginLeft: '-12px',
            width: size === 'small' ? 32 : size === 'large' ? 56 : 40,
            height: size === 'small' ? 32 : size === 'large' ? 56 : 40,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
