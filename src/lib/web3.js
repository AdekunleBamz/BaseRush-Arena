'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'd9ee535d7d4ce234b0496f9efc38970b'

// 2. Set up Wagmi adapter
const networks = [base]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

// 3. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  features: {
    analytics: true,
  },
  metadata: {
    name: 'BaseRush Arena',
    description: 'Compete, stake, and earn on Base',
    url: 'https://baserush.app',
    icons: ['https://baserush.app/icon.png']
  }
})

// 4. Create query client
const queryClient = new QueryClient()

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export { wagmiAdapter }
