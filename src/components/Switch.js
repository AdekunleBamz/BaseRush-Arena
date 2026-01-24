/**
 * Switch Component
 * Toggle switch for boolean settings
 */
'use client'

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  description,
  className = '',
}) {
  const sizeStyles = {
    small: { width: 36, height: 20, knobSize: 14 },
    medium: { width: 44, height: 24, knobSize: 18 },
    large: { width: 52, height: 28, knobSize: 22 },
  }

  const s = sizeStyles[size]

  return (
    <label
      className={`switch-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => !disabled && onChange?.(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            !disabled && onChange?.(!checked)
          }
        }}
        style={{
          width: s.width,
          height: s.height,
          borderRadius: s.height / 2,
          background: checked
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : 'rgba(255, 255, 255, 0.2)',
          position: 'relative',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: s.knobSize,
            height: s.knobSize,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: (s.height - s.knobSize) / 2,
            left: checked ? s.width - s.knobSize - (s.height - s.knobSize) / 2 : (s.height - s.knobSize) / 2,
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>
      {(label || description) && (
        <div style={{ flex: 1 }}>
          {label && (
            <div style={{ fontWeight: 500, marginBottom: description ? '4px' : 0 }}>
              {label}
            </div>
          )}
          {description && (
            <div style={{ fontSize: '13px', opacity: 0.7 }}>
              {description}
            </div>
          )}
        </div>
      )}
    </label>
  )
}

/**
 * Checkbox - Standard checkbox component
 */
export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  indeterminate = false,
  className = '',
}) {
  return (
    <label
      className={`checkbox-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        tabIndex={0}
        onClick={() => !disabled && onChange?.(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            !disabled && onChange?.(!checked)
          }
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: checked || indeterminate
            ? 'none'
            : '2px solid rgba(255, 255, 255, 0.4)',
          background: checked || indeterminate
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && !checked && (
          <div style={{ width: 10, height: 2, background: '#fff', borderRadius: 1 }} />
        )}
      </div>
      {label && <span>{label}</span>}
    </label>
  )
}

/**
 * Radio - Radio button component
 */
export function Radio({
  checked = false,
  onChange,
  disabled = false,
  label,
  name,
  value,
  className = '',
}) {
  return (
    <label
      className={`radio-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        role="radio"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => !disabled && onChange?.(value)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            !disabled && onChange?.(value)
          }
        }}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: checked ? 'none' : '2px solid rgba(255, 255, 255, 0.4)',
          background: checked
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {checked && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
        )}
      </div>
      {label && <span>{label}</span>}
    </label>
  )
}

/**
 * RadioGroup - Group of radio buttons
 */
export function RadioGroup({ value, onChange, options, name, direction = 'vertical' }) {
  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: '12px',
      }}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={onChange}
          disabled={option.disabled}
        />
      ))}
    </div>
  )
}
