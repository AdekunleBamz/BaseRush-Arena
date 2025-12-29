'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useEffect, useState } from 'react'

const projectId = 'd9ee535d7d4ce234b0496f9efc38970b'
const networks = [base]

// Initialize adapter only once
let wagmiAdapterInstance = null
let appKitInitialized = false

function getWagmiAdapter() {
  if (!wagmiAdapterInstance) {
    try {
      wagmiAdapterInstance = new WagmiAdapter({
        networks,
        projectId,
        ssr: true,
        enableCoinbase: true,
        enableEIP6963: true,
      })
    } catch (error) {
      console.error('Error initializing WagmiAdapter:', error)
      throw error
    }
  }
  return wagmiAdapterInstance
}

function initializeAppKit() {
  if (typeof window === 'undefined' || appKitInitialized) {
    return
  }
  
  try {
    const adapter = getWagmiAdapter()
    createAppKit({
      adapters: [adapter],
      networks,
      projectId,
      features: {
        analytics: false,
        email: false,
        socials: [],
      },
      metadata: {
        name: 'BaseRush Arena',
        description: 'Compete, stake, and earn on Base',
        url: 'https://baserush.app',
        icons: ['https://baserush.app/icon.png']
      },
      allWallets: 'SHOW',
      enableEIP6963: true,
      enableCoinbase: true,
    })
    appKitInitialized = true
  } catch (error) {
    console.error('Error initializing AppKit:', error)
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [adapter, setAdapter] = useState(null)

  useEffect(() => {
    try {
      const wagmiAdapter = getWagmiAdapter()
      initializeAppKit()
      setAdapter(wagmiAdapter)
      setMounted(true)
    } catch (error) {
      console.error('Error initializing Web3Provider:', error)
    }
  }, [])

  // During SSR and initial hydration, render a placeholder
  if (!mounted || !adapter) {
    return (
      <div style={{ minHeight: '100vh' }}>
        {/* Loading placeholder to prevent hydration mismatch */}
      </div>
    )
  }

  return (
    <WagmiProvider config={adapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
