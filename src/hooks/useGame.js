/**
 * useGame Hook
 * Game state management and contract interactions
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * Mock contract calls (replace with actual wagmi hooks)
 */
const mockContractCalls = {
  getCurrentRound: async () => ({
    roundId: 42,
    status: 'active',
    startTime: Date.now() - 3600000,
    endTime: Date.now() + 3600000,
    totalPool: 10.5,
    upPool: 5.2,
    downPool: 5.3,
    totalPlayers: 127,
  }),
  getUserEntry: async () => null,
  submitEntry: async () => ({ hash: '0x123...' }),
  claimReward: async () => ({ hash: '0x456...' }),
}

/**
 * Game status enum
 */
export const GameStatus = {
  LOADING: 'loading',
  ACTIVE: 'active',
  LOCKED: 'locked',
  CALCULATING: 'calculating',
  COMPLETED: 'completed',
  ERROR: 'error',
}

/**
 * Prediction enum
 */
export const Prediction = {
  UP: 'UP',
  DOWN: 'DOWN',
}

/**
 * Main game hook
 */
export function useGame(address) {
  const [round, setRound] = useState(null)
  const [userEntry, setUserEntry] = useState(null)
  const [status, setStatus] = useState(GameStatus.LOADING)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch current round
  const fetchRound = useCallback(async () => {
    try {
      const data = await mockContractCalls.getCurrentRound()
      setRound(data)
      setStatus(GameStatus.ACTIVE)
      setError(null)
    } catch (err) {
      setError(err)
      setStatus(GameStatus.ERROR)
    }
  }, [])

  // Fetch user entry
  const fetchUserEntry = useCallback(async () => {
    if (!address || !round?.roundId) return

    try {
      const entry = await mockContractCalls.getUserEntry(address, round.roundId)
      setUserEntry(entry)
    } catch (err) {
      console.error('Failed to fetch user entry:', err)
    }
  }, [address, round?.roundId])

  // Refresh all data
  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    await fetchRound()
    await fetchUserEntry()
    setIsRefreshing(false)
  }, [fetchRound, fetchUserEntry])

  // Initial fetch
  useEffect(() => {
    fetchRound()
  }, [fetchRound])

  // Fetch user entry when address or round changes
  useEffect(() => {
    fetchUserEntry()
  }, [fetchUserEntry])

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [refresh])

  // Calculated values
  const canEnter = useMemo(() => {
    if (!round) return false
    if (status !== GameStatus.ACTIVE) return false
    if (round.endTime - Date.now() < 5 * 60 * 1000) return false // 5 min lock
    return true
  }, [round, status])

  const timeRemaining = useMemo(() => {
    if (!round?.endTime) return 0
    return Math.max(0, round.endTime - Date.now())
  }, [round])

  const poolDistribution = useMemo(() => {
    if (!round?.totalPool) return { up: 50, down: 50 }
    const total = round.upPool + round.downPool
    if (total === 0) return { up: 50, down: 50 }
    return {
      up: (round.upPool / total) * 100,
      down: (round.downPool / total) * 100,
    }
  }, [round])

  return {
    round,
    userEntry,
    status,
    error,
    isRefreshing,
    canEnter,
    timeRemaining,
    poolDistribution,
    refresh,
  }
}

/**
 * Entry submission hook
 */
export function useSubmitEntry() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [txHash, setTxHash] = useState(null)

  const submit = useCallback(async ({ prediction, amount, roundId }) => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)

    try {
      // Validate inputs
      if (!prediction || !['UP', 'DOWN'].includes(prediction)) {
        throw new Error('Invalid prediction')
      }
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount')
      }

      const result = await mockContractCalls.submitEntry({
        prediction,
        amount,
        roundId,
      })

      setTxHash(result.hash)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setTxHash(null)
  }, [])

  return {
    submit,
    isLoading,
    error,
    txHash,
    reset,
  }
}

/**
 * Claim reward hook
 */
export function useClaimReward() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [txHash, setTxHash] = useState(null)

  const claim = useCallback(async (roundId) => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)

    try {
      const result = await mockContractCalls.claimReward(roundId)
      setTxHash(result.hash)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setTxHash(null)
  }, [])

  return {
    claim,
    isLoading,
    error,
    txHash,
    reset,
  }
}

/**
 * Game history hook
 */
export function useGameHistory(address, options = {}) {
  const { limit = 20, offset = 0 } = options

  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchHistory = useCallback(async () => {
    if (!address) {
      setGames([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockGames = Array.from({ length: limit }, (_, i) => ({
        id: offset + i + 1,
        roundId: 40 - offset - i,
        date: Date.now() - (offset + i) * 86400000,
        prediction: Math.random() > 0.5 ? 'UP' : 'DOWN',
        amount: (Math.random() * 2).toFixed(4),
        won: Math.random() > 0.5,
        reward: Math.random() > 0.5 ? (Math.random() * 3).toFixed(4) : '0',
        status: Math.random() > 0.8 ? 'pending' : 'completed',
      }))

      setGames((prev) => (offset === 0 ? mockGames : [...prev, ...mockGames]))
      setHasMore(mockGames.length === limit)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [address, limit, offset])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      // Trigger fetch with new offset
    }
  }, [isLoading, hasMore])

  // Stats calculations
  const stats = useMemo(() => {
    const completed = games.filter((g) => g.status === 'completed')
    const wins = completed.filter((g) => g.won)
    const totalEarnings = games.reduce(
      (sum, g) => sum + parseFloat(g.reward || 0),
      0
    )

    return {
      totalGames: completed.length,
      wins: wins.length,
      losses: completed.length - wins.length,
      winRate: completed.length > 0 ? (wins.length / completed.length) * 100 : 0,
      totalEarnings: totalEarnings.toFixed(4),
    }
  }, [games])

  return {
    games,
    stats,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh: fetchHistory,
  }
}

export default {
  useGame,
  useSubmitEntry,
  useClaimReward,
  useGameHistory,
  GameStatus,
  Prediction,
}
