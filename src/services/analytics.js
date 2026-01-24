/**
 * Analytics Service
 * Track user events and game statistics
 */

const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || null

/**
 * Event types for tracking
 */
export const EVENTS = {
  // Game events
  GAME_ENTER: 'game_enter',
  GAME_WIN: 'game_win',
  GAME_LOSS: 'game_loss',
  MULTI_ENTRY: 'multi_entry',
  PRIZE_CLAIMED: 'prize_claimed',
  
  // Staking events
  STAKE_DEPOSIT: 'stake_deposit',
  STAKE_WITHDRAW: 'stake_withdraw',
  REWARDS_CLAIMED: 'rewards_claimed',
  REWARDS_COMPOUNDED: 'rewards_compounded',
  
  // Achievement events
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  BADGE_CLAIMED: 'badge_claimed',
  STREAK_ACHIEVED: 'streak_achieved',
  
  // UI events
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  THEME_CHANGED: 'theme_changed',
  SOUND_TOGGLED: 'sound_toggled',
  TAB_CHANGED: 'tab_changed',
  SETTINGS_UPDATED: 'settings_updated',
  
  // Engagement events
  PAGE_VIEW: 'page_view',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  REFERRAL_CLICK: 'referral_click',
  SHARE_CLICKED: 'share_clicked',
  HELP_VIEWED: 'help_viewed',
}

/**
 * Analytics queue for batching events
 */
let eventQueue = []
let flushTimeout = null

/**
 * Track an analytics event
 * @param {string} eventName - Event name from EVENTS
 * @param {object} properties - Additional event properties
 */
export function trackEvent(eventName, properties = {}) {
  const event = {
    event: eventName,
    timestamp: Date.now(),
    properties: {
      ...properties,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    },
  }

  eventQueue.push(event)

  // Flush after a short delay to batch events
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEvents, 1000)
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties)
  }
}

/**
 * Flush queued events to analytics endpoint
 */
async function flushEvents() {
  if (eventQueue.length === 0) return

  const events = [...eventQueue]
  eventQueue = []
  flushTimeout = null

  if (!ANALYTICS_ENDPOINT) {
    // Store locally if no endpoint configured
    storeEventsLocally(events)
    return
  }

  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    })
  } catch (error) {
    console.warn('Failed to send analytics:', error)
    // Re-queue events on failure
    eventQueue = [...events, ...eventQueue]
  }
}

/**
 * Store events locally when no endpoint available
 */
function storeEventsLocally(events) {
  if (typeof window === 'undefined') return

  try {
    const stored = JSON.parse(localStorage.getItem('baserush_analytics') || '[]')
    const updated = [...stored, ...events].slice(-500) // Keep last 500 events
    localStorage.setItem('baserush_analytics', JSON.stringify(updated))
  } catch (error) {
    console.warn('Failed to store analytics locally:', error)
  }
}

/**
 * Get locally stored analytics
 */
export function getLocalAnalytics() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem('baserush_analytics') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear locally stored analytics
 */
export function clearLocalAnalytics() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('baserush_analytics')
}

/**
 * Track page view
 * @param {string} pageName - Page name
 */
export function trackPageView(pageName) {
  trackEvent(EVENTS.PAGE_VIEW, { page: pageName })
}

/**
 * Track wallet connection
 * @param {string} address - Wallet address
 */
export function trackWalletConnected(address) {
  trackEvent(EVENTS.WALLET_CONNECTED, {
    address: address?.slice(0, 10) + '...',
  })
}

/**
 * Track game entry
 * @param {object} params - Entry parameters
 */
export function trackGameEntry(params) {
  trackEvent(EVENTS.GAME_ENTER, {
    option: params.option,
    amount: params.amount,
    roundId: params.roundId,
  })
}

/**
 * Track game result
 * @param {boolean} won - Whether the user won
 * @param {object} params - Result parameters
 */
export function trackGameResult(won, params) {
  trackEvent(won ? EVENTS.GAME_WIN : EVENTS.GAME_LOSS, {
    amount: params.amount,
    roundId: params.roundId,
    streak: params.streak,
  })
}

/**
 * Track achievement unlock
 * @param {string} achievementId - Achievement ID
 * @param {string} achievementName - Achievement name
 */
export function trackAchievementUnlocked(achievementId, achievementName) {
  trackEvent(EVENTS.ACHIEVEMENT_UNLOCKED, {
    achievementId,
    achievementName,
  })
}

/**
 * Track stake action
 * @param {string} action - 'deposit' or 'withdraw'
 * @param {string} amount - Amount in ETH
 */
export function trackStakeAction(action, amount) {
  const event = action === 'deposit' ? EVENTS.STAKE_DEPOSIT : EVENTS.STAKE_WITHDRAW
  trackEvent(event, { amount })
}

/**
 * Identify user for analytics
 * @param {string} address - User wallet address
 * @param {object} traits - User traits
 */
export function identifyUser(address, traits = {}) {
  trackEvent('identify', {
    userId: address,
    ...traits,
  })
}

/**
 * Track session start
 */
export function trackSessionStart() {
  trackEvent(EVENTS.SESSION_START, {
    sessionId: Date.now().toString(36),
  })
}

/**
 * Track session end
 */
export function trackSessionEnd() {
  trackEvent(EVENTS.SESSION_END)
  // Force flush on session end
  flushEvents()
}

// Flush events when page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    trackSessionEnd()
  })
}

export default {
  trackEvent,
  trackPageView,
  trackWalletConnected,
  trackGameEntry,
  trackGameResult,
  trackAchievementUnlocked,
  trackStakeAction,
  identifyUser,
  trackSessionStart,
  trackSessionEnd,
  getLocalAnalytics,
  clearLocalAnalytics,
  EVENTS,
}
