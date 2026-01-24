/**
 * Dropdown Component
 * Dropdown menu with keyboard navigation
 */
'use client'

import { useState, useRef, useEffect } from 'react'

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const alignStyles = {
    left: { left: 0 },
    right: { right: 0 },
    center: { left: '50%', transform: 'translateX(-50%)' },
  }

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            minWidth: '180px',
            background: 'rgba(30, 30, 50, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: '8px',
            zIndex: 1000,
            animation: 'dropdownIn 0.15s ease-out',
            ...alignStyles[align],
          }}
          role="menu"
        >
          {children}
          <style jsx>{`
            @keyframes dropdownIn {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

/**
 * DropdownItem - Individual menu item
 */
export function DropdownItem({
  children,
  onClick,
  icon,
  disabled = false,
  danger = false,
  className = '',
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={`dropdown-item ${className}`}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: danger ? '#f44336' : '#fff',
        fontSize: '14px',
        textAlign: 'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.background = 'rgba(255, 255, 255, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent'
      }}
    >
      {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      {children}
    </button>
  )
}

/**
 * DropdownDivider - Separator between items
 */
export function DropdownDivider() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        margin: '8px 0',
      }}
    />
  )
}

/**
 * DropdownLabel - Section label
 */
export function DropdownLabel({ children }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      {children}
    </div>
  )
}
