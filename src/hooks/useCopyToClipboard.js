/**
 * useCopyToClipboard Hook
 * Provides clipboard copy functionality with feedback
 */
'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const copy = useCallback(async (text) => {
    if (!text) {
      setError(new Error('Nothing to copy'))
      return false
    }

    try {
      // Try using the modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!successful) {
          throw new Error('Copy command was unsuccessful')
        }
      }
      
      setCopied(true)
      setError(null)
      
      // Reset copied state after delay
      setTimeout(() => {
        setCopied(false)
      }, resetDelay)
      
      return true
    } catch (err) {
      setError(err)
      setCopied(false)
      return false
    }
  }, [resetDelay])

  const reset = useCallback(() => {
    setCopied(false)
    setError(null)
  }, [])

  return { copied, error, copy, reset }
}

export default useCopyToClipboard
