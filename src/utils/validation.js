/**
 * Validation Utility Functions
 * Provides input validation for forms and contract interactions
 */

/**
 * Validates an Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} Whether the address is valid
 */
export function isValidAddress(address) {
  if (!address) return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validates a transaction hash
 * @param {string} hash - Transaction hash to validate
 * @returns {boolean} Whether the hash is valid
 */
export function isValidTxHash(hash) {
  if (!hash) return false
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * Validates an ETH amount
 * @param {string|number} amount - Amount to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result with isValid and error
 */
export function validateETHAmount(amount, options = {}) {
  const {
    min = 0,
    max = Infinity,
    allowZero = false,
  } = options

  const num = parseFloat(amount)
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' }
  }
  
  if (!allowZero && num === 0) {
    return { isValid: false, error: 'Amount cannot be zero' }
  }
  
  if (num < 0) {
    return { isValid: false, error: 'Amount cannot be negative' }
  }
  
  if (num < min) {
    return { isValid: false, error: `Minimum amount is ${min} ETH` }
  }
  
  if (num > max) {
    return { isValid: false, error: `Maximum amount is ${max} ETH` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates a prediction option
 * @param {number} option - Option to validate (0, 1, or 2)
 * @returns {boolean} Whether the option is valid
 */
export function isValidPredictionOption(option) {
  return [0, 1, 2].includes(option)
}

/**
 * Validates a multi-entry count
 * @param {number} count - Entry count to validate
 * @param {number} maxEntries - Maximum allowed entries
 * @returns {object} Validation result
 */
export function validateMultiEntryCount(count, maxEntries = 10) {
  if (!Number.isInteger(count)) {
    return { isValid: false, error: 'Entry count must be a whole number' }
  }
  
  if (count < 1) {
    return { isValid: false, error: 'Minimum entry count is 1' }
  }
  
  if (count > maxEntries) {
    return { isValid: false, error: `Maximum entry count is ${maxEntries}` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validates a username/display name
 * @param {string} name - Name to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export function validateUsername(name, options = {}) {
  const {
    minLength = 3,
    maxLength = 20,
    allowSpaces = true,
  } = options

  if (!name) {
    return { isValid: false, error: 'Name is required' }
  }
  
  if (name.length < minLength) {
    return { isValid: false, error: `Name must be at least ${minLength} characters` }
  }
  
  if (name.length > maxLength) {
    return { isValid: false, error: `Name must be less than ${maxLength} characters` }
  }
  
  if (!allowSpaces && /\s/.test(name)) {
    return { isValid: false, error: 'Name cannot contain spaces' }
  }
  
  // Check for valid characters
  if (!/^[a-zA-Z0-9_\s-]+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, numbers, underscores, and hyphens' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates a chat message
 * @param {string} message - Message to validate
 * @param {number} maxLength - Maximum message length
 * @returns {object} Validation result
 */
export function validateChatMessage(message, maxLength = 500) {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }
  
  if (message.length > maxLength) {
    return { isValid: false, error: `Message must be less than ${maxLength} characters` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input) return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array)
 * @param {*} value - Value to check
 * @returns {boolean} Whether the value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}
