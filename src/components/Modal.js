/**
 * Modal Component
 * Reusable accessible modal dialog with animations and keyboard support
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
}) {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Size classes
  const sizeClasses = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '600px' },
    large: { maxWidth: '800px' },
    fullscreen: { maxWidth: '100%', height: '100%', margin: 0, borderRadius: 0 },
  }

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  // Focus trap and management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement

      // Focus the modal
      modalRef.current?.focus()

      // Add escape listener
      document.addEventListener('keydown', handleEscape)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        
        // Restore focus
        previousActiveElement.current?.focus()
      }
    }
  }, [isOpen, handleEscape])

  // Focus trap - keep focus within modal
  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out',
        padding: '20px',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onKeyDown={handleTabKey}
        className={`modal-content ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          width: '100%',
          ...sizeClasses[size],
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className="modal-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {title && (
              <h2
                id="modal-title"
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '18px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            maxHeight: size === 'fullscreen' ? 'calc(100vh - 140px)' : '60vh',
            color: '#fff',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="modal-footer"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )

  // Use portal to render modal at document root
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

/**
 * Confirm Modal - Pre-configured modal for confirmation dialogs
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: confirmVariant === 'danger' 
                ? '#f44336' 
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              cursor: isLoading ? 'wait' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>{message}</p>
    </Modal>
  )
}

/**
 * Alert Modal - Pre-configured modal for alert messages
 */
export function AlertModal({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  type = 'info',
  buttonText = 'OK',
}) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${icons[type]} ${title}`}
      size="small"
      footer={
        <button
          onClick={onClose}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {buttonText}
        </button>
      }
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>{message}</p>
    </Modal>
  )
}
