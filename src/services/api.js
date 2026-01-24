/**
 * API Service Layer
 * Centralized API calls with error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status, code, data = null) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
    this.data = data
  }

  static fromResponse(response, data) {
    return new APIError(
      data?.message || response.statusText || 'Unknown error',
      response.status,
      data?.code || `HTTP_${response.status}`,
      data
    )
  }
}

/**
 * Request interceptor - add auth headers, etc.
 */
function getDefaultHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const config = {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    // Handle empty responses
    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
      throw APIError.fromResponse(response, data)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
    }

    // JSON parse errors
    if (error instanceof SyntaxError) {
      throw new APIError('Invalid response from server.', 500, 'PARSE_ERROR')
    }

    throw error
  }
}

/**
 * HTTP method helpers
 */
export const api = {
  get: (endpoint, options = {}) =>
    fetchAPI(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint, data, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    fetchAPI(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * Game API endpoints
 */
export const gameAPI = {
  getCurrentRound: () => api.get('/game/round/current'),
  
  getRoundById: (roundId) => api.get(`/game/round/${roundId}`),
  
  getRoundHistory: (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/game/rounds?${searchParams}`)
  },
  
  getUserEntries: (address, params = {}) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/game/entries/${address}?${searchParams}`)
  },
  
  getLeaderboard: (params = { period: 'weekly', limit: 50 }) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/game/leaderboard?${searchParams}`)
  },
  
  getGameStats: () => api.get('/game/stats'),
}

/**
 * User API endpoints
 */
export const userAPI = {
  getProfile: (address) => api.get(`/user/${address}`),
  
  updateProfile: (address, data) => api.patch(`/user/${address}`, data),
  
  getStats: (address) => api.get(`/user/${address}/stats`),
  
  getAchievements: (address) => api.get(`/user/${address}/achievements`),
  
  getNotifications: (address, params = {}) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/user/${address}/notifications?${searchParams}`)
  },
  
  markNotificationRead: (address, notificationId) =>
    api.patch(`/user/${address}/notifications/${notificationId}`, { read: true }),
  
  markAllNotificationsRead: (address) =>
    api.patch(`/user/${address}/notifications`, { readAll: true }),
}

/**
 * Staking API endpoints
 */
export const stakingAPI = {
  getPoolStats: () => api.get('/staking/pool'),
  
  getUserStake: (address) => api.get(`/staking/${address}`),
  
  getRewardsHistory: (address, params = {}) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/staking/${address}/rewards?${searchParams}`)
  },
  
  getAPRHistory: (params = { days: 30 }) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/staking/apr/history?${searchParams}`)
  },
}

/**
 * Price API endpoints
 */
export const priceAPI = {
  getCurrentPrice: () => api.get('/price/eth'),
  
  getPriceHistory: (params = { period: '24h' }) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/price/history?${searchParams}`)
  },
  
  getMarketData: () => api.get('/price/market'),
}

/**
 * Health check
 */
export const healthAPI = {
  check: () => api.get('/health'),
  
  getStatus: () => api.get('/health/status'),
}

export default {
  api,
  gameAPI,
  userAPI,
  stakingAPI,
  priceAPI,
  healthAPI,
  APIError,
}
