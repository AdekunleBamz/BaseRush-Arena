/**
 * Input Component
 * Reusable input field with validation and variants
 */
'use client'

import { forwardRef, useState } from 'react'

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'medium',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  const sizeStyles = {
    small: { padding: '8px 12px', fontSize: '14px' },
    medium: { padding: '12px 16px', fontSize: '16px' },
    large: { padding: '16px 20px', fontSize: '18px' },
  }

  const baseInputStyles = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: error 
      ? '2px solid #f44336' 
      : isFocused 
        ? '2px solid #667eea' 
        : '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.2s ease',
    ...sizeStyles[size],
    paddingLeft: leftIcon ? '44px' : sizeStyles[size].padding,
    paddingRight: rightIcon ? '44px' : sizeStyles[size].padding,
  }

  return (
    <div
      className={`input-wrapper ${className}`}
      style={{ width: fullWidth ? '100%' : 'auto', marginBottom: '16px' }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: error ? '#f44336' : '#fff',
          }}
        >
          {label}
          {required && <span style={{ color: '#f44336', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              opacity: 0.6,
            }}
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...baseInputStyles,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.5 : 1,
          }}
          {...props}
        />
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              opacity: 0.6,
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p
          style={{
            margin: '6px 0 0',
            fontSize: '12px',
            color: error ? '#f44336' : 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {error || helperText}
        </p>
      )}
      <style jsx>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        input:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
})

Input.displayName = 'Input'

export default Input

/**
 * NumberInput - Input optimized for numbers with increment/decrement
 */
export function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  label,
  suffix,
  ...props
}) {
  const handleIncrement = () => {
    const newValue = Math.min(Number(value) + step, max)
    onChange({ target: { value: newValue.toString() } })
  }

  const handleDecrement = () => {
    const newValue = Math.max(Number(value) - step, min)
    onChange({ target: { value: newValue.toString() } })
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={Number(value) <= min}
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: Number(value) <= min ? 0.5 : 1,
          }}
        >
          −
        </button>
        <Input
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          style={{ textAlign: 'center', flex: 1 }}
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={Number(value) >= max}
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: Number(value) >= max ? 0.5 : 1,
          }}
        >
          +
        </button>
        {suffix && <span style={{ opacity: 0.7 }}>{suffix}</span>}
      </div>
    </div>
  )
}

/**
 * SearchInput - Input with search icon and clear button
 */
export function SearchInput({ value, onChange, onClear, placeholder = 'Search...', ...props }) {
  return (
    <Input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      leftIcon="🔍"
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#fff',
              opacity: 0.6,
            }}
          >
            ✕
          </button>
        ) : null
      }
      {...props}
    />
  )
}
