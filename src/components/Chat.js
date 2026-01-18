// Chat Component
// Real-time chat interface for players to communicate during games.
'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

export default function Chat() {
  const { address, isConnected } = useAccount()
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to BaseRush Arena chat!', timestamp: Date.now() - 300000 },
    { id: 2, user: 'Player1', text: 'Good luck everyone!', timestamp: Date.now() - 240000 },
    { id: 3, user: 'Player2', text: 'Let\'s make some profits!', timestamp: Date.now() - 180000 }
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return

    const message = {
      id: Date.now(),
      user: `${address.slice(0, 6)}...${address.slice(-4)}`,
      text: newMessage.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  // Handle Enter key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="card">
      <h2>💬 Chat</h2>

      <div style={{
        height: '300px',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px'
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            marginBottom: '8px',
            padding: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '6px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {message.user}
              </span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {formatTime(message.timestamp)}
              </span>
            </div>
            <div style={{ fontSize: '14px' }}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isConnected ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
            maxLength={200}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="btn"
            style={{ padding: '10px 16px' }}
          >
            Send
          </button>
        </div>
      ) : (
        <p style={{ textAlign: 'center', opacity: 0.7, padding: '20px' }}>
          Connect wallet to join the chat
        </p>
      )}
    </div>
  )
}
