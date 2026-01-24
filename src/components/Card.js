/**
 * Card Component
 * Reusable card container with variants and animations
 */
'use client'

import { forwardRef } from 'react'

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'medium',
  hoverable = true,
  clickable = false,
  animated = true,
  className = '',
  onClick,
  ...props
}, ref) => {
  const variantStyles = {
    default: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    elevated: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    outlined: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.3)',
    },
    filled: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    success: {
      background: 'rgba(76, 175, 80, 0.2)',
      border: '1px solid rgba(76, 175, 80, 0.4)',
    },
    warning: {
      background: 'rgba(255, 152, 0, 0.2)',
      border: '1px solid rgba(255, 152, 0, 0.4)',
    },
    danger: {
      background: 'rgba(244, 67, 54, 0.2)',
      border: '1px solid rgba(244, 67, 54, 0.4)',
    },
  }

  const paddingStyles = {
    none: '0',
    small: '16px',
    medium: '24px',
    large: '32px',
  }

  const baseStyles = {
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: clickable ? 'pointer' : 'default',
    padding: paddingStyles[padding],
    ...variantStyles[variant],
  }

  return (
    <div
      ref={ref}
      className={`card card-${variant} ${className}`}
      onClick={clickable ? onClick : undefined}
      style={baseStyles}
      {...props}
    >
      {children}
      <style jsx>{`
        .card {
          ${animated ? 'animation: fadeInUp 0.6s ease-out;' : ''}
        }
        ${hoverable ? `
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        ` : ''}
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
})

Card.displayName = 'Card'

export default Card

/**
 * CardHeader - Header section for card
 */
export function CardHeader({ children, title, subtitle, action, className = '' }) {
  return (
    <div
      className={`card-header ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div>
        {title && (
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '14px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className="card-action">{action}</div>}
    </div>
  )
}

/**
 * CardBody - Main content area for card
 */
export function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  )
}

/**
 * CardFooter - Footer section for card
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`card-footer ${className}`}
      style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {children}
    </div>
  )
}

/**
 * StatCard - Card optimized for displaying statistics
 */
export function StatCard({ label, value, icon, change, changeType, loading = false }) {
  return (
    <Card variant="default" padding="medium" hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>{label}</div>
          {loading ? (
            <div
              style={{
                width: '60px',
                height: '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ) : (
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{value}</div>
          )}
          {change !== undefined && (
            <div
              style={{
                fontSize: '12px',
                marginTop: '4px',
                color: changeType === 'positive' ? '#4CAF50' : changeType === 'negative' ? '#f44336' : 'inherit',
              }}
            >
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''} {change}
            </div>
          )}
        </div>
        {icon && (
          <div style={{ fontSize: '32px', opacity: 0.5 }}>{icon}</div>
        )}
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Card>
  )
}
