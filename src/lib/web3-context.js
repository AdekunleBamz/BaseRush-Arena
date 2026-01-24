/**
 * Web3 Context Provider
 * Centralized wallet and network state management
 */

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

// Base network configuration
const BASE_CHAIN = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
}

/**
 * Connection status enum
 */
export const ConnectionStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  WRONG_NETWORK: 'wrong_network',
  ERROR: 'error',
}

/**
 * Transaction status enum
 */
export const TransactionStatus = {
  PENDING: 'pending',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
}

const Web3Context = createContext(null)

/**
 * Web3 Provider Component
 */
export function Web3Provider({ 
  children,
  autoConnect = true,
  requiredChainId = 8453,
}) {
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [status, setStatus] = useState(ConnectionStatus.DISCONNECTED)
  const [error, setError] = useState(null)
  const [balance, setBalance] = useState(null)
  const [pendingTransactions, setPendingTransactions] = useState([])

  /**
   * Check if connected to the correct network
   */
  const isCorrectNetwork = useMemo(() => {
    return chainId === requiredChainId
  }, [chainId, requiredChainId])

  /**
   * Get the explorer URL for a transaction or address
   */
  const getExplorerUrl = useCallback((hashOrAddress, type = 'tx') => {
    const baseUrl = BASE_CHAIN.blockExplorers.default.url
    return `${baseUrl}/${type}/${hashOrAddress}`
  }, [])

  /**
   * Shorten an address for display
   */
  const shortenAddress = useCallback((addr, chars = 4) => {
    if (!addr) return ''
    return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`
  }, [])

  /**
   * Format balance for display
   */
  const formattedBalance = useMemo(() => {
    if (balance === null) return null
    return parseFloat(balance).toFixed(4)
  }, [balance])

  /**
   * Connect wallet
   */
  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError(new Error('No wallet detected. Please install a Web3 wallet.'))
      setStatus(ConnectionStatus.ERROR)
      return false
    }

    try {
      setStatus(ConnectionStatus.CONNECTING)
      setError(null)

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        
        const chainIdHex = await window.ethereum.request({
          method: 'eth_chainId',
        })
        const currentChainId = parseInt(chainIdHex, 16)
        setChainId(currentChainId)

        if (currentChainId !== requiredChainId) {
          setStatus(ConnectionStatus.WRONG_NETWORK)
        } else {
          setStatus(ConnectionStatus.CONNECTED)
        }

        return true
      }
    } catch (err) {
      setError(err)
      setStatus(ConnectionStatus.ERROR)
    }

    return false
  }, [requiredChainId])

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
    setBalance(null)
    setStatus(ConnectionStatus.DISCONNECTED)
    setError(null)
  }, [])

  /**
   * Switch to the required network
   */
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${requiredChainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${requiredChainId.toString(16)}`,
              chainName: BASE_CHAIN.name,
              nativeCurrency: BASE_CHAIN.nativeCurrency,
              rpcUrls: BASE_CHAIN.rpcUrls.default.http,
              blockExplorerUrls: [BASE_CHAIN.blockExplorers.default.url],
            }],
          })
          return true
        } catch (addError) {
          setError(addError)
          return false
        }
      }
      setError(switchError)
      return false
    }
  }, [requiredChainId])

  /**
   * Fetch wallet balance
   */
  const fetchBalance = useCallback(async () => {
    if (!address || !window.ethereum) return

    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      const balanceWei = parseInt(balanceHex, 16)
      const balanceEth = balanceWei / 1e18
      setBalance(balanceEth.toString())
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [address])

  /**
   * Add a pending transaction to track
   */
  const addPendingTransaction = useCallback((hash, description) => {
    setPendingTransactions(prev => [
      ...prev,
      {
        hash,
        description,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
      },
    ])
  }, [])

  /**
   * Update transaction status
   */
  const updateTransactionStatus = useCallback((hash, status) => {
    setPendingTransactions(prev =>
      prev.map(tx =>
        tx.hash === hash ? { ...tx, status } : tx
      )
    )
  }, [])

  /**
   * Remove a transaction from pending list
   */
  const removePendingTransaction = useCallback((hash) => {
    setPendingTransactions(prev =>
      prev.filter(tx => tx.hash !== hash)
    )
  }, [])

  /**
   * Sign a message
   */
  const signMessage = useCallback(async (message) => {
    if (!address || !window.ethereum) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })
      return signature
    } catch (err) {
      setError(err)
      throw err
    }
  }, [address])

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
        setStatus(ConnectionStatus.CONNECTED)
      }
    }

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16)
      setChainId(newChainId)
      
      if (newChainId !== requiredChainId) {
        setStatus(ConnectionStatus.WRONG_NETWORK)
      } else if (address) {
        setStatus(ConnectionStatus.CONNECTED)
      }
    }

    const handleDisconnect = () => {
      disconnect()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', handleDisconnect)
    }
  }, [address, requiredChainId, disconnect])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && typeof window !== 'undefined' && window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            connect()
          }
        })
        .catch(console.error)
    }
  }, [autoConnect, connect])

  // Fetch balance when address changes
  useEffect(() => {
    if (address) {
      fetchBalance()
    }
  }, [address, fetchBalance])

  const value = useMemo(() => ({
    // State
    address,
    chainId,
    status,
    error,
    balance,
    formattedBalance,
    pendingTransactions,
    isConnected: status === ConnectionStatus.CONNECTED,
    isConnecting: status === ConnectionStatus.CONNECTING,
    isCorrectNetwork,
    
    // Actions
    connect,
    disconnect,
    switchNetwork,
    fetchBalance,
    signMessage,
    addPendingTransaction,
    updateTransactionStatus,
    removePendingTransaction,
    
    // Utilities
    getExplorerUrl,
    shortenAddress,
    
    // Constants
    requiredChainId,
    chainConfig: BASE_CHAIN,
  }), [
    address,
    chainId,
    status,
    error,
    balance,
    formattedBalance,
    pendingTransactions,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    fetchBalance,
    signMessage,
    addPendingTransaction,
    updateTransactionStatus,
    removePendingTransaction,
    getExplorerUrl,
    shortenAddress,
    requiredChainId,
  ])

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

/**
 * Hook to use web3 context
 */
export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

/**
 * Hook for just the address
 */
export function useAddress() {
  const { address } = useWeb3()
  return address
}

/**
 * Hook for connection status
 */
export function useConnectionStatus() {
  const { status, isConnected, isConnecting, isCorrectNetwork } = useWeb3()
  return { status, isConnected, isConnecting, isCorrectNetwork }
}

/**
 * Hook for balance
 */
export function useBalance() {
  const { balance, formattedBalance, fetchBalance } = useWeb3()
  return { balance, formattedBalance, refresh: fetchBalance }
}

export default Web3Provider
