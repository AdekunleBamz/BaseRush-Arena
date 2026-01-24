/**
 * Progress Component
 * Visual progress indicators for loading and completion states
 */
'use client'

export default function Progress({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'medium',
  showLabel = false,
  animated = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const variantStyles = {
    default: 'linear-gradient(90deg, #667eea, #764ba2)',
    success: 'linear-gradient(90deg, #4CAF50, #45a049)',
    warning: 'linear-gradient(90deg, #FF9800, #F57C00)',
    danger: 'linear-gradient(90deg, #f44336, #d32f2f)',
    info: 'linear-gradient(90deg, #2196F3, #1976D2)',
  }

  const sizeStyles = {
    small: '4px',
    medium: '8px',
    large: '12px',
  }

  return (
    <div className={`progress-wrapper ${className}`} style={{ width: '100%' }}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          width: '100%',
          height: sizeStyles[size],
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: variantStyles[variant],
            borderRadius: '999px',
            transition: animated ? 'width 0.3s ease' : 'none',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            textAlign: 'right',
            opacity: 0.7,
          }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

/**
 * CircularProgress - Circular progress indicator
 */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 60,
  strokeWidth = 4,
  variant = 'default',
  showLabel = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: '#667eea',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#f44336',
    info: '#2196F3',
  }

  return (
    <div
      className={`circular-progress ${className}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            fontSize: size * 0.2,
            fontWeight: 600,
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

/**
 * Spinner - Loading spinner
 */
export function Spinner({ size = 'medium', color = '#fff', className = '' }) {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 40,
  }

  const s = sizeMap[size] || size

  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: s,
        height: s,
        border: `${s / 8}px solid rgba(255, 255, 255, 0.2)`,
        borderTop: `${s / 8}px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * StepProgress - Multi-step progress indicator
 */
export function StepProgress({ steps, currentStep, className = '' }) {
  return (
    <div
      className={`step-progress ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  background: isCompleted
                    ? '#4CAF50'
                    : isCurrent
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: isCurrent ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  opacity: isCurrent ? 1 : 0.6,
                  textAlign: 'center',
                }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: isCompleted
                    ? '#4CAF50'
                    : 'rgba(255, 255, 255, 0.1)',
                  margin: '0 8px',
                  marginBottom: '28px',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
