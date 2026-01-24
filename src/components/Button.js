/**
 * Button Component
 * Reusable button with variants, sizes, and loading state
 */
'use client'

import { forwardRef } from 'react'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className = '',
  ...props
}, ref) => {
  // Variant styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: '#fff',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    danger: {
      background: '#f44336',
      border: 'none',
      color: '#fff',
    },
    success: {
      background: '#4CAF50',
      border: 'none',
      color: '#fff',
    },
    warning: {
      background: '#FF9800',
      border: 'none',
      color: '#fff',
    },
  }

  // Size styles
  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '12px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
      borderRadius: '14px',
    },
  }

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : loading ? 0.8 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles[variant],
    ...sizeStyles[size],
  }

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`btn btn-${variant} btn-${size} ${className}`}
      style={baseStyles}
      {...props}
    >
      {loading ? (
        <>
          <span
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid #fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </button>
  )
})

Button.displayName = 'Button'

export default Button

/**
 * IconButton - Button with icon only
 */
export const IconButton = forwardRef(({
  icon,
  size = 'medium',
  variant = 'ghost',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const sizeMap = {
    small: { width: '32px', height: '32px', fontSize: '14px' },
    medium: { width: '40px', height: '40px', fontSize: '18px' },
    large: { width: '48px', height: '48px', fontSize: '22px' },
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      aria-label={ariaLabel}
      style={{
        ...sizeMap[size],
        padding: 0,
        borderRadius: '50%',
      }}
      {...props}
    >
      {icon}
    </Button>
  )
})

IconButton.displayName = 'IconButton'

/**
 * ButtonGroup - Group of buttons
 */
export function ButtonGroup({ children, direction = 'horizontal', gap = '8px' }) {
  return (
    <div
      className="button-group"
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap,
      }}
    >
      {children}
    </div>
  )
}
