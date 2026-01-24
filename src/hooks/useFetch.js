/**
 * Data Fetching Hooks
 * React hooks for async data fetching with caching
 */

'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

/**
 * Simple in-memory cache
 */
const cache = new Map()
const cacheTimeouts = new Map()

function setCache(key, data, ttl = 60000) {
  cache.set(key, { data, timestamp: Date.now() })
  
  // Clear existing timeout
  if (cacheTimeouts.has(key)) {
    clearTimeout(cacheTimeouts.get(key))
  }
  
  // Set expiration timeout
  const timeout = setTimeout(() => {
    cache.delete(key)
    cacheTimeouts.delete(key)
  }, ttl)
  
  cacheTimeouts.set(key, timeout)
}

function getCache(key, maxAge = 60000) {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > maxAge) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

/**
 * useFetch Hook
 * Fetch data with loading/error states
 */
export function useFetch(url, options = {}) {
  const {
    enabled = true,
    cacheKey,
    cacheTtl = 60000,
    onSuccess,
    onError,
    transform,
    initialData = null,
    refetchInterval,
    retryCount = 0,
    retryDelay = 1000,
  } = options

  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const retriesRef = useRef(0)

  const fetchData = useCallback(async (isRefetch = false) => {
    if (!url || !enabled) return

    const key = cacheKey || url
    
    // Check cache first
    if (!isRefetch) {
      const cached = getCache(key, cacheTtl)
      if (cached) {
        setData(cached)
        return cached
      }
    }

    if (isRefetch) {
      setIsRefetching(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let result = await response.json()
      
      if (transform) {
        result = transform(result)
      }

      setData(result)
      setCache(key, result, cacheTtl)
      retriesRef.current = 0
      onSuccess?.(result)
      
      return result
    } catch (err) {
      // Retry logic
      if (retriesRef.current < retryCount) {
        retriesRef.current++
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return fetchData(isRefetch)
      }

      setError(err)
      onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
      setIsRefetching(false)
    }
  }, [url, enabled, cacheKey, cacheTtl, onSuccess, onError, transform, retryCount, retryDelay])

  const refetch = useCallback(() => fetchData(true), [fetchData])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return
    
    const interval = setInterval(refetch, refetchInterval)
    return () => clearInterval(interval)
  }, [refetchInterval, enabled, refetch])

  return {
    data,
    error,
    isLoading,
    isRefetching,
    refetch,
    isError: !!error,
    isSuccess: !!data && !error,
  }
}

/**
 * useMutation Hook
 * For POST/PUT/DELETE operations
 */
export function useMutation(mutationFn, options = {}) {
  const { onSuccess, onError, onSettled, invalidateKeys = [] } = options

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (variables) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      setData(result)
      
      // Invalidate cache keys
      invalidateKeys.forEach(key => cache.delete(key))
      
      onSuccess?.(result, variables)
      onSettled?.(result, null, variables)
      
      return result
    } catch (err) {
      setError(err)
      onError?.(err, variables)
      onSettled?.(null, err, variables)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn, onSuccess, onError, onSettled, invalidateKeys])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    mutate,
    mutateAsync: mutate,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !!data && !error,
    reset,
  }
}

/**
 * useInfiniteQuery Hook
 * For paginated/infinite scroll data
 */
export function useInfiniteQuery(getUrl, options = {}) {
  const {
    enabled = true,
    getNextPageParam,
    initialPageParam = 1,
    onSuccess,
    onError,
  } = options

  const [pages, setPages] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const pageParamRef = useRef(initialPageParam)

  const data = useMemo(() => ({
    pages,
    pageParams: pages.map((_, i) => initialPageParam + i),
  }), [pages, initialPageParam])

  const fetchPage = useCallback(async (pageParam, isNext = false) => {
    if (!enabled) return

    const url = getUrl(pageParam)
    
    if (isNext) {
      setIsFetchingNextPage(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const result = await response.json()
      
      if (isNext) {
        setPages(prev => [...prev, result])
      } else {
        setPages([result])
      }

      const nextParam = getNextPageParam?.(result, pages)
      setHasNextPage(nextParam !== undefined && nextParam !== null)
      pageParamRef.current = nextParam ?? pageParam + 1

      onSuccess?.(result)
      return result
    } catch (err) {
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
      setIsFetchingNextPage(false)
    }
  }, [enabled, getUrl, getNextPageParam, pages, onSuccess, onError])

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      return fetchPage(pageParamRef.current, true)
    }
  }, [hasNextPage, isFetchingNextPage, fetchPage])

  const refetch = useCallback(() => {
    pageParamRef.current = initialPageParam
    return fetchPage(initialPageParam)
  }, [initialPageParam, fetchPage])

  // Initial fetch
  useEffect(() => {
    if (enabled && pages.length === 0) {
      fetchPage(initialPageParam)
    }
  }, [enabled])

  return {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isError: !!error,
    isSuccess: pages.length > 0 && !error,
  }
}

/**
 * useLazyQuery Hook
 * Fetch on demand (not on mount)
 */
export function useLazyQuery(url, options = {}) {
  const [shouldFetch, setShouldFetch] = useState(false)

  const result = useFetch(url, {
    ...options,
    enabled: shouldFetch,
  })

  const fetch = useCallback(() => {
    setShouldFetch(true)
  }, [])

  return [fetch, result]
}

/**
 * Prefetch helper
 */
export async function prefetch(url, options = {}) {
  const { cacheKey, cacheTtl = 60000, transform } = options
  
  const key = cacheKey || url
  
  // Already cached
  if (getCache(key, cacheTtl)) return
  
  try {
    const response = await fetch(url)
    if (!response.ok) return
    
    let data = await response.json()
    if (transform) data = transform(data)
    
    setCache(key, data, cacheTtl)
  } catch (err) {
    console.warn('Prefetch failed:', url, err)
  }
}

/**
 * Clear cache helper
 */
export function clearCache(keys) {
  if (keys) {
    keys.forEach(key => {
      cache.delete(key)
      if (cacheTimeouts.has(key)) {
        clearTimeout(cacheTimeouts.get(key))
        cacheTimeouts.delete(key)
      }
    })
  } else {
    cache.clear()
    cacheTimeouts.forEach(timeout => clearTimeout(timeout))
    cacheTimeouts.clear()
  }
}

export default {
  useFetch,
  useMutation,
  useInfiniteQuery,
  useLazyQuery,
  prefetch,
  clearCache,
}
