/**
 * Alert Component
 * Displays informational messages with variants
 */
'use client'

import { useState } from 'react'

export default function Alert({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  action,
  className = '',
}) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const variantStyles = {
    info: {
      background: 'rgba(33, 150, 243, 0.15)',
      border: '1px solid rgba(33, 150, 243, 0.4)',
      icon: 'ℹ️',
      color: '#2196F3',
    },
    success: {
      background: 'rgba(76, 175, 80, 0.15)',
      border: '1px solid rgba(76, 175, 80, 0.4)',
      icon: '✅',
      color: '#4CAF50',
    },
    warning: {
      background: 'rgba(255, 152, 0, 0.15)',
      border: '1px solid rgba(255, 152, 0, 0.4)',
      icon: '⚠️',
      color: '#FF9800',
    },
    error: {
      background: 'rgba(244, 67, 54, 0.15)',
      border: '1px solid rgba(244, 67, 54, 0.4)',
      icon: '❌',
      color: '#f44336',
    },
  }

  const styles = variantStyles[variant]

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      role="alert"
      className={`alert alert-${variant} ${className}`}
      style={{
        ...styles,
        padding: '16px',
        borderRadius: '12px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        color: '#fff',
      }}
    >
      <span style={{ fontSize: '20px', flexShrink: 0 }}>
        {icon || styles.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: '4px', color: styles.color }}>
            {title}
          </div>
        )}
        <div style={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.5 }}>
          {children}
        </div>
        {action && (
          <div style={{ marginTop: '12px' }}>
            {action}
          </div>
        )}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: 0,
            fontSize: '18px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

/**
 * Banner - Full-width banner alert
 */
export function Banner({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const variantStyles = {
    info: { background: '#2196F3' },
    success: { background: '#4CAF50' },
    warning: { background: '#FF9800' },
    error: { background: '#f44336' },
  }

  return (
    <div
      className={`banner banner-${variant} ${className}`}
      style={{
        ...variantStyles[variant],
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      <div style={{ flex: 1, textAlign: 'center' }}>
        {children}
      </div>
      {dismissible && (
        <button
          onClick={() => {
            setIsDismissed(true)
            onDismiss?.()
          }}
          aria-label="Dismiss banner"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '12px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

/**
 * Callout - Highlighted information box
 */
export function Callout({ children, emoji, title, className = '' }) {
  return (
    <div
      className={`callout ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderLeft: '4px solid #667eea',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
      }}
    >
      {emoji && (
        <span style={{ fontSize: '24px', flexShrink: 0 }}>{emoji}</span>
      )}
      <div>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{title}</div>
        )}
        <div style={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.5 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
