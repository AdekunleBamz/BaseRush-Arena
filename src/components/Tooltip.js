// Tooltip Component
// Displays helpful information on hover
'use client'

import { useState } from 'react'

export default function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)' }
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            ...positionStyles[position]
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}