/**
 * Tabs Component
 * Tab navigation with content panels
 */
'use client'

import { useState, createContext, useContext } from 'react'

const TabContext = createContext(null)

export function Tabs({ children, defaultValue, value, onChange, variant = 'default', className = '' }) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  
  const activeValue = value !== undefined ? value : internalValue
  
  const handleChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <TabContext.Provider value={{ activeValue, onChange: handleChange, variant }}>
      <div className={`tabs tabs-${variant} ${className}`}>
        {children}
      </div>
    </TabContext.Provider>
  )
}

export function TabList({ children, className = '' }) {
  const { variant } = useContext(TabContext)

  const variantStyles = {
    default: {
      display: 'flex',
      gap: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '4px',
      borderRadius: '12px',
    },
    underline: {
      display: 'flex',
      gap: '24px',
      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    },
    pills: {
      display: 'flex',
      gap: '8px',
    },
  }

  return (
    <div
      role="tablist"
      className={`tab-list ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </div>
  )
}

export function Tab({ value, children, disabled = false, className = '' }) {
  const { activeValue, onChange, variant } = useContext(TabContext)
  const isActive = activeValue === value

  const baseStyles = {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    outline: 'none',
  }

  const variantStyles = {
    default: {
      borderRadius: '8px',
      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    },
    underline: {
      paddingBottom: '12px',
      marginBottom: '-2px',
      borderBottom: isActive ? '2px solid #667eea' : '2px solid transparent',
    },
    pills: {
      borderRadius: '999px',
      background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.1)',
    },
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={`tab ${isActive ? 'tab-active' : ''} ${className}`}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {children}
    </button>
  )
}

export function TabPanels({ children, className = '' }) {
  return (
    <div className={`tab-panels ${className}`} style={{ marginTop: '16px' }}>
      {children}
    </div>
  )
}

export function TabPanel({ value, children, className = '' }) {
  const { activeValue } = useContext(TabContext)

  if (activeValue !== value) return null

  return (
    <div
      role="tabpanel"
      className={`tab-panel ${className}`}
      style={{
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
