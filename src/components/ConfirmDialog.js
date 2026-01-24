/**
 * ConfirmDialog Component
 * Modal confirmation dialogs for critical actions
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Dialog variants with predefined styles
 */
const dialogVariants = {
  danger: {
    icon: '⚠️',
    iconBg: 'bg-red-500/20',
    confirmButton: 'bg-red-600 hover:bg-red-500 text-white',
  },
  warning: {
    icon: '⚡',
    iconBg: 'bg-yellow-500/20',
    confirmButton: 'bg-yellow-600 hover:bg-yellow-500 text-black',
  },
  info: {
    icon: 'ℹ️',
    iconBg: 'bg-blue-500/20',
    confirmButton: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  success: {
    icon: '✅',
    iconBg: 'bg-green-500/20',
    confirmButton: 'bg-green-600 hover:bg-green-500 text-white',
  },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon,
  children,
}) {
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)

  const variantStyles = dialogVariants[variant] || dialogVariants.danger

  // Handle escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    },
    [onClose, isLoading]
  )

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)

      // Focus confirm button
      setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 100)
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full ${variantStyles.iconBg} flex items-center justify-center text-3xl`}
          >
            {icon || variantStyles.icon}
          </div>
        </div>

        {/* Title */}
        <h2
          id="dialog-title"
          className="text-xl font-bold text-white text-center mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="dialog-description"
          className="text-gray-400 text-center mb-6"
        >
          {message}
        </p>

        {/* Custom content */}
        {children && <div className="mb-6">{children}</div>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 ${variantStyles.confirmButton} font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Delete Confirmation Dialog
 */
export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this item',
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      variant="danger"
      title="Delete Confirmation"
      message={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      confirmLabel="Delete"
      isLoading={isLoading}
      icon="🗑️"
    />
  )
}

/**
 * Transaction Confirmation Dialog
 */
export function TransactionConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  action = 'transaction',
  amount,
  details = [],
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      variant="warning"
      title={`Confirm ${action}`}
      message="Please review the details before confirming."
      confirmLabel={`Confirm ${action}`}
      isLoading={isLoading}
      icon="💰"
    >
      <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
        {amount && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Amount</span>
            <span className="font-mono font-semibold text-white">{amount}</span>
          </div>
        )}
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-400">{detail.label}</span>
            <span className="text-white">{detail.value}</span>
          </div>
        ))}
      </div>
    </ConfirmDialog>
  )
}

/**
 * Disconnect Wallet Confirmation
 */
export function DisconnectConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      variant="info"
      title="Disconnect Wallet"
      message="Are you sure you want to disconnect your wallet? You'll need to reconnect to use the app."
      confirmLabel="Disconnect"
      isLoading={isLoading}
      icon="👛"
    />
  )
}
