/**
 * Hooks Index
 * Central export for all custom hooks
 */

// Data fetching hooks
export {
  useFetch,
  useMutation,
  useInfiniteQuery,
  useLazyQuery,
  prefetch,
  clearCache,
} from './useFetch'

// Window and DOM hooks
export {
  useWindowSize,
  useScrollPosition,
  useIsVisible,
  useScrollLock,
  useDocumentTitle,
  useFocus,
  useHover,
  useKeyPress,
  useOnlineStatus,
  usePrefersDarkMode,
} from './useWindow'

// Game hooks
export {
  useGame,
  useSubmitEntry,
  useClaimReward,
  useGameHistory,
  GameStatus,
  Prediction,
} from './useGame'

/**
 * Common hook patterns
 */

/**
 * useToggle - Boolean toggle hook
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, { toggle, setTrue, setFalse, setValue }]
}

/**
 * useAsync - Run async functions with loading state
 */
export function useAsync(asyncFn, immediate = false) {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setStatus('pending')
      setError(null)

      try {
        const result = await asyncFn(...args)
        setData(result)
        setStatus('success')
        return result
      } catch (err) {
        setError(err)
        setStatus('error')
        throw err
      }
    },
    [asyncFn]
  )

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}

/**
 * usePrevious - Track previous value
 */
export function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * useInterval - Declarative setInterval
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)

    return () => clearInterval(id)
  }, [delay])
}

/**
 * useTimeout - Declarative setTimeout
 */
export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback.current(), delay)

    return () => clearTimeout(id)
  }, [delay])
}

/**
 * useClipboard - Copy to clipboard
 */
export function useClipboard({ timeout = 2000 } = {}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setError(null)

        setTimeout(() => setCopied(false), timeout)
      } catch (err) {
        setError(err)
        setCopied(false)
      }
    },
    [timeout]
  )

  return { copy, copied, error }
}

/**
 * useMediaQuery - CSS media query hook
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (e) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * useDisclosure - Modal/drawer open state
 */
export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, onOpen, onClose, onToggle }
}

/**
 * useCounter - Counter with min/max bounds
 */
export function useCounter(initialValue = 0, { min, max, step = 1 } = {}) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((c) => (max !== undefined ? Math.min(c + step, max) : c + step))
  }, [max, step])

  const decrement = useCallback(() => {
    setCount((c) => (min !== undefined ? Math.max(c - step, min) : c - step))
  }, [min, step])

  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset, setCount }
}

// Import React hooks for the file
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
