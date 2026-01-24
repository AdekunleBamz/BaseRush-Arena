/**
 * Jest Test Utilities
 * Common test helpers and mocks for testing components
 */

import React from 'react'

/**
 * Mock wallet address
 */
export const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bC93'
export const MOCK_SHORT_ADDRESS = '0x742d...bC93'

/**
 * Mock transaction hash
 */
export const MOCK_TX_HASH = '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'

/**
 * Mock game round data
 */
export const mockRound = {
  id: 1,
  roundId: 42,
  status: 'active',
  startTime: Date.now() - 3600000, // 1 hour ago
  endTime: Date.now() + 3600000, // 1 hour from now
  openPrice: 2500.00,
  closePrice: null,
  totalPool: 10.5,
  upPool: 5.2,
  downPool: 5.3,
  totalPlayers: 127,
  upPlayers: 62,
  downPlayers: 65,
}

/**
 * Mock completed round
 */
export const mockCompletedRound = {
  ...mockRound,
  status: 'completed',
  endTime: Date.now() - 60000,
  closePrice: 2550.00,
  outcome: 'UP',
  winners: 62,
  settlementTx: MOCK_TX_HASH,
}

/**
 * Mock user entry
 */
export const mockUserEntry = {
  id: 1,
  roundId: 42,
  prediction: 'UP',
  amount: '0.5',
  timestamp: Date.now() - 1800000,
  txHash: MOCK_TX_HASH,
}

/**
 * Mock game history
 */
export const mockGameHistory = [
  {
    id: 1,
    roundId: 42,
    date: Date.now() - 86400000,
    prediction: 'UP',
    amount: '0.5',
    won: true,
    reward: '0.95',
    status: 'claimed',
  },
  {
    id: 2,
    roundId: 41,
    date: Date.now() - 172800000,
    prediction: 'DOWN',
    amount: '0.25',
    won: false,
    reward: '0',
    status: 'completed',
  },
  {
    id: 3,
    roundId: 43,
    date: Date.now() - 3600000,
    prediction: 'UP',
    amount: '1.0',
    won: null,
    reward: null,
    status: 'pending',
  },
]

/**
 * Mock leaderboard data
 */
export const mockLeaderboard = [
  { rank: 1, address: '0xabc...123', wins: 45, totalGames: 50, winRate: 0.9, earnings: '125.5' },
  { rank: 2, address: '0xdef...456', wins: 38, totalGames: 48, winRate: 0.79, earnings: '98.2' },
  { rank: 3, address: '0xghi...789', wins: 35, totalGames: 52, winRate: 0.67, earnings: '87.1' },
  { rank: 4, address: MOCK_SHORT_ADDRESS, wins: 32, totalGames: 45, winRate: 0.71, earnings: '75.8' },
  { rank: 5, address: '0xjkl...012', wins: 30, totalGames: 42, winRate: 0.71, earnings: '68.4' },
]

/**
 * Mock notifications
 */
export const mockNotifications = [
  {
    id: 1,
    type: 'win',
    title: 'You Won!',
    message: 'Congratulations! Your UP prediction was correct. Claim your reward of 0.95 ETH.',
    createdAt: Date.now() - 3600000,
    read: false,
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You earned the "First Win" badge! Mint it as an NFT.',
    createdAt: Date.now() - 86400000,
    read: true,
  },
  {
    id: 3,
    type: 'staking',
    title: 'Rewards Available',
    message: 'You have 0.05 ETH in staking rewards ready to claim.',
    createdAt: Date.now() - 172800000,
    read: true,
  },
]

/**
 * Mock achievements
 */
export const mockAchievements = [
  {
    id: 'first-win',
    name: 'First Win',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: true,
    unlockedAt: Date.now() - 86400000,
    mintable: true,
    minted: false,
  },
  {
    id: 'win-streak-5',
    name: 'Hot Streak',
    description: 'Win 5 games in a row',
    icon: '🔥',
    unlocked: true,
    unlockedAt: Date.now() - 43200000,
    mintable: true,
    minted: true,
  },
  {
    id: 'win-streak-10',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    icon: '⚡',
    unlocked: false,
    progress: 7,
    total: 10,
    mintable: false,
    minted: false,
  },
]

/**
 * Mock staking data
 */
export const mockStakingData = {
  staked: '5.0',
  rewards: '0.25',
  apr: 12.5,
  lockEndTime: Date.now() + 604800000, // 7 days
  totalStaked: '1250.5',
  totalStakers: 342,
}

/**
 * Create mock function with resolved value
 */
export function createMockFn(resolvedValue) {
  return jest.fn().mockResolvedValue(resolvedValue)
}

/**
 * Wait for async updates
 */
export function waitFor(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Wrapper for testing hooks
 */
export function createWrapper(providers = []) {
  return function Wrapper({ children }) {
    return providers.reduceRight((acc, Provider) => {
      return React.createElement(Provider, null, acc)
    }, children)
  }
}

/**
 * Mock Web3 context value
 */
export const mockWeb3Context = {
  address: MOCK_ADDRESS,
  isConnected: true,
  isConnecting: false,
  chainId: 8453,
  isCorrectNetwork: true,
  connect: jest.fn(),
  disconnect: jest.fn(),
  switchNetwork: jest.fn(),
}

/**
 * Mock disconnected Web3 context
 */
export const mockDisconnectedWeb3Context = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  isCorrectNetwork: false,
  connect: jest.fn(),
  disconnect: jest.fn(),
  switchNetwork: jest.fn(),
}

/**
 * Mock theme context
 */
export const mockThemeContext = {
  theme: 'dark',
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
}

/**
 * Mock sound context
 */
export const mockSoundContext = {
  soundEnabled: true,
  setSoundEnabled: jest.fn(),
  playSound: jest.fn(),
}

/**
 * Suppress console errors during tests
 */
export function suppressConsoleErrors() {
  const originalError = console.error
  
  beforeAll(() => {
    console.error = jest.fn()
  })
  
  afterAll(() => {
    console.error = originalError
  })
}

/**
 * Mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  const mock = jest.fn()
  
  mock.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })
  
  window.IntersectionObserver = mock
  
  return mock
}

/**
 * Mock ResizeObserver
 */
export function mockResizeObserver() {
  const mock = jest.fn()
  
  mock.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })
  
  window.ResizeObserver = mock
  
  return mock
}

/**
 * Mock matchMedia
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

/**
 * Mock scrollTo
 */
export function mockScrollTo() {
  window.scrollTo = jest.fn()
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store = new Map()
  
  const mockStorage = {
    getItem: jest.fn((key) => store.get(key) ?? null),
    setItem: jest.fn((key, value) => store.set(key, value)),
    removeItem: jest.fn((key) => store.delete(key)),
    clear: jest.fn(() => store.clear()),
    get length() {
      return store.size
    },
    key: jest.fn((index) => {
      const keys = Array.from(store.keys())
      return keys[index] ?? null
    }),
  }
  
  Object.defineProperty(window, 'localStorage', { value: mockStorage })
  
  return mockStorage
}

export default {
  MOCK_ADDRESS,
  MOCK_SHORT_ADDRESS,
  MOCK_TX_HASH,
  mockRound,
  mockCompletedRound,
  mockUserEntry,
  mockGameHistory,
  mockLeaderboard,
  mockNotifications,
  mockAchievements,
  mockStakingData,
  createMockFn,
  waitFor,
  createWrapper,
  mockWeb3Context,
  mockDisconnectedWeb3Context,
  mockThemeContext,
  mockSoundContext,
  suppressConsoleErrors,
  mockIntersectionObserver,
  mockResizeObserver,
  mockMatchMedia,
  mockScrollTo,
  mockLocalStorage,
}
