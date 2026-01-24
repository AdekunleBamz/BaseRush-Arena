/**
 * EmptyState Component
 * Reusable empty state displays
 */

'use client'

const presetIcons = {
  noData: '📭',
  noResults: '🔍',
  noGames: '🎮',
  noWallet: '👛',
  noTransactions: '📋',
  noAchievements: '🏆',
  noNotifications: '🔔',
  error: '⚠️',
  maintenance: '🔧',
  comingSoon: '🚀',
  offline: '📡',
}

const presetMessages = {
  noData: {
    title: 'No Data Available',
    description: 'There is nothing to display at the moment.',
  },
  noResults: {
    title: 'No Results Found',
    description: 'Try adjusting your search or filters.',
  },
  noGames: {
    title: 'No Games Yet',
    description: 'Start playing to see your games here.',
  },
  noWallet: {
    title: 'Wallet Not Connected',
    description: 'Connect your wallet to get started.',
  },
  noTransactions: {
    title: 'No Transactions',
    description: 'Your transaction history will appear here.',
  },
  noAchievements: {
    title: 'No Achievements Yet',
    description: 'Play games to unlock achievements.',
  },
  noNotifications: {
    title: 'All Caught Up!',
    description: 'You have no new notifications.',
  },
  error: {
    title: 'Something Went Wrong',
    description: 'An error occurred. Please try again.',
  },
  maintenance: {
    title: 'Under Maintenance',
    description: 'We\'re making improvements. Check back soon.',
  },
  comingSoon: {
    title: 'Coming Soon',
    description: 'This feature is being developed.',
  },
  offline: {
    title: 'You\'re Offline',
    description: 'Please check your internet connection.',
  },
}

export default function EmptyState({
  preset,
  icon,
  title,
  description,
  action,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  size = 'md',
  className = '',
}) {
  // Use preset values if provided
  const displayIcon = icon || (preset && presetIcons[preset]) || presetIcons.noData
  const displayTitle = title || (preset && presetMessages[preset]?.title) || 'Nothing Here'
  const displayDescription =
    description || (preset && presetMessages[preset]?.description) || ''

  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'text-4xl mb-3',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    md: {
      container: 'py-12 px-6',
      icon: 'text-6xl mb-4',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-5 py-2.5',
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'text-8xl mb-6',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-6 py-3 text-lg',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizes.container} ${className}`}
    >
      {/* Icon */}
      <div className={`${sizes.icon} select-none`} role="img" aria-hidden="true">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-white ${sizes.title} mb-2`}>{displayTitle}</h3>

      {/* Description */}
      {displayDescription && (
        <p className={`text-gray-400 ${sizes.description} max-w-md mb-6`}>
          {displayDescription}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <button
              onClick={action}
              className={`
                ${sizes.button}
                bg-blue-600 hover:bg-blue-500
                text-white font-medium rounded-lg
                transition-colors
              `}
            >
              {actionLabel || 'Take Action'}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction}
              className={`
                ${sizes.button}
                bg-gray-700 hover:bg-gray-600
                text-gray-200 font-medium rounded-lg
                transition-colors
              `}
            >
              {secondaryActionLabel || 'Learn More'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Illustrated Empty State with custom SVG
 */
export function IllustratedEmptyState({
  illustration,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      {/* Illustration */}
      <div className="w-48 h-48 mb-6 text-gray-600">{illustration}</div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>
      )}

      {/* Action */}
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  )
}

/**
 * Error State with retry
 */
export function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
  className = '',
}) {
  return (
    <EmptyState
      preset="error"
      title={title}
      description={error?.message || 'An unexpected error occurred. Please try again.'}
      action={onRetry}
      actionLabel="Try Again"
      className={className}
    />
  )
}

/**
 * Loading state that transitions to empty
 */
export function LoadingEmptyState({ isLoading, isEmpty, children, emptyProps }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (isEmpty) {
    return <EmptyState {...emptyProps} />
  }

  return children
}
