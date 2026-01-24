/**
 * Staking Panel Component
 * Interface for staking, unstaking, and claiming rewards
 */

'use client'

import React, { memo, useState, useCallback } from 'react'

/**
 * Staking stats display
 */
const StakingStats = memo(function StakingStats({
  stakedAmount,
  pendingRewards,
  apr,
  totalStaked,
}) {
  return (
    <div className="staking-stats">
      <div className="stat-item main">
        <span className="stat-label">Your Staked Amount</span>
        <span className="stat-value">{parseFloat(stakedAmount || 0).toFixed(4)} ETH</span>
      </div>

      <div className="stat-row">
        <div className="stat-item">
          <span className="stat-label">Pending Rewards</span>
          <span className="stat-value rewards">{parseFloat(pendingRewards || 0).toFixed(6)} ETH</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Current APR</span>
          <span className="stat-value apr">{apr || 0}%</span>
        </div>
      </div>

      {totalStaked && (
        <div className="stat-item total">
          <span className="stat-label">Total Value Staked</span>
          <span className="stat-value">{parseFloat(totalStaked).toFixed(2)} ETH</span>
        </div>
      )}

      <style jsx>{`
        .staking-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-item.main {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .stat-row {
          display: flex;
          gap: 24px;
        }
        .stat-row .stat-item {
          flex: 1;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--secondary-text);
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--text-color);
        }
        .stat-item.main .stat-value {
          font-size: 2rem;
        }
        .stat-value.rewards {
          color: var(--primary-color);
        }
        .stat-value.apr {
          color: #10b981;
        }
        .stat-item.total {
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
        .stat-item.total .stat-value {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  )
})

/**
 * Action tabs
 */
const ActionTabs = memo(function ActionTabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'stake', label: 'Stake', icon: '📥' },
    { id: 'unstake', label: 'Unstake', icon: '📤' },
    { id: 'claim', label: 'Claim', icon: '💰' },
  ]

  return (
    <div className="action-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}

      <style jsx>{`
        .action-tabs {
          display: flex;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px;
        }
        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--secondary-text);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
        }
        .tab-btn.active {
          background: var(--primary-color);
          color: #000;
        }
        .tab-icon {
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  )
})

/**
 * Amount input for staking
 */
const StakeAmountInput = memo(function StakeAmountInput({
  value,
  onChange,
  max,
  label = 'Amount',
  disabled,
}) {
  return (
    <div className="stake-amount-input">
      <div className="input-header">
        <label>{label}</label>
        {max && (
          <button 
            className="max-btn" 
            onClick={() => onChange(max)}
            disabled={disabled}
          >
            MAX
          </button>
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          disabled={disabled}
          step="0.001"
        />
        <span className="currency">ETH</span>
      </div>

      {max && (
        <div className="balance-info">
          Available: {parseFloat(max).toFixed(4)} ETH
        </div>
      )}

      <style jsx>{`
        .stake-amount-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .input-header label {
          font-weight: 600;
          color: var(--text-color);
        }
        .max-btn {
          padding: 4px 8px;
          background: rgba(0, 255, 136, 0.2);
          border: none;
          border-radius: 4px;
          color: var(--primary-color);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .max-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: #000;
        }
        .max-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .input-wrapper:focus-within {
          border-color: var(--primary-color);
        }
        .input-wrapper input {
          flex: 1;
          padding: 16px;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--text-color);
          outline: none;
        }
        .input-wrapper input::placeholder {
          color: var(--secondary-text);
        }
        .currency {
          padding: 16px;
          font-weight: 600;
          color: var(--secondary-text);
        }
        .balance-info {
          font-size: 0.85rem;
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
})

/**
 * Reward projection
 */
const RewardProjection = memo(function RewardProjection({ amount, apr }) {
  const daily = (amount * apr / 100 / 365)
  const weekly = daily * 7
  const monthly = daily * 30
  const yearly = amount * apr / 100

  return (
    <div className="reward-projection">
      <h4 className="projection-title">Estimated Rewards</h4>
      <div className="projection-grid">
        <div className="projection-item">
          <span className="label">Daily</span>
          <span className="value">{daily.toFixed(6)} ETH</span>
        </div>
        <div className="projection-item">
          <span className="label">Weekly</span>
          <span className="value">{weekly.toFixed(6)} ETH</span>
        </div>
        <div className="projection-item">
          <span className="label">Monthly</span>
          <span className="value">{monthly.toFixed(6)} ETH</span>
        </div>
        <div className="projection-item highlight">
          <span className="label">Yearly</span>
          <span className="value">{yearly.toFixed(4)} ETH</span>
        </div>
      </div>

      <style jsx>{`
        .reward-projection {
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          padding: 16px;
        }
        .projection-title {
          margin: 0 0 12px;
          font-size: 0.85rem;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .projection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .projection-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .projection-item .label {
          font-size: 0.8rem;
          color: var(--secondary-text);
        }
        .projection-item .value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
          color: var(--text-color);
        }
        .projection-item.highlight .value {
          color: var(--primary-color);
        }
      `}</style>
    </div>
  )
})

/**
 * Main Staking Panel component
 */
export function StakingPanel({
  stakedAmount = '0',
  pendingRewards = '0',
  apr = 12,
  totalStaked,
  balance,
  minStake = 0.01,
  lockPeriod = 7, // days
  onStake,
  onUnstake,
  onClaim,
  onCompound,
  isLoading = false,
  canWithdraw = true,
  className = '',
  ...props
}) {
  const [activeTab, setActiveTab] = useState('stake')
  const [amount, setAmount] = useState(0)

  const getMaxAmount = () => {
    if (activeTab === 'stake') return balance
    if (activeTab === 'unstake') return stakedAmount
    return pendingRewards
  }

  const isValidAmount = () => {
    if (activeTab === 'claim') return parseFloat(pendingRewards) > 0
    const max = parseFloat(getMaxAmount() || 0)
    return amount > 0 && amount <= max && (activeTab !== 'stake' || amount >= minStake)
  }

  const handleSubmit = useCallback(() => {
    if (!isValidAmount() || isLoading) return

    switch (activeTab) {
      case 'stake':
        onStake?.(amount)
        break
      case 'unstake':
        onUnstake?.(amount)
        break
      case 'claim':
        onClaim?.()
        break
    }
    
    setAmount(0)
  }, [activeTab, amount, isLoading, onStake, onUnstake, onClaim])

  const handleCompound = useCallback(() => {
    if (parseFloat(pendingRewards) <= 0 || isLoading) return
    onCompound?.()
  }, [pendingRewards, isLoading, onCompound])

  return (
    <div className={`staking-panel ${className}`} {...props}>
      <StakingStats
        stakedAmount={stakedAmount}
        pendingRewards={pendingRewards}
        apr={apr}
        totalStaked={totalStaked}
      />

      <ActionTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="action-content">
        {activeTab !== 'claim' ? (
          <>
            <StakeAmountInput
              value={amount}
              onChange={setAmount}
              max={getMaxAmount()}
              label={activeTab === 'stake' ? 'Stake Amount' : 'Unstake Amount'}
              disabled={isLoading || (activeTab === 'unstake' && !canWithdraw)}
            />

            {activeTab === 'stake' && amount > 0 && (
              <RewardProjection amount={amount} apr={apr} />
            )}

            {activeTab === 'unstake' && !canWithdraw && (
              <div className="lock-warning">
                ⏳ Your stake is locked for {lockPeriod} days after staking
              </div>
            )}
          </>
        ) : (
          <div className="claim-info">
            <div className="claim-amount">
              <span className="label">Available to Claim</span>
              <span className="value">{parseFloat(pendingRewards).toFixed(6)} ETH</span>
            </div>
            
            {parseFloat(pendingRewards) > 0 && (
              <button 
                className="compound-btn"
                onClick={handleCompound}
                disabled={isLoading}
              >
                🔄 Compound Rewards
              </button>
            )}
          </div>
        )}
      </div>

      <button
        className={`action-btn ${activeTab} ${isLoading ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={!isValidAmount() || isLoading || (activeTab === 'unstake' && !canWithdraw)}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Processing...
          </>
        ) : activeTab === 'stake' ? (
          `Stake ${amount || 0} ETH`
        ) : activeTab === 'unstake' ? (
          `Unstake ${amount || 0} ETH`
        ) : (
          `Claim ${parseFloat(pendingRewards).toFixed(6)} ETH`
        )}
      </button>

      {activeTab === 'stake' && (
        <div className="staking-info">
          <p>💡 Minimum stake: {minStake} ETH</p>
          <p>🔒 Lock period: {lockPeriod} days</p>
        </div>
      )}

      <style jsx>{`
        .staking-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .action-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lock-warning {
          padding: 12px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          color: #f59e0b;
          font-size: 0.9rem;
        }
        .claim-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .claim-amount {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          text-align: center;
        }
        .claim-amount .label {
          color: var(--secondary-text);
        }
        .claim-amount .value {
          font-size: 2rem;
          font-weight: 700;
          font-family: 'Monaco', 'Menlo', monospace;
          color: var(--primary-color);
        }
        .compound-btn {
          padding: 12px;
          background: transparent;
          border: 2px solid var(--primary-color);
          border-radius: 8px;
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .compound-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: #000;
        }
        .compound-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .action-btn.stake {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        .action-btn.unstake {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        .action-btn.claim {
          background: linear-gradient(135deg, var(--primary-color), #00cc6a);
          color: #000;
        }
        .action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .action-btn.loading {
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
        .staking-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .staking-info p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--secondary-text);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export { StakingStats, ActionTabs, StakeAmountInput, RewardProjection }
export default StakingPanel
