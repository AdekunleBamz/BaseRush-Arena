/**
 * TypeScript Type Definitions for BaseRush Arena
 * Provides type safety for game logic, contract interactions, and UI state
 */

// ============================================================================
// Game Types
// ============================================================================

/** Prediction options available in the game */
export type PredictionOption = 0 | 1 | 2;

/** Possible game round states */
export type RoundState = 'pending' | 'active' | 'resolving' | 'completed';

/** Game round information from contract */
export interface RoundInfo {
  roundId: bigint;
  startTime: bigint;
  endTime: bigint;
  totalEntries: bigint;
  prizePool: bigint;
  option0Entries: bigint;
  option1Entries: bigint;
  option2Entries: bigint;
  isFinalized: boolean;
  winningOption?: PredictionOption;
}

/** Player entry in a specific round */
export interface PlayerEntry {
  roundId: bigint;
  option: PredictionOption;
  amount: bigint;
  timestamp: bigint;
  claimed: boolean;
}

/** Player statistics */
export interface PlayerStats {
  totalEntries: bigint;
  wins: bigint;
  winRate: number;
  totalWinnings: bigint;
  currentStreak: number;
  bestStreak: number;
}

// ============================================================================
// Staking Types
// ============================================================================

/** Stake information from contract */
export interface StakeInfo {
  stakedAmount: bigint;
  pendingRewards: bigint;
  lastStakeTime: bigint;
  totalClaimed: bigint;
  stakeDuration: bigint;
}

/** Referral information */
export interface ReferralInfo {
  referrer: `0x${string}` | null;
  referralEarnings: bigint;
  referralCount: number;
}

// ============================================================================
// Achievement Types
// ============================================================================

/** Badge type enumeration matching contract */
export enum BadgeType {
  FIRST_ENTRY = 0,
  TEN_ENTRIES = 1,
  FIFTY_ENTRIES = 2,
  FIRST_WIN = 3,
  FIVE_WINS = 4,
  STAKER = 5,
  REFERRER = 6,
  WHALE = 7,
  STREAK_3 = 8,
  LEGEND = 9,
}

/** Achievement definition */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  badgeType?: BadgeType;
  progress?: number;
  target?: number;
}

/** Achievement notification */
export interface AchievementNotification {
  achievement: Achievement;
  timestamp: Date;
  txHash?: `0x${string}`;
}

// ============================================================================
// UI Types
// ============================================================================

/** Application tabs */
export type TabType = 'game' | 'stake' | 'achievements' | 'leaderboard' | 'chat';

/** Theme variants */
export type Theme = 'light' | 'dark' | 'system';

/** Notification types */
export type NotificationType = 'win' | 'prize' | 'entry' | 'stake' | 'achievement' | 'error' | 'info';

/** Notification object */
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Activity log entry */
export interface Activity {
  id: number;
  type: 'entry' | 'win' | 'stake' | 'claim' | 'achievement';
  action: string;
  details: string;
  timestamp: number;
  txHash?: string;
}

/** Chat message */
export interface ChatMessage {
  id: number;
  user: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

// ============================================================================
// Leaderboard Types
// ============================================================================

/** Leaderboard entry */
export interface LeaderboardEntry {
  rank: number;
  address: `0x${string}`;
  entries: number;
  wins: number;
  winRate: number;
  totalWinnings: bigint;
  badges: number;
}

/** Leaderboard sort options */
export type LeaderboardSortBy = 'entries' | 'wins' | 'winRate' | 'totalWinnings' | 'badges';

// ============================================================================
// Transaction Types
// ============================================================================

/** Transaction status */
export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

/** Transaction result */
export interface TransactionResult {
  hash: `0x${string}`;
  status: TransactionStatus;
  error?: Error;
  confirmations?: number;
}

/** Contract function names */
export type GamePoolFunction = 
  | 'enterGame'
  | 'multiEntry'
  | 'claimPrize'
  | 'finalizeRound';

export type RewardVaultFunction = 
  | 'stake'
  | 'unstake'
  | 'claimRewards'
  | 'compoundRewards'
  | 'withdrawReferralEarnings';

export type AchievementNFTFunction = 'claimBadge';

// ============================================================================
// Settings Types
// ============================================================================

/** User settings */
export interface UserSettings {
  theme: Theme;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  compactMode: boolean;
  notificationsEnabled: boolean;
  autoClaimRewards: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
}

/** Default settings */
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  soundEnabled: true,
  animationsEnabled: true,
  compactMode: false,
  notificationsEnabled: true,
  autoClaimRewards: false,
  highContrastMode: false,
  reducedMotion: false,
};

// ============================================================================
// Contract Types
// ============================================================================

/** Contract addresses */
export interface ContractAddresses {
  GAME_POOL: `0x${string}`;
  REWARD_VAULT: `0x${string}`;
  ACHIEVEMENT_NFT: `0x${string}`;
}

/** Network configuration */
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: ContractAddresses;
  entryFee: bigint;
  minStake: bigint;
}

// ============================================================================
// Chart/Analytics Types
// ============================================================================

/** Game history entry for charts */
export interface GameHistoryEntry {
  round: number;
  result: 'win' | 'loss';
  amount: number;
  option: PredictionOption;
  timestamp: Date;
}

/** Performance metrics */
export interface PerformanceMetrics {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  netProfit: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

// ============================================================================
// Error Types
// ============================================================================

/** Custom error types */
export class WalletNotConnectedError extends Error {
  constructor() {
    super('Please connect your wallet to continue');
    this.name = 'WalletNotConnectedError';
  }
}

export class InsufficientFundsError extends Error {
  constructor(required: bigint, available: bigint) {
    super(`Insufficient funds. Required: ${required}, Available: ${available}`);
    this.name = 'InsufficientFundsError';
  }
}

export class TransactionRejectedError extends Error {
  constructor() {
    super('Transaction was rejected by user');
    this.name = 'TransactionRejectedError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

// ============================================================================
// Utility Types
// ============================================================================

/** Make all properties optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract the resolved type from a Promise */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Ethereum address type */
export type Address = `0x${string}`;

/** Transaction hash type */
export type TxHash = `0x${string}`;

/** Hex string type */
export type Hex = `0x${string}`;
