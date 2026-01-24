/**
 * Toast Component
 * Displays temporary notification messages
 */
'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'

// Toast Context
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      duration: 5000,
      ...toast,
    }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options })
  }, [addToast])

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options })
  }, [addToast])

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options })
  }, [addToast])

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container
function ToastContainer({ toasts, removeToast }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  )
}

// Individual Toast
function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false)

  const typeStyles = {
    success: {
      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
      icon: '✓',
    },
    error: {
      background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(211, 47, 47, 0.95))',
      icon: '✕',
    },
    warning: {
      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(245, 124, 0, 0.95))',
      icon: '⚠',
    },
    info: {
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(25, 118, 210, 0.95))',
      icon: 'ℹ',
    },
  }

  const style = typeStyles[toast.type] || typeStyles.info

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 200)
  }

  return (
    <div
      style={{
        ...style,
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        color: '#fff',
        pointerEvents: 'auto',
        animation: isExiting ? 'slideOut 0.2s ease-out' : 'slideIn 0.3s ease-out',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{toast.title}</div>
        )}
        <div style={{ fontSize: '14px', opacity: 0.9 }}>{toast.message}</div>
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick?.()
              handleClose()
            }}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '18px',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
