/**
 * useWindowSize Hook
 * Track window dimensions with debouncing
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Debounce helper
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Hook to track window size with breakpoint detection
 */
export function useWindowSize(debounceMs = 100) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const handleResize = useCallback(
    debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, debounceMs),
    [debounceMs]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set initial size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Breakpoint helpers
  const breakpoints = {
    isMobile: windowSize.width < 640,
    isTablet: windowSize.width >= 640 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    isLargeDesktop: windowSize.width >= 1280,
  }

  return {
    ...windowSize,
    ...breakpoints,
  }
}

/**
 * useScrollPosition Hook
 * Track scroll position
 */
export function useScrollPosition(threshold = 0) {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    isScrolled: false,
    direction: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      const currentX = window.scrollX

      setScrollPosition({
        x: currentX,
        y: currentY,
        isScrolled: currentY > threshold,
        direction: currentY > lastY ? 'down' : currentY < lastY ? 'up' : null,
      })

      lastY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrollPosition
}

/**
 * useIsVisible Hook
 * Track element visibility using Intersection Observer
 */
export function useIsVisible(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isVisible
}

/**
 * useScrollLock Hook
 * Lock body scroll (useful for modals)
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    if (locked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [locked])
}

/**
 * useDocumentTitle Hook
 * Set document title
 */
export function useDocumentTitle(title, restoreOnUnmount = true) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const originalTitle = document.title
    document.title = title

    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle
      }
    }
  }, [title, restoreOnUnmount])
}

/**
 * useFocus Hook
 * Manage focus state
 */
export function useFocus() {
  const [isFocused, setIsFocused] = useState(false)

  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  }

  return { isFocused, focusProps }
}

/**
 * useHover Hook
 * Track hover state
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false)

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return { isHovered, hoverProps }
}

/**
 * useKeyPress Hook
 * Detect specific key presses
 */
export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [targetKey])

  return keyPressed
}

/**
 * useOnlineStatus Hook
 * Track online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * usePrefersDarkMode Hook
 * Detect user's color scheme preference
 */
export function usePrefersDarkMode() {
  const [prefersDark, setPrefersDark] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      setPrefersDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersDark
}

export default {
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
}
