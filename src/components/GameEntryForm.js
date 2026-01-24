/**
 * Game Entry Form Component
 * Form for entering the prediction game
 */

'use client'

import React, { memo, useState, useCallback, useMemo } from 'react'

/**
 * Option selector button
 */
const OptionButton = memo(function OptionButton({
  option,
  selected,
  disabled,
  onClick,
}) {
  const optionConfig = {
    up: {
      icon: '📈',
      label: 'UP',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    down: {
      icon: '📉',
      label: 'DOWN',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
  }

  const config = optionConfig[option] || optionConfig.up

  return (
    <button
      className={`option-button ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      style={{
        '--option-color': config.color,
        '--option-gradient': config.gradient,
      }}
      onClick={() => onClick?.(option)}
      disabled={disabled}
    >
      <span className="option-icon">{config.icon}</span>
      <span className="option-label">{config.label}</span>
      
      <style jsx>{`
        .option-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .option-button:hover:not(.disabled) {
          border-color: var(--option-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        .option-button.selected {
          background: var(--option-gradient);
          border-color: transparent;
          color: white;
        }
        .option-button.selected:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px color-mix(in srgb, var(--option-color) 40%, transparent);
        }
        .option-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .option-icon {
          font-size: 3rem;
        }
        .option-label {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
      `}</style>
    </button>
  )
})

/**
 * Amount input with quick select
 */
const AmountInput = memo(function AmountInput({
  value,
  onChange,
  min = 0.001,
  max = 10,
  quickAmounts = [0.01, 0.05, 0.1, 0.5],
  balance,
  disabled,
}) {
  const handleQuickSelect = (amount) => {
    onChange(amount)
  }

  const handleMaxClick = () => {
    if (balance) {
      onChange(Math.min(parseFloat(balance), max))
    }
  }

  const isValidAmount = value >= min && value <= max && (!balance || value <= parseFloat(balance))

  return (
    <div className="amount-input-container">
      <div className="amount-header">
        <label className="amount-label">Entry Amount</label>
        {balance && (
          <span className="balance-display">
            Balance: {parseFloat(balance).toFixed(4)} ETH
            <button className="max-btn" onClick={handleMaxClick}>MAX</button>
          </span>
        )}
      </div>

      <div className={`amount-input-wrapper ${!isValidAmount && value ? 'invalid' : ''}`}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step="0.001"
          disabled={disabled}
          placeholder="0.00"
        />
        <span className="currency-label">ETH</span>
      </div>

      <div className="quick-amounts">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            className={`quick-btn ${value === amount ? 'active' : ''}`}
            onClick={() => handleQuickSelect(amount)}
            disabled={disabled}
          >
            {amount} ETH
          </button>
        ))}
      </div>

      {!isValidAmount && value > 0 && (
        <span className="amount-error">
          {value < min ? `Minimum ${min} ETH` :
           value > max ? `Maximum ${max} ETH` :
           balance && value > parseFloat(balance) ? 'Insufficient balance' : ''}
        </span>
      )}

      <style jsx>{`
        .amount-input-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .amount-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .amount-label {
          font-weight: 600;
          color: var(--text-color);
        }
        .balance-display {
          font-size: 0.85rem;
          color: var(--secondary-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .max-btn {
          padding: 4px 8px;
          background: var(--primary-color);
          border: none;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .max-btn:hover {
          transform: scale(1.05);
        }
        .amount-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .amount-input-wrapper:focus-within {
          border-color: var(--primary-color);
        }
        .amount-input-wrapper.invalid {
          border-color: #ef4444;
        }
        .amount-input-wrapper input {
          flex: 1;
          padding: 16px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--text-color);
          outline: none;
        }
        .amount-input-wrapper input::placeholder {
          color: var(--secondary-text);
        }
        .currency-label {
          padding: 16px;
          font-weight: 600;
          color: var(--secondary-text);
        }
        .quick-amounts {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .quick-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--secondary-text);
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-btn:hover:not(:disabled) {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .quick-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: #000;
        }
        .quick-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .amount-error {
          font-size: 0.85rem;
          color: #ef4444;
        }
      `}</style>
    </div>
  )
})

/**
 * Multi-entry selector
 */
const MultiEntrySelector = memo(function MultiEntrySelector({
  value,
  onChange,
  maxEntries = 10,
  disabled,
}) {
  return (
    <div className="multi-entry-selector">
      <div className="multi-header">
        <label className="multi-label">Number of Entries</label>
        <span className="multi-multiplier">{value}x multiplier</span>
      </div>

      <div className="multi-controls">
        <button
          className="control-btn"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={disabled || value <= 1}
        >
          -
        </button>
        <span className="entry-count">{value}</span>
        <button
          className="control-btn"
          onClick={() => onChange(Math.min(maxEntries, value + 1))}
          disabled={disabled || value >= maxEntries}
        >
          +
        </button>
      </div>

      <input
        type="range"
        min="1"
        max={maxEntries}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="entry-slider"
      />

      <style jsx>{`
        .multi-entry-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .multi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .multi-label {
          font-weight: 600;
          color: var(--text-color);
        }
        .multi-multiplier {
          font-size: 0.85rem;
          color: var(--primary-color);
        }
        .multi-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .control-btn {
          width: 40px;
          height: 40px;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.2s;
        }
        .control-btn:hover:not(:disabled) {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .control-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .entry-count {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-color);
          min-width: 60px;
          text-align: center;
        }
        .entry-slider {
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          background: var(--border-color);
          border-radius: 4px;
          outline: none;
        }
        .entry-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: var(--primary-color);
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
})

/**
 * Entry summary
 */
const EntrySummary = memo(function EntrySummary({
  option,
  amount,
  entries,
  estimatedGas,
}) {
  const totalCost = amount * entries
  const potentialWin = totalCost * 1.95 // 95% return after house edge

  return (
    <div className="entry-summary">
      <h4 className="summary-title">Entry Summary</h4>
      
      <div className="summary-row">
        <span className="label">Prediction</span>
        <span className="value prediction">
          {option === 'up' ? '📈 UP' : option === 'down' ? '📉 DOWN' : '—'}
        </span>
      </div>

      <div className="summary-row">
        <span className="label">Amount per entry</span>
        <span className="value">{amount.toFixed(4)} ETH</span>
      </div>

      <div className="summary-row">
        <span className="label">Number of entries</span>
        <span className="value">{entries}x</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-row total">
        <span className="label">Total Cost</span>
        <span className="value">{totalCost.toFixed(4)} ETH</span>
      </div>

      <div className="summary-row potential">
        <span className="label">Potential Win</span>
        <span className="value win">{potentialWin.toFixed(4)} ETH</span>
      </div>

      {estimatedGas && (
        <div className="summary-row gas">
          <span className="label">Estimated Gas</span>
          <span className="value">{estimatedGas} ETH</span>
        </div>
      )}

      <style jsx>{`
        .entry-summary {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
        }
        .summary-title {
          margin: 0 0 16px;
          font-size: 0.9rem;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        .label {
          color: var(--secondary-text);
        }
        .value {
          font-weight: 600;
          color: var(--text-color);
        }
        .value.prediction {
          font-size: 1.1rem;
        }
        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: 8px 0;
        }
        .summary-row.total {
          font-size: 1.1rem;
        }
        .value.win {
          color: var(--primary-color);
          font-size: 1.1rem;
        }
        .summary-row.gas {
          font-size: 0.85rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
})

/**
 * Main Game Entry Form component
 */
export function GameEntryForm({
  onSubmit,
  isLoading = false,
  balance,
  minAmount = 0.001,
  maxAmount = 10,
  maxEntries = 10,
  disabled = false,
  className = '',
  ...props
}) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [amount, setAmount] = useState(0.01)
  const [entries, setEntries] = useState(1)

  const totalCost = amount * entries
  const isValid = selectedOption && amount >= minAmount && amount <= maxAmount && 
                  (!balance || totalCost <= parseFloat(balance))

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!isValid || isLoading) return

    onSubmit?.({
      option: selectedOption,
      amount,
      entries,
      totalCost,
    })
  }, [selectedOption, amount, entries, totalCost, isValid, isLoading, onSubmit])

  return (
    <form 
      className={`game-entry-form ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="form-section">
        <h3 className="section-title">Make Your Prediction</h3>
        <div className="option-buttons">
          <OptionButton
            option="up"
            selected={selectedOption === 'up'}
            disabled={disabled}
            onClick={setSelectedOption}
          />
          <OptionButton
            option="down"
            selected={selectedOption === 'down'}
            disabled={disabled}
            onClick={setSelectedOption}
          />
        </div>
      </div>

      <div className="form-section">
        <AmountInput
          value={amount}
          onChange={setAmount}
          min={minAmount}
          max={maxAmount}
          balance={balance}
          disabled={disabled}
        />
      </div>

      <div className="form-section">
        <MultiEntrySelector
          value={entries}
          onChange={setEntries}
          maxEntries={maxEntries}
          disabled={disabled}
        />
      </div>

      <EntrySummary
        option={selectedOption}
        amount={amount}
        entries={entries}
      />

      <button
        type="submit"
        className={`submit-btn ${isLoading ? 'loading' : ''}`}
        disabled={!isValid || isLoading || disabled}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Processing...
          </>
        ) : (
          <>Enter Game ({totalCost.toFixed(4)} ETH)</>
        )}
      </button>

      <style jsx>{`
        .game-entry-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-title {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-color);
        }
        .option-buttons {
          display: flex;
          gap: 16px;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 18px 32px;
          background: linear-gradient(135deg, var(--primary-color), #00cc6a);
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #000;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .submit-btn.loading {
          background: var(--card-bg);
          color: var(--text-color);
          border: 2px solid var(--border-color);
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}

export { OptionButton, AmountInput, MultiEntrySelector, EntrySummary }
export default GameEntryForm
