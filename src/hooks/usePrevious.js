/**
 * usePrevious Hook
 * Stores the previous value of a state
 */
'use client'

import { useRef, useEffect } from 'react'

export function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
