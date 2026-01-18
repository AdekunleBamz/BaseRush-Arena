'use client'

import { useState, useEffect } from 'react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'win',
      title: 'Round Won!',
      message: 'Congratulations! You won round #123',
      timestamp: Date.now() - 60000
    },
    {
      id: 2,
      type: 'prize',
      title: 'Prize Claimed',
      message: 'You claimed 0.045 ETH from round #122',
      timestamp: Date.now() - 120000
    }
  ])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: Date.now(),
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 most recent
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const formatTime = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getIcon = (type) => {
    switch (type) {
      case 'win': return '🎉'
      case 'prize': return '💰'
      case 'entry': return '🎮'
      case 'stake': return '💎'
      default: return '📢'
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'win': return '#4CAF50'
      case 'prize': return '#FF9800'
      case 'entry': return '#2196F3'
      case 'stake': return '#9C27B0'
      default: return '#607D8B'
    }
  }

  // Expose addNotification for parent components
  useEffect(() => {
    window.addNotification = addNotification
    return () => {
      delete window.addNotification
    }
  }, [])

  return (
    <div className="card">
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }}>
          No notifications yet
        </p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                marginBottom: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                borderLeft: `4px solid ${getColor(notification.type)}`
              }}
            >
              <span style={{ fontSize: '24px' }}>
                {getIcon(notification.type)}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    color: getColor(notification.type)
                  }}>
                    {notification.title}
                  </h4>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>
                    {formatTime(notification.timestamp)}
                  </span>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  opacity: 0.9
                }}>
                  {notification.message}
                </p>
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                  opacity: 0.6
                }}
                onMouseOver={(e) => e.target.style.opacity = '1'}
                onMouseOut={(e) => e.target.style.opacity = '0.6'}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setNotifications([])}
        className="btn"
        style={{
          width: '100%',
          marginTop: '16px',
          opacity: notifications.length === 0 ? 0.5 : 1
        }}
        disabled={notifications.length === 0}
      >
        Clear All
      </button>
    </div>
  )
}
