/**
 * Formatting Utility Functions
 * Provides consistent formatting for addresses, amounts, and dates
 */

/**
 * Truncates an Ethereum address for display
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Characters to show at start (default: 6)
 * @param {number} endChars - Characters to show at end (default: 4)
 * @returns {string} Truncated address (e.g., "0x1234...abcd")
 */
export function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Formats a large number with commas and optional decimals
 * @param {number|string|bigint} value - Number to format
 * @param {number} decimals - Decimal places to show (default: 2)
 * @returns {string} Formatted number (e.g., "1,234,567.89")
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return '0'
  
  const num = typeof value === 'bigint' ? Number(value) : Number(value)
  
  if (isNaN(num)) return '0'
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

/**
 * Formats ETH amount with appropriate precision
 * @param {string|number} value - ETH amount
 * @param {number} precision - Decimal precision (default: 6)
 * @returns {string} Formatted ETH amount
 */
export function formatETH(value, precision = 6) {
  if (!value) return '0 ETH'
  
  const num = parseFloat(value)
  if (isNaN(num)) return '0 ETH'
  
  // Dynamic precision based on value
  let displayPrecision = precision
  if (num >= 1) displayPrecision = 4
  if (num >= 100) displayPrecision = 2
  if (num < 0.0001) displayPrecision = 8
  
  return `${num.toFixed(displayPrecision)} ETH`
}

/**
 * Formats USD currency
 * @param {number} value - USD amount
 * @returns {string} Formatted USD (e.g., "$1,234.56")
 */
export function formatUSD(value) {
  if (value === null || value === undefined) return '$0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a percentage with optional sign
 * @param {number} value - Percentage value
 * @param {boolean} showSign - Whether to show +/- sign
 * @returns {string} Formatted percentage (e.g., "+12.5%")
 */
export function formatPercent(value, showSign = false) {
  if (value === null || value === undefined) return '0%'
  
  const num = Number(value)
  if (isNaN(num)) return '0%'
  
  const sign = showSign && num > 0 ? '+' : ''
  return `${sign}${num.toFixed(1)}%`
}

/**
 * Formats a timestamp as relative time
 * @param {number|Date} timestamp - Timestamp to format
 * @returns {string} Relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(timestamp) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 30) return 'Just now'
  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (weeks === 1) return '1 week ago'
  if (weeks < 4) return `${weeks} weeks ago`
  if (months === 1) return '1 month ago'
  if (months < 12) return `${months} months ago`
  if (years === 1) return '1 year ago'
  return `${years} years ago`
}

/**
 * Formats a timestamp as date/time string
 * @param {number|Date} timestamp - Timestamp to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date/time
 */
export function formatDateTime(timestamp, options = {}) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  return date.toLocaleString('en-US', { ...defaultOptions, ...options })
}

/**
 * Formats duration in milliseconds to human readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "2h 30m 15s")
 */
export function formatDuration(ms) {
  if (ms < 0) ms = 0
  
  const seconds = Math.floor(ms / 1000) % 60
  const minutes = Math.floor(ms / (1000 * 60)) % 60
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)
  
  return parts.join(' ')
}

/**
 * Formats bytes to human readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Formats a transaction hash for display
 * @param {string} hash - Transaction hash
 * @param {number} chars - Characters to show on each end
 * @returns {string} Truncated hash
 */
export function formatTxHash(hash, chars = 8) {
  if (!hash) return ''
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}
