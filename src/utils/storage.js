/**
 * Storage Utility Functions
 * Provides safe localStorage/sessionStorage operations with error handling
 */

const STORAGE_PREFIX = 'baserush_'

/**
 * Safely gets an item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function getLocalStorageItem(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined') return defaultValue
    
    const item = localStorage.getItem(STORAGE_PREFIX + key)
    if (item === null) return defaultValue
    
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safely sets an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Whether the operation was successful
 */
export function setLocalStorageItem(key, value) {
  try {
    if (typeof window === 'undefined') return false
    
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Safely removes an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Whether the operation was successful
 */
export function removeLocalStorageItem(key) {
  try {
    if (typeof window === 'undefined') return false
    
    localStorage.removeItem(STORAGE_PREFIX + key)
    return true
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Clears all app-related items from localStorage
 * @returns {boolean} Whether the operation was successful
 */
export function clearAppStorage() {
  try {
    if (typeof window === 'undefined') return false
    
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    return true
  } catch (error) {
    console.warn('Error clearing app storage:', error)
    return false
  }
}

/**
 * Gets an item from sessionStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function getSessionStorageItem(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined') return defaultValue
    
    const item = sessionStorage.getItem(STORAGE_PREFIX + key)
    if (item === null) return defaultValue
    
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Sets an item in sessionStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Whether the operation was successful
 */
export function setSessionStorageItem(key, value) {
  try {
    if (typeof window === 'undefined') return false
    
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error setting sessionStorage key "${key}":`, error)
    return false
  }
}

/**
 * Checks if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Gets the storage usage in bytes
 * @returns {object} Storage usage information
 */
export function getStorageUsage() {
  try {
    if (typeof window === 'undefined') {
      return { used: 0, total: 0, percentage: 0 }
    }
    
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        total += key.length + (value?.length || 0)
      }
    }
    
    // localStorage limit is typically around 5MB
    const limit = 5 * 1024 * 1024
    
    return {
      used: total,
      total: limit,
      percentage: (total / limit) * 100,
    }
  } catch (error) {
    console.warn('Error calculating storage usage:', error)
    return { used: 0, total: 0, percentage: 0 }
  }
}

/**
 * Exports all app data from localStorage
 * @returns {object} All stored app data
 */
export function exportAppData() {
  try {
    if (typeof window === 'undefined') return {}
    
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const cleanKey = key.replace(STORAGE_PREFIX, '')
        const value = localStorage.getItem(key)
        data[cleanKey] = value ? JSON.parse(value) : null
      }
    }
    
    return data
  } catch (error) {
    console.warn('Error exporting app data:', error)
    return {}
  }
}

/**
 * Imports app data to localStorage
 * @param {object} data - Data to import
 * @returns {boolean} Whether the import was successful
 */
export function importAppData(data) {
  try {
    if (typeof window === 'undefined' || !data) return false
    
    Object.entries(data).forEach(([key, value]) => {
      setLocalStorageItem(key, value)
    })
    
    return true
  } catch (error) {
    console.warn('Error importing app data:', error)
    return false
  }
}
