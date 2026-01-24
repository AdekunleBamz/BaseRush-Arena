/**
 * Spinner Component
 * Animated loading spinners with multiple variants
 */

'use client'

export const spinnerVariants = {
  ring: 'ring',
  dots: 'dots',
  pulse: 'pulse',
  bars: 'bars',
  orbit: 'orbit',
}

export const spinnerSizes = {
  xs: { container: 'w-4 h-4', ring: 'border-2', dot: 'w-1 h-1' },
  sm: { container: 'w-6 h-6', ring: 'border-2', dot: 'w-1.5 h-1.5' },
  md: { container: 'w-8 h-8', ring: 'border-3', dot: 'w-2 h-2' },
  lg: { container: 'w-12 h-12', ring: 'border-4', dot: 'w-3 h-3' },
  xl: { container: 'w-16 h-16', ring: 'border-4', dot: 'w-4 h-4' },
}

/**
 * Ring Spinner
 */
function RingSpinner({ size = 'md', color = 'blue' }) {
  const sizeConfig = spinnerSizes[size]
  
  const colorClasses = {
    blue: 'border-blue-500/30 border-t-blue-500',
    green: 'border-green-500/30 border-t-green-500',
    red: 'border-red-500/30 border-t-red-500',
    yellow: 'border-yellow-500/30 border-t-yellow-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-500/30 border-t-gray-500',
  }

  return (
    <div
      className={`
        ${sizeConfig.container}
        ${sizeConfig.ring}
        ${colorClasses[color] || colorClasses.blue}
        rounded-full animate-spin
      `}
    />
  )
}

/**
 * Dots Spinner
 */
function DotsSpinner({ size = 'md', color = 'blue' }) {
  const sizeConfig = spinnerSizes[size]
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
  }

  return (
    <div className={`flex items-center gap-1 ${sizeConfig.container}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${sizeConfig.dot}
            ${colorClasses[color] || colorClasses.blue}
            rounded-full animate-bounce
          `}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

/**
 * Pulse Spinner
 */
function PulseSpinner({ size = 'md', color = 'blue' }) {
  const sizeConfig = spinnerSizes[size]
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
  }

  return (
    <div className={`relative ${sizeConfig.container}`}>
      <div
        className={`
          absolute inset-0
          ${colorClasses[color] || colorClasses.blue}
          rounded-full animate-ping opacity-75
        `}
      />
      <div
        className={`
          absolute inset-0
          ${colorClasses[color] || colorClasses.blue}
          rounded-full animate-pulse
        `}
      />
    </div>
  )
}

/**
 * Bars Spinner
 */
function BarsSpinner({ size = 'md', color = 'blue' }) {
  const sizeConfig = spinnerSizes[size]
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
  }

  return (
    <div className={`flex items-center gap-0.5 ${sizeConfig.container}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`
            w-1 h-full
            ${colorClasses[color] || colorClasses.blue}
            rounded-full
          `}
          style={{
            animation: 'barScale 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes barScale {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Orbit Spinner
 */
function OrbitSpinner({ size = 'md', color = 'blue' }) {
  const sizeConfig = spinnerSizes[size]
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
  }

  return (
    <div className={`relative ${sizeConfig.container}`}>
      <div
        className={`
          absolute inset-0 rounded-full border-2 border-gray-700
        `}
      />
      <div
        className={`
          absolute ${sizeConfig.dot} rounded-full
          ${colorClasses[color] || colorClasses.blue}
        `}
        style={{
          animation: 'orbit 1s linear infinite',
          top: '0',
          left: '50%',
          marginLeft: '-4px',
          marginTop: '-4px',
        }}
      />
      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(150%) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(150%) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Main Spinner Component
 */
export default function Spinner({
  variant = 'ring',
  size = 'md',
  color = 'blue',
  label,
  className = '',
}) {
  const spinnerComponents = {
    ring: RingSpinner,
    dots: DotsSpinner,
    pulse: PulseSpinner,
    bars: BarsSpinner,
    orbit: OrbitSpinner,
  }

  const SpinnerComponent = spinnerComponents[variant] || RingSpinner

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label || 'Loading'}
    >
      <SpinnerComponent size={size} color={color} />
      {label && <span className="text-sm text-gray-400">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ message = 'Loading...', variant = 'ring' }) {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Spinner variant={variant} size="xl" />
        <p className="text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  )
}

/**
 * Inline loading indicator
 */
export function InlineLoading({ message = 'Loading' }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-400">
      <Spinner variant="ring" size="xs" />
      <span>{message}</span>
    </span>
  )
}
