/**
 * useOnClickOutside Hook
 * Detects clicks outside of a referenced element
 */
'use client'

import { useEffect, useRef } from 'react'

export function useOnClickOutside(handler, enabled = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const listener = (event) => {
      // Do nothing if clicking ref's element or its descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, enabled])

  return ref
}

export default useOnClickOutside
