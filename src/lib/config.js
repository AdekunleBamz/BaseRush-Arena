/**
 * Environment Configuration
 * Centralized environment variable management
 */

/**
 * Get an environment variable with optional default
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string}
 */
function getEnv(key, defaultValue = '') {
  return process.env[key] ?? defaultValue
}

/**
 * Get a required environment variable
 * @param {string} key - Environment variable key
 * @returns {string}
 * @throws {Error} If variable is not defined
 */
function getRequiredEnv(key) {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Check if running in test mode
 */
export const isTest = process.env.NODE_ENV === 'test'

/**
 * Check if running on server
 */
export const isServer = typeof window === 'undefined'

/**
 * Check if running on client
 */
export const isClient = !isServer

/**
 * Application configuration
 */
export const config = {
  // App
  appName: getEnv('NEXT_PUBLIC_APP_NAME', 'BaseRush Arena'),
  appVersion: getEnv('NEXT_PUBLIC_APP_VERSION', '2.0.0'),
  appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'https://baserush.xyz'),
  
  // Network
  chainId: parseInt(getEnv('NEXT_PUBLIC_CHAIN_ID', '8453'), 10),
  rpcUrl: getEnv('NEXT_PUBLIC_RPC_URL', 'https://mainnet.base.org'),
  
  // Contracts
  contracts: {
    gamePool: getEnv('NEXT_PUBLIC_GAME_POOL_ADDRESS', '0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1'),
    rewardVault: getEnv('NEXT_PUBLIC_REWARD_VAULT_ADDRESS', '0xb6339F1857Ab28105472F1827C0D7948e8c3608D'),
    achievementNFT: getEnv('NEXT_PUBLIC_ACHIEVEMENT_NFT_ADDRESS', '0x1C9a074Eba68cbEf15BCeab209743388786A9756'),
  },
  
  // Wallet Connect
  walletConnectProjectId: getEnv('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID', ''),
  
  // Analytics
  analyticsEndpoint: getEnv('NEXT_PUBLIC_ANALYTICS_ENDPOINT', ''),
  errorEndpoint: getEnv('NEXT_PUBLIC_ERROR_ENDPOINT', ''),
  
  // Feature Flags
  features: {
    staking: getEnv('NEXT_PUBLIC_FEATURE_STAKING', 'true') === 'true',
    achievements: getEnv('NEXT_PUBLIC_FEATURE_ACHIEVEMENTS', 'true') === 'true',
    chat: getEnv('NEXT_PUBLIC_FEATURE_CHAT', 'true') === 'true',
    leaderboard: getEnv('NEXT_PUBLIC_FEATURE_LEADERBOARD', 'true') === 'true',
    multiEntry: getEnv('NEXT_PUBLIC_FEATURE_MULTI_ENTRY', 'true') === 'true',
  },
  
  // Game Settings
  game: {
    minEntry: parseFloat(getEnv('NEXT_PUBLIC_MIN_ENTRY', '0.001')),
    maxEntry: parseFloat(getEnv('NEXT_PUBLIC_MAX_ENTRY', '10')),
    maxEntries: parseInt(getEnv('NEXT_PUBLIC_MAX_ENTRIES', '10'), 10),
    roundDuration: parseInt(getEnv('NEXT_PUBLIC_ROUND_DURATION', '86400'), 10), // 24 hours in seconds
    houseFee: parseFloat(getEnv('NEXT_PUBLIC_HOUSE_FEE', '0.05')), // 5%
  },
  
  // Staking Settings
  staking: {
    minStake: parseFloat(getEnv('NEXT_PUBLIC_MIN_STAKE', '0.01')),
    lockPeriod: parseInt(getEnv('NEXT_PUBLIC_LOCK_PERIOD', '7'), 10), // days
    apr: parseFloat(getEnv('NEXT_PUBLIC_STAKING_APR', '12')),
  },
  
  // API
  api: {
    baseUrl: getEnv('NEXT_PUBLIC_API_URL', '/api'),
    timeout: parseInt(getEnv('NEXT_PUBLIC_API_TIMEOUT', '30000'), 10),
  },
  
  // Social Links
  social: {
    twitter: getEnv('NEXT_PUBLIC_TWITTER_URL', 'https://twitter.com/baserush'),
    discord: getEnv('NEXT_PUBLIC_DISCORD_URL', 'https://discord.gg/baserush'),
    telegram: getEnv('NEXT_PUBLIC_TELEGRAM_URL', ''),
    github: getEnv('NEXT_PUBLIC_GITHUB_URL', 'https://github.com/baserush'),
  },
  
  // External URLs
  urls: {
    explorer: getEnv('NEXT_PUBLIC_EXPLORER_URL', 'https://basescan.org'),
    docs: getEnv('NEXT_PUBLIC_DOCS_URL', 'https://docs.baserush.xyz'),
    support: getEnv('NEXT_PUBLIC_SUPPORT_URL', ''),
  },
}

/**
 * Get contract address by name
 * @param {string} name - Contract name
 * @returns {string}
 */
export function getContractAddress(name) {
  return config.contracts[name] || ''
}

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export function isFeatureEnabled(feature) {
  return config.features[feature] ?? false
}

/**
 * Get explorer URL for address or transaction
 * @param {string} hashOrAddress - Hash or address
 * @param {string} type - 'tx' or 'address'
 * @returns {string}
 */
export function getExplorerUrl(hashOrAddress, type = 'tx') {
  return `${config.urls.explorer}/${type}/${hashOrAddress}`
}

/**
 * Validate required configuration
 * @returns {object} - Validation result
 */
export function validateConfig() {
  const errors = []
  const warnings = []

  // Check critical config
  if (!config.walletConnectProjectId && isProduction) {
    errors.push('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
  }

  // Check optional config
  if (!config.analyticsEndpoint) {
    warnings.push('NEXT_PUBLIC_ANALYTICS_ENDPOINT is not set - analytics disabled')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export default config
