/**
 * Transaction List Component
 * Display transaction history with status and details
 */

'use client'

import React, { memo, useState, useMemo } from 'react'

/**
 * Transaction status badge
 */
const StatusBadge = memo(function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: '#f59e0b', label: 'Pending', icon: '⏳' },
    confirming: { color: '#3b82f6', label: 'Confirming', icon: '🔄' },
    confirmed: { color: '#10b981', label: 'Confirmed', icon: '✓' },
    failed: { color: '#ef4444', label: 'Failed', icon: '✗' },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className="status-badge" style={{ '--status-color': config.color }}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
      
      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: color-mix(in srgb, var(--status-color) 15%, transparent);
          color: var(--status-color);
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .status-icon {
          font-size: 0.9em;
        }
      `}</style>
    </span>
  )
})

/**
 * Transaction type icon
 */
const TypeIcon = memo(function TypeIcon({ type }) {
  const icons = {
    entry: '🎮',
    claim: '💰',
    stake: '📥',
    unstake: '📤',
    compound: '🔄',
    approve: '✅',
    mint: '🎨',
    transfer: '↔️',
    other: '📝',
  }

  return <span className="type-icon">{icons[type] || icons.other}</span>
})

/**
 * Single transaction row
 */
const TransactionRow = memo(function TransactionRow({
  tx,
  onViewExplorer,
  compact = false,
}) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const shortenHash = (hash) => `${hash.slice(0, 8)}...${hash.slice(-6)}`

  return (
    <div className={`transaction-row ${compact ? 'compact' : ''}`}>
      <div className="tx-main">
        <TypeIcon type={tx.type} />
        <div className="tx-details">
          <span className="tx-description">{tx.description}</span>
          {!compact && (
            <span className="tx-hash" onClick={() => onViewExplorer?.(tx.hash)}>
              {shortenHash(tx.hash)}
            </span>
          )}
        </div>
      </div>

      <div className="tx-meta">
        {tx.amount && (
          <span className={`tx-amount ${tx.type === 'claim' || tx.type === 'unstake' ? 'positive' : ''}`}>
            {tx.type === 'claim' || tx.type === 'unstake' ? '+' : '-'}
            {tx.amount} ETH
          </span>
        )}
        <StatusBadge status={tx.status} />
        <span className="tx-time">{formatTime(tx.timestamp)}</span>
      </div>
      
      <style jsx>{`
        .transaction-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }
        .transaction-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .transaction-row:last-child {
          border-bottom: none;
        }
        .transaction-row.compact {
          padding: 0.75rem;
        }
        .tx-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tx-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .tx-description {
          font-weight: 500;
          color: var(--text-color);
        }
        .tx-hash {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.8rem;
          color: var(--secondary-text);
          cursor: pointer;
          transition: color 0.2s;
        }
        .tx-hash:hover {
          color: var(--primary-color);
        }
        .tx-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tx-amount {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
          color: var(--text-color);
        }
        .tx-amount.positive {
          color: #10b981;
        }
        .tx-time {
          font-size: 0.85rem;
          color: var(--secondary-text);
          min-width: 60px;
          text-align: right;
        }
        @media (max-width: 600px) {
          .transaction-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .tx-meta {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
})

/**
 * Transaction filters
 */
const TransactionFilters = memo(function TransactionFilters({
  activeFilter,
  onFilterChange,
  counts = {},
}) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'entry', label: 'Entries' },
    { id: 'claim', label: 'Claims' },
    { id: 'stake', label: 'Staking' },
  ]

  return (
    <div className="transaction-filters">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
          {counts[filter.id] > 0 && (
            <span className="filter-count">{counts[filter.id]}</span>
          )}
        </button>
      ))}
      
      <style jsx>{`
        .transaction-filters {
          display: flex;
          gap: 8px;
          padding: 0.5rem 0;
          overflow-x: auto;
        }
        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          color: var(--secondary-text);
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          border-color: var(--primary-color);
          color: var(--text-color);
        }
        .filter-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: #000;
        }
        .filter-count {
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.75rem;
        }
        .filter-btn.active .filter-count {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
})

/**
 * Empty state
 */
const EmptyState = memo(function EmptyState({ filter }) {
  const messages = {
    all: { icon: '📭', text: 'No transactions yet' },
    pending: { icon: '⏳', text: 'No pending transactions' },
    entry: { icon: '🎮', text: 'No game entries yet' },
    claim: { icon: '💰', text: 'No claims yet' },
    stake: { icon: '📥', text: 'No staking activity yet' },
  }

  const content = messages[filter] || messages.all

  return (
    <div className="empty-state">
      <span className="empty-icon">{content.icon}</span>
      <span className="empty-text">{content.text}</span>
      
      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 3rem;
          color: var(--secondary-text);
        }
        .empty-icon {
          font-size: 3rem;
        }
        .empty-text {
          font-size: 1rem;
        }
      `}</style>
    </div>
  )
})

/**
 * Main Transaction List component
 */
export function TransactionList({
  transactions = [],
  showFilters = true,
  compact = false,
  maxItems,
  onViewExplorer,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className = '',
  ...props
}) {
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    if (activeFilter === 'pending') {
      filtered = transactions.filter(tx => tx.status === 'pending' || tx.status === 'confirming')
    } else if (activeFilter !== 'all') {
      filtered = transactions.filter(tx => tx.type === activeFilter)
    }

    if (maxItems) {
      filtered = filtered.slice(0, maxItems)
    }

    return filtered
  }, [transactions, activeFilter, maxItems])

  // Count transactions per filter
  const counts = useMemo(() => ({
    all: transactions.length,
    pending: transactions.filter(tx => tx.status === 'pending' || tx.status === 'confirming').length,
    entry: transactions.filter(tx => tx.type === 'entry').length,
    claim: transactions.filter(tx => tx.type === 'claim').length,
    stake: transactions.filter(tx => tx.type === 'stake' || tx.type === 'unstake').length,
  }), [transactions])

  const handleViewExplorer = (hash) => {
    if (onViewExplorer) {
      onViewExplorer(hash)
    } else {
      window.open(`https://basescan.org/tx/${hash}`, '_blank')
    }
  }

  return (
    <div className={`transaction-list ${className}`} {...props}>
      {showFilters && (
        <TransactionFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      )}

      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionRow
              key={tx.hash}
              tx={tx}
              onViewExplorer={handleViewExplorer}
              compact={compact}
            />
          ))
        )}

        {isLoading && (
          <div className="loading-indicator">
            <span className="loading-spinner" />
            Loading transactions...
          </div>
        )}

        {hasMore && !isLoading && (
          <button className="load-more-btn" onClick={onLoadMore}>
            Load More
          </button>
        )}
      </div>

      <style jsx>{`
        .transaction-list {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        .transactions-container {
          max-height: 500px;
          overflow-y: auto;
        }
        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 1rem;
          color: var(--secondary-text);
        }
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .load-more-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          border-top: 1px solid var(--border-color);
          color: var(--primary-color);
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .load-more-btn:hover {
          background: rgba(0, 255, 136, 0.05);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default TransactionList
