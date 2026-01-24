/**
 * Application Constants
 * Centralized configuration and constant values
 */

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORKS = {
  BASE_MAINNET: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
}

export const DEFAULT_NETWORK = NETWORKS.BASE_MAINNET

// ============================================================================
// Game Configuration
// ============================================================================

export const GAME_CONFIG = {
  ENTRY_FEE: '0.0001', // ETH
  MIN_STAKE: '0.0001', // ETH
  MAX_MULTI_ENTRIES: 10,
  ROUND_DURATION: 3600, // 1 hour in seconds
  PREDICTION_OPTIONS: [0, 1, 2],
  REFERRAL_BONUS_PERCENT: 5,
}

// ============================================================================
// Staking Configuration
// ============================================================================

export const STAKING_CONFIG = {
  MIN_STAKE: '0.0001',
  MAX_STAKE: '100',
  APY_RATE: 0.01, // 1% per hour (for display)
  COMPOUND_FREQUENCY: 3600, // hourly
  UNSTAKE_COOLDOWN: 86400, // 24 hours
}

// ============================================================================
// Achievement Configuration
// ============================================================================

export const ACHIEVEMENTS = {
  FIRST_ENTRY: {
    id: 'first_entry',
    name: 'First Steps',
    description: 'Enter your first game',
    icon: '🎮',
    badgeType: 0,
    requirement: 1,
  },
  TEN_ENTRIES: {
    id: 'ten_entries',
    name: 'Getting Started',
    description: 'Enter 10 games',
    icon: '🎯',
    badgeType: 1,
    requirement: 10,
  },
  FIFTY_ENTRIES: {
    id: 'fifty_entries',
    name: 'Dedicated Player',
    description: 'Enter 50 games',
    icon: '⭐',
    badgeType: 2,
    requirement: 50,
  },
  FIRST_WIN: {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    badgeType: 3,
    requirement: 1,
  },
  FIVE_WINS: {
    id: 'five_wins',
    name: 'Winning Streak',
    description: 'Win 5 games',
    icon: '🔥',
    badgeType: 4,
    requirement: 5,
  },
  STAKER: {
    id: 'staker',
    name: 'Staker',
    description: 'Stake ETH in the vault',
    icon: '💎',
    badgeType: 5,
  },
  REFERRER: {
    id: 'referrer',
    name: 'Referrer',
    description: 'Refer a friend',
    icon: '🤝',
    badgeType: 6,
  },
  WHALE: {
    id: 'whale',
    name: 'Whale',
    description: 'Stake more than 1 ETH',
    icon: '🐋',
    badgeType: 7,
  },
  STREAK_3: {
    id: 'streak_3',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    badgeType: 8,
    requirement: 3,
  },
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Achieve 90%+ win rate with 10+ games',
    icon: '👑',
    badgeType: 9,
  },
}

// ============================================================================
// UI Configuration
// ============================================================================

export const UI_CONFIG = {
  ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 5000, // ms
  DEBOUNCE_DELAY: 500, // ms
  POLLING_INTERVAL: 10000, // 10 seconds
  MAX_NOTIFICATIONS: 10,
  MAX_CHAT_MESSAGES: 100,
  MAX_ACTIVITY_LOGS: 50,
}

// ============================================================================
// Theme Colors
// ============================================================================

export const COLORS = {
  primary: '#667eea',
  primaryDark: '#764ba2',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#f44336',
  info: '#2196F3',
  
  // Light theme
  light: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.15)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Dark theme
  dark: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    surface: 'rgba(0, 0, 0, 0.2)',
    text: '#e0e0e0',
    textSecondary: 'rgba(255, 255, 255, 0.5)',
  },
}

// ============================================================================
// Breakpoints
// ============================================================================

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1200,
}

// ============================================================================
// Sound Configuration
// ============================================================================

export const SOUNDS = {
  CLICK: { frequency: 500, duration: 0.1 },
  WIN: { frequency: 800, duration: 0.3 },
  ENTRY: { frequency: 600, duration: 0.2 },
  ERROR: { frequency: 300, duration: 0.3 },
  ACHIEVEMENT: { frequency: 1000, duration: 0.5 },
  NOTIFICATION: { frequency: 700, duration: 0.15 },
}

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction',
  TRANSACTION_REJECTED: 'Transaction was rejected by user',
  NETWORK_ERROR: 'Network error. Please check your connection',
  GAS_ESTIMATION_FAILED: 'Gas estimation failed. Please try again',
  INVALID_AMOUNT: 'Please enter a valid amount',
  AMOUNT_TOO_LOW: 'Amount is below the minimum required',
  AMOUNT_TOO_HIGH: 'Amount exceeds the maximum allowed',
  ROUND_NOT_ACTIVE: 'This round is not active',
  ALREADY_ENTERED: 'You have already entered this round',
  NOT_WINNER: 'You are not a winner in this round',
  ALREADY_CLAIMED: 'Prize has already been claimed',
}

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  GAME_ENTERED: 'Successfully entered the game!',
  PRIZE_CLAIMED: 'Prize claimed successfully!',
  STAKED: 'Successfully staked ETH!',
  UNSTAKED: 'Successfully unstaked ETH!',
  REWARDS_CLAIMED: 'Rewards claimed successfully!',
  REWARDS_COMPOUNDED: 'Rewards compounded successfully!',
  BADGE_CLAIMED: 'Achievement badge claimed!',
  SETTINGS_SAVED: 'Settings saved successfully!',
}

// ============================================================================
// Local Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  THEME: 'baserush-theme',
  SOUND: 'baserush-sound',
  SETTINGS: 'baserush-settings',
  REFERRAL: 'baserush-referral',
  ONBOARDING: 'baserush-onboarding',
  NOTIFICATIONS: 'baserush-notifications',
}

// ============================================================================
// External Links
// ============================================================================

export const EXTERNAL_LINKS = {
  DOCS: 'https://docs.baserush.arena',
  GITHUB: 'https://github.com/baserush-arena',
  TWITTER: 'https://twitter.com/baserush_arena',
  DISCORD: 'https://discord.gg/baserush',
  FARCASTER: 'https://warpcast.com/baserush',
  BASE_BRIDGE: 'https://bridge.base.org',
  BASESCAN: 'https://basescan.org',
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_THEME: 't',
  TOGGLE_SOUND: 's',
  ENTER_GAME: 'Enter', // with Ctrl/Cmd
  OPEN_SETTINGS: ',', // with Ctrl/Cmd
  CLOSE_MODAL: 'Escape',
  SELECT_OPTION_1: '1',
  SELECT_OPTION_2: '2',
  SELECT_OPTION_3: '3',
  NAVIGATE_LEFT: 'ArrowLeft',
  NAVIGATE_RIGHT: 'ArrowRight',
}
