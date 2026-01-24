/**
 * NotificationBell Component
 * Notification center with badge and dropdown
 */

'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * Format time ago
 */
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}

/**
 * Notification type configs
 */
const notificationTypes = {
  win: {
    icon: '🎉',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  loss: {
    icon: '😔',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  reward: {
    icon: '💰',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  achievement: {
    icon: '🏆',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  system: {
    icon: '🔔',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  staking: {
    icon: '💎',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
}

export default function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllRead,
  onClearAll,
  onNotificationClick,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter notifications
  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id)
    }
    onNotificationClick?.(notification)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 p-2 border-b border-gray-700 overflow-x-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'win', label: '🎉 Wins' },
              { value: 'reward', label: '💰 Rewards' },
              { value: 'achievement', label: '🏆 Achievements' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-4xl mb-2">🔕</div>
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {filteredNotifications.map((notification) => {
                  const config = notificationTypes[notification.type] || notificationTypes.system

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-gray-700/30 transition-colors ${
                        !notification.read ? 'bg-gray-700/20' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center text-xl flex-shrink-0`}
                        >
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-medium ${config.color}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-3 border-t border-gray-700 text-center">
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
