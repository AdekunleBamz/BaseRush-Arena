/**
 * Error Reporting Service
 * Captures and reports errors for debugging
 */

const ERROR_ENDPOINT = process.env.NEXT_PUBLIC_ERROR_ENDPOINT || null

/**
 * Error severity levels
 */
export const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
}

/**
 * Error categories
 */
export const CATEGORY = {
  WALLET: 'wallet',
  CONTRACT: 'contract',
  NETWORK: 'network',
  UI: 'ui',
  UNKNOWN: 'unknown',
}

/**
 * Report an error to the error tracking service
 * @param {Error} error - The error object
 * @param {object} context - Additional context
 */
export async function reportError(error, context = {}) {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    severity: context.severity || SEVERITY.ERROR,
    category: context.category || CATEGORY.UNKNOWN,
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...context,
    },
    metadata: {
      nodeEnv: process.env.NODE_ENV,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
    },
  }

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Report]', errorReport)
  }

  // Store locally
  storeErrorLocally(errorReport)

  // Send to error endpoint if available
  if (ERROR_ENDPOINT) {
    try {
      await fetch(ERROR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      })
    } catch (e) {
      console.warn('Failed to send error report:', e)
    }
  }
}

/**
 * Store error locally for debugging
 */
function storeErrorLocally(errorReport) {
  if (typeof window === 'undefined') return

  try {
    const stored = JSON.parse(localStorage.getItem('baserush_errors') || '[]')
    const updated = [...stored, errorReport].slice(-50) // Keep last 50 errors
    localStorage.setItem('baserush_errors', JSON.stringify(updated))
  } catch (e) {
    console.warn('Failed to store error locally:', e)
  }
}

/**
 * Get stored errors for debugging
 */
export function getStoredErrors() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem('baserush_errors') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear stored errors
 */
export function clearStoredErrors() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('baserush_errors')
}

/**
 * Report a contract error
 */
export function reportContractError(error, contractName, functionName) {
  return reportError(error, {
    category: CATEGORY.CONTRACT,
    contractName,
    functionName,
    severity: SEVERITY.ERROR,
  })
}

/**
 * Report a wallet error
 */
export function reportWalletError(error, action) {
  return reportError(error, {
    category: CATEGORY.WALLET,
    action,
    severity: SEVERITY.WARNING,
  })
}

/**
 * Report a network error
 */
export function reportNetworkError(error, request) {
  return reportError(error, {
    category: CATEGORY.NETWORK,
    request,
    severity: SEVERITY.ERROR,
  })
}

/**
 * Create a global error handler
 */
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return

  // Catch unhandled errors
  window.onerror = (message, source, lineno, colno, error) => {
    reportError(error || new Error(message), {
      source,
      lineno,
      colno,
      severity: SEVERITY.CRITICAL,
    })
  }

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason))
    
    reportError(error, {
      type: 'unhandledRejection',
      severity: SEVERITY.ERROR,
    })
  })
}

/**
 * Wrap a function with error reporting
 */
export function withErrorReporting(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      reportError(error, context)
      throw error
    }
  }
}

export default {
  reportError,
  reportContractError,
  reportWalletError,
  reportNetworkError,
  getStoredErrors,
  clearStoredErrors,
  setupGlobalErrorHandler,
  withErrorReporting,
  SEVERITY,
  CATEGORY,
}
