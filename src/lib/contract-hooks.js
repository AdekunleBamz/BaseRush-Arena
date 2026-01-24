/**
 * Contract Hooks
 * React hooks for interacting with smart contracts
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { CONTRACTS } from './contracts'

/**
 * Generic hook for reading contract data
 */
export function useContractRead({
  contractAddress,
  abi,
  functionName,
  args = [],
  enabled = true,
  watch = false,
  onSuccess,
  onError,
}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!enabled || !contractAddress || !window.ethereum) return

    setIsLoading(true)
    setError(null)

    try {
      // Create function selector
      const functionAbi = abi.find(item => item.name === functionName && item.type === 'function')
      if (!functionAbi) {
        throw new Error(`Function ${functionName} not found in ABI`)
      }

      // Encode function call
      const { encodeAbiParameters, encodeFunctionData, decodeFunctionResult } = await import('viem')
      
      const callData = encodeFunctionData({
        abi: [functionAbi],
        functionName,
        args,
      })

      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: callData,
        }, 'latest'],
      })

      const decoded = decodeFunctionResult({
        abi: [functionAbi],
        functionName,
        data: result,
      })

      setData(decoded)
      onSuccess?.(decoded)
    } catch (err) {
      setError(err)
      onError?.(err)
    } finally {
      setIsLoading(false)
    }
  }, [contractAddress, abi, functionName, args, enabled, onSuccess, onError])

  useEffect(() => {
    fetch()
  }, [fetch])

  // Watch for changes (poll)
  useEffect(() => {
    if (!watch) return
    const interval = setInterval(fetch, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [watch, fetch])

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  }
}

/**
 * Hook for getting the current game round
 */
export function useCurrentRound() {
  const [round, setRound] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!window.ethereum) return

    setIsLoading(true)
    try {
      // This would call getCurrentRound from the contract
      // For now, return mock data structure
      setRound({
        roundId: 1,
        startTime: Date.now() - 3600000,
        endTime: Date.now() + 3600000,
        prizePool: '0',
        status: 'active',
      })
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [fetch])

  return { round, isLoading, error, refetch: fetch }
}

/**
 * Hook for getting user's game entries
 */
export function useUserEntries(address) {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!address) {
      setEntries([])
      return
    }

    setIsLoading(true)
    try {
      // This would call getUserEntries from the contract
      setEntries([])
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { entries, isLoading, error, refetch: fetch }
}

/**
 * Hook for staking info
 */
export function useStakingInfo(address) {
  const [stakingInfo, setStakingInfo] = useState({
    stakedAmount: '0',
    pendingRewards: '0',
    lastStakeTime: 0,
    canWithdraw: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // This would call the staking contract
      setStakingInfo({
        stakedAmount: '0',
        pendingRewards: '0',
        lastStakeTime: 0,
        canWithdraw: true,
      })
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { stakingInfo, isLoading, error, refetch: fetch }
}

/**
 * Hook for user achievements
 */
export function useAchievements(address) {
  const [achievements, setAchievements] = useState([])
  const [unlockedCount, setUnlockedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!address) {
      setAchievements([])
      setUnlockedCount(0)
      return
    }

    setIsLoading(true)
    try {
      // This would call the achievement contract
      const defaultAchievements = [
        { id: 1, name: 'First Win', description: 'Win your first game', unlocked: false },
        { id: 2, name: 'High Roller', description: 'Enter with 0.1 ETH or more', unlocked: false },
        { id: 3, name: 'Streak Master', description: 'Win 5 games in a row', unlocked: false },
        { id: 4, name: 'Diamond Hands', description: 'Stake for 30 days', unlocked: false },
        { id: 5, name: 'Whale', description: 'Win a total of 1 ETH', unlocked: false },
      ]
      setAchievements(defaultAchievements)
      setUnlockedCount(defaultAchievements.filter(a => a.unlocked).length)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { achievements, unlockedCount, isLoading, error, refetch: fetch }
}

/**
 * Hook for leaderboard data
 */
export function useLeaderboard(limit = 10) {
  const [leaders, setLeaders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    try {
      // This would fetch from contract or API
      setLeaders([])
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetch])

  return { leaders, isLoading, error, refetch: fetch }
}

/**
 * Hook for user stats
 */
export function useUserStats(address) {
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalWagered: '0',
    totalWon: '0',
    currentStreak: 0,
    bestStreak: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // This would fetch from contract
      setStats({
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalWagered: '0',
        totalWon: '0',
        currentStreak: 0,
        bestStreak: 0,
      })
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { stats, isLoading, error, refetch: fetch }
}

/**
 * Hook for contract event listening
 */
export function useContractEvents({
  contractAddress,
  abi,
  eventName,
  onEvent,
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled || !contractAddress || !window.ethereum) return

    // Set up event listener
    const handleEvent = (log) => {
      try {
        // Decode and pass to callback
        onEvent?.(log)
      } catch (err) {
        console.error('Error handling event:', err)
      }
    }

    // Subscribe to events (simplified - would use proper subscription in production)
    console.log(`Listening for ${eventName} events on ${contractAddress}`)

    return () => {
      // Cleanup subscription
    }
  }, [contractAddress, abi, eventName, onEvent, enabled])
}

/**
 * Hook for gas estimation
 */
export function useGasEstimate(transaction) {
  const [gasEstimate, setGasEstimate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const estimate = useCallback(async () => {
    if (!transaction || !window.ethereum) return

    setIsLoading(true)
    try {
      const estimate = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [transaction],
      })
      setGasEstimate(parseInt(estimate, 16))
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [transaction])

  useEffect(() => {
    estimate()
  }, [estimate])

  return { gasEstimate, isLoading, error, refetch: estimate }
}

export default {
  useContractRead,
  useCurrentRound,
  useUserEntries,
  useStakingInfo,
  useAchievements,
  useLeaderboard,
  useUserStats,
  useContractEvents,
  useGasEstimate,
}
