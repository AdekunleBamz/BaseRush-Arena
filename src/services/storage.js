/**
 * Storage Service
 * Unified storage with localStorage/sessionStorage abstraction
 */

const STORAGE_PREFIX = 'baserush_'
const STORAGE_VERSION = 'v1'

/**
 * Create storage key with prefix
 */
function createKey(key) {
  return `${STORAGE_PREFIX}${STORAGE_VERSION}_${key}`
}

/**
 * Check if storage is available
 */
function isStorageAvailable(type) {
  if (typeof window === 'undefined') return false

  try {
    const storage = window[type]
    const test = '__storage_test__'
    storage.setItem(test, test)
    storage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * In-memory fallback storage
 */
const memoryStorage = new Map()

/**
 * Create storage instance
 */
function createStorage(storageType) {
  const isAvailable = isStorageAvailable(storageType)
  const storage = isAvailable ? window[storageType] : null

  return {
    /**
     * Get item from storage
     */
    get(key, defaultValue = null) {
      try {
        const fullKey = createKey(key)
        
        if (storage) {
          const item = storage.getItem(fullKey)
          if (item === null) return defaultValue
          
          const parsed = JSON.parse(item)
          
          // Check expiration
          if (parsed.expires && Date.now() > parsed.expires) {
            this.remove(key)
            return defaultValue
          }
          
          return parsed.value
        }
        
        // Memory fallback
        const item = memoryStorage.get(fullKey)
        if (!item) return defaultValue
        
        if (item.expires && Date.now() > item.expires) {
          memoryStorage.delete(fullKey)
          return defaultValue
        }
        
        return item.value
      } catch (error) {
        console.warn(`Storage get error for key "${key}":`, error)
        return defaultValue
      }
    },

    /**
     * Set item in storage
     */
    set(key, value, options = {}) {
      try {
        const fullKey = createKey(key)
        const { ttl } = options // TTL in milliseconds
        
        const item = {
          value,
          created: Date.now(),
          expires: ttl ? Date.now() + ttl : null,
        }
        
        if (storage) {
          storage.setItem(fullKey, JSON.stringify(item))
        } else {
          memoryStorage.set(fullKey, item)
        }
        
        return true
      } catch (error) {
        // Handle quota exceeded
        if (error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, clearing old items...')
          this.clearExpired()
          
          // Retry once
          try {
            const fullKey = createKey(key)
            const item = { value, created: Date.now(), expires: null }
            storage?.setItem(fullKey, JSON.stringify(item))
            return true
          } catch (retryError) {
            console.error('Storage set failed after clearing:', retryError)
          }
        }
        
        console.warn(`Storage set error for key "${key}":`, error)
        return false
      }
    },

    /**
     * Remove item from storage
     */
    remove(key) {
      try {
        const fullKey = createKey(key)
        
        if (storage) {
          storage.removeItem(fullKey)
        } else {
          memoryStorage.delete(fullKey)
        }
        
        return true
      } catch (error) {
        console.warn(`Storage remove error for key "${key}":`, error)
        return false
      }
    },

    /**
     * Check if key exists
     */
    has(key) {
      return this.get(key) !== null
    },

    /**
     * Get all keys with prefix
     */
    keys() {
      const keys = []
      const prefix = createKey('')
      
      if (storage) {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i)
          if (key?.startsWith(prefix)) {
            keys.push(key.replace(prefix, ''))
          }
        }
      } else {
        memoryStorage.forEach((_, key) => {
          if (key.startsWith(prefix)) {
            keys.push(key.replace(prefix, ''))
          }
        })
      }
      
      return keys
    },

    /**
     * Clear all items with prefix
     */
    clear() {
      try {
        const keys = this.keys()
        keys.forEach((key) => this.remove(key))
        return true
      } catch (error) {
        console.warn('Storage clear error:', error)
        return false
      }
    },

    /**
     * Clear expired items
     */
    clearExpired() {
      const keys = this.keys()
      let cleared = 0
      
      keys.forEach((key) => {
        const fullKey = createKey(key)
        
        try {
          let item
          if (storage) {
            const raw = storage.getItem(fullKey)
            item = raw ? JSON.parse(raw) : null
          } else {
            item = memoryStorage.get(fullKey)
          }
          
          if (item?.expires && Date.now() > item.expires) {
            this.remove(key)
            cleared++
          }
        } catch (e) {
          // Remove corrupted items
          this.remove(key)
          cleared++
        }
      })
      
      return cleared
    },

    /**
     * Get storage size info
     */
    getSize() {
      let used = 0
      const keys = this.keys()
      
      if (storage) {
        keys.forEach((key) => {
          const fullKey = createKey(key)
          const item = storage.getItem(fullKey)
          if (item) {
            used += item.length * 2 // UTF-16 = 2 bytes per char
          }
        })
      }
      
      return {
        used,
        usedKB: (used / 1024).toFixed(2),
        itemCount: keys.length,
      }
    },
  }
}

/**
 * Local storage instance (persistent)
 */
export const localStorage = createStorage('localStorage')

/**
 * Session storage instance (tab-scoped)
 */
export const sessionStorage = createStorage('sessionStorage')

/**
 * Common storage keys
 */
export const STORAGE_KEYS = {
  // User preferences
  THEME: 'theme',
  SOUND_ENABLED: 'sound_enabled',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  
  // User data
  WALLET_ADDRESS: 'wallet_address',
  LAST_CONNECTED_WALLET: 'last_connected_wallet',
  USER_PROFILE: 'user_profile',
  
  // Game state
  PENDING_ENTRIES: 'pending_entries',
  LAST_ROUND_SEEN: 'last_round_seen',
  
  // Cache
  PRICE_CACHE: 'price_cache',
  LEADERBOARD_CACHE: 'leaderboard_cache',
  
  // Session
  SESSION_ID: 'session_id',
  ONBOARDING_COMPLETE: 'onboarding_complete',
}

/**
 * Quick access helpers
 */
export const storage = {
  local: localStorage,
  session: sessionStorage,
  keys: STORAGE_KEYS,
  
  // Quick helpers
  getTheme: () => localStorage.get(STORAGE_KEYS.THEME, 'dark'),
  setTheme: (theme) => localStorage.set(STORAGE_KEYS.THEME, theme),
  
  getSoundEnabled: () => localStorage.get(STORAGE_KEYS.SOUND_ENABLED, true),
  setSoundEnabled: (enabled) => localStorage.set(STORAGE_KEYS.SOUND_ENABLED, enabled),
  
  getWalletAddress: () => localStorage.get(STORAGE_KEYS.WALLET_ADDRESS),
  setWalletAddress: (address) => localStorage.set(STORAGE_KEYS.WALLET_ADDRESS, address),
  clearWalletAddress: () => localStorage.remove(STORAGE_KEYS.WALLET_ADDRESS),
}

export default storage
