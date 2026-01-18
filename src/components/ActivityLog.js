// ActivityLog Component
// Displays recent user activities and transactions
'use client'

import { useState, useEffect } from 'react'

export default function ActivityLog() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'entry',
      action: 'Entered Game',
      details: 'Round #124 with 0.0001 ETH',
      timestamp: Date.now() - 300000,
      txHash: '0x1234...abcd'
    },
    {
      id: 2,
      type: 'win',
      action: 'Round Won',
      details: 'Prize: 0.045 ETH claimed',
      timestamp: Date.now() - 600000,
      txHash: '0x5678...efgh'
    },
    {
      id: 3,
      type: 'stake',
      action: 'Staked Rewards',
      details: '0.002 ETH staked for rewards',
      timestamp: Date.now() - 900000,
      txHash: '0x9abc...ijkl'
    }
  ])

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: Date.now(),
      ...activity
    }
    setActivities(prev => [newActivity, ...prev.slice(0, 19)]) // Keep only 20 most recent
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
      case 'win': return '🏆'
      case 'entry': return '🎮'
      case 'stake': return '💎'
      case 'claim': return '💰'
      default: return '📝'
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'win': return '#4CAF50'
      case 'entry': return '#2196F3'
      case 'stake': return '#9C27B0'
      case 'claim': return '#FF9800'
      default: return '#607D8B'
    }
  }

  // Expose addActivity for parent components
  useEffect(() => {
    window.addActivity = addActivity
    return () => {
      delete window.addActivity
    }
  }, [])

  return (
    <div className="card">
      <h2>📊 Activity Log</h2>

      {activities.length === 0 ? (
        <p style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }}>
          No recent activity
        </p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {activities.map(activity => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                marginBottom: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                borderLeft: `4px solid ${getColor(activity.type)}`
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {getIcon(activity.type)}
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
                    fontSize: '14px',
                    color: getColor(activity.type)
                  }}>
                    {activity.action}
                  </h4>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>
                    {formatTime(activity.timestamp)}
                  </span>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  opacity: 0.9
                }}>
                  {activity.details}
                </p>

                {activity.txHash && (
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '11px',
                    opacity: 0.6,
                    fontFamily: 'monospace'
                  }}>
                    TX: {activity.txHash}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setActivities([])}
        className="btn"
        style={{
          width: '100%',
          marginTop: '16px',
          opacity: activities.length === 0 ? 0.5 : 1
        }}
        disabled={activities.length === 0}
      >
        Clear Log ({activities.length})
      </button>
    </div>
  )
}