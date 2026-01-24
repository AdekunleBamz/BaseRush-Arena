/**
 * Wallet Button Component
 * A dedicated wallet connection button with status display
 */

'use client'

import React, { useState, useRef, useEffect, memo } from 'react'

/**
 * Network badge component
 */
const NetworkBadge = memo(function NetworkBadge({ 
  chainId, 
  isCorrect = true,
  onClick,
}) {
  const getNetworkInfo = (id) => {
    const networks = {
      1: { name: 'Ethereum', color: '#627EEA' },
      8453: { name: 'Base', color: '#0052FF' },
      84532: { name: 'Base Sepolia', color: '#0052FF' },
      42161: { name: 'Arbitrum', color: '#28A0F0' },
      10: { name: 'Optimism', color: '#FF0420' },
      137: { name: 'Polygon', color: '#8247E5' },
    }
    return networks[id] || { name: `Chain ${id}`, color: '#888888' }
  }

  const network = getNetworkInfo(chainId)

  return (
    <button 
      className={`network-badge ${isCorrect ? 'correct' : 'wrong'}`}
      onClick={onClick}
      title={isCorrect ? network.name : 'Click to switch network'}
    >
      <span className="network-dot" style={{ backgroundColor: network.color }} />
      <span className="network-name">{network.name}</span>
      {!isCorrect && <span className="network-warning">⚠️</span>}
      
      <style jsx>{`
        .network-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .network-badge:hover {
          border-color: var(--primary-color);
        }
        .network-badge.wrong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .network-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .network-name {
          color: var(--text-color);
        }
        .network-warning {
          font-size: 0.8rem;
        }
      `}</style>
    </button>
  )
})

/**
 * Address display with copy functionality
 */
const AddressDisplay = memo(function AddressDisplay({ 
  address, 
  showFull = false,
  onClick,
}) {
  const [copied, setCopied] = useState(false)

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="address-display" onClick={onClick}>
      <span className="address-text">
        {showFull ? address : shortenAddress(address)}
      </span>
      <button className="copy-btn" onClick={handleCopy} title="Copy address">
        {copied ? '✓' : '📋'}
      </button>
      
      <style jsx>{`
        .address-display {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .address-display:hover {
          border-color: var(--primary-color);
        }
        .address-text {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
          color: var(--text-color);
        }
        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          font-size: 0.9rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .copy-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  )
})

/**
 * Balance display
 */
const BalanceDisplay = memo(function BalanceDisplay({ balance, symbol = 'ETH' }) {
  const formatBalance = (bal) => {
    if (!bal) return '0.0000'
    const num = parseFloat(bal)
    if (num < 0.0001) return '< 0.0001'
    return num.toFixed(4)
  }

  return (
    <div className="balance-display">
      <span className="balance-value">{formatBalance(balance)}</span>
      <span className="balance-symbol">{symbol}</span>
      
      <style jsx>{`
        .balance-display {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }
        .balance-value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-color);
        }
        .balance-symbol {
          font-size: 0.8rem;
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
})

/**
 * Wallet dropdown menu
 */
const WalletDropdown = memo(function WalletDropdown({
  address,
  balance,
  chainId,
  onDisconnect,
  onSwitchNetwork,
  onViewExplorer,
  onClose,
}) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="wallet-dropdown" ref={dropdownRef}>
      <div className="dropdown-section">
        <div className="section-label">Connected Wallet</div>
        <AddressDisplay address={address} showFull />
      </div>

      <div className="dropdown-section">
        <div className="section-label">Balance</div>
        <BalanceDisplay balance={balance} />
      </div>

      <div className="dropdown-divider" />

      <button className="dropdown-item" onClick={onViewExplorer}>
        <span>🔍</span> View on Explorer
      </button>

      <button className="dropdown-item" onClick={onSwitchNetwork}>
        <span>🔄</span> Switch Network
      </button>

      <div className="dropdown-divider" />

      <button className="dropdown-item danger" onClick={onDisconnect}>
        <span>🚪</span> Disconnect
      </button>
      
      <style jsx>{`
        .wallet-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 280px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          overflow: hidden;
        }
        .dropdown-section {
          padding: 16px;
        }
        .section-label {
          font-size: 0.75rem;
          color: var(--secondary-text);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          text-align: left;
          font-size: 0.95rem;
          color: var(--text-color);
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .dropdown-item.danger {
          color: #ef4444;
        }
        .dropdown-item.danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  )
})

/**
 * Main Wallet Button component
 */
export function WalletButton({
  address,
  balance,
  chainId,
  isConnected = false,
  isConnecting = false,
  isCorrectNetwork = true,
  requiredChainId = 8453,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
  variant = 'default', // 'default', 'compact', 'full'
  className = '',
  ...props
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const buttonRef = useRef(null)

  const getExplorerUrl = (addr) => {
    return `https://basescan.org/address/${addr}`
  }

  const handleViewExplorer = () => {
    window.open(getExplorerUrl(address), '_blank')
    setIsDropdownOpen(false)
  }

  const handleDisconnect = () => {
    onDisconnect?.()
    setIsDropdownOpen(false)
  }

  const handleSwitchNetwork = () => {
    onSwitchNetwork?.(requiredChainId)
    setIsDropdownOpen(false)
  }

  // Not connected state
  if (!isConnected) {
    return (
      <button 
        className={`wallet-button connect ${isConnecting ? 'connecting' : ''} ${className}`}
        onClick={onConnect}
        disabled={isConnecting}
        {...props}
      >
        {isConnecting ? (
          <>
            <span className="spinner" />
            Connecting...
          </>
        ) : (
          <>
            <span className="wallet-icon">🔗</span>
            Connect Wallet
          </>
        )}
        
        <style jsx>{`
          .wallet-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color, #00cc6a));
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            color: #000;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .wallet-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
          }
          .wallet-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .wallet-button.connecting {
            background: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
          }
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    )
  }

  // Connected state - compact variant
  if (variant === 'compact') {
    return (
      <div className={`wallet-connected compact ${className}`} ref={buttonRef}>
        <button 
          className="wallet-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="status-dot" />
          <span className="address">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </button>
        
        {isDropdownOpen && (
          <WalletDropdown
            address={address}
            balance={balance}
            chainId={chainId}
            onDisconnect={handleDisconnect}
            onSwitchNetwork={handleSwitchNetwork}
            onViewExplorer={handleViewExplorer}
            onClose={() => setIsDropdownOpen(false)}
          />
        )}
        
        <style jsx>{`
          .wallet-connected {
            position: relative;
          }
          .wallet-trigger {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .wallet-trigger:hover {
            border-color: var(--primary-color);
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
          }
          .address {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            color: var(--text-color);
          }
        `}</style>
      </div>
    )
  }

  // Connected state - default/full variant
  return (
    <div className={`wallet-connected ${variant} ${className}`} ref={buttonRef}>
      <div className="wallet-info">
        {!isCorrectNetwork && (
          <NetworkBadge 
            chainId={chainId} 
            isCorrect={false}
            onClick={handleSwitchNetwork}
          />
        )}
        
        {variant === 'full' && isCorrectNetwork && (
          <NetworkBadge chainId={chainId} isCorrect />
        )}

        <button 
          className="wallet-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="wallet-content">
            <BalanceDisplay balance={balance} />
            <div className="address-short">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
          <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isDropdownOpen && (
        <WalletDropdown
          address={address}
          balance={balance}
          chainId={chainId}
          onDisconnect={handleDisconnect}
          onSwitchNetwork={handleSwitchNetwork}
          onViewExplorer={handleViewExplorer}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
      
      <style jsx>{`
        .wallet-connected {
          position: relative;
        }
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wallet-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wallet-trigger:hover {
          border-color: var(--primary-color);
        }
        .wallet-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .address-short {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.8rem;
          color: var(--secondary-text);
        }
        .dropdown-arrow {
          font-size: 0.7rem;
          color: var(--secondary-text);
        }
      `}</style>
    </div>
  )
}

export default WalletButton
