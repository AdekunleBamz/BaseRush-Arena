// Root Layout Component
// Provides the main HTML structure and wraps the app with providers.
import { Web3Provider } from '../lib/web3'
import { ThemeProvider } from '../lib/theme-context'
import { SoundProvider } from '../lib/sound-context'
import './globals.css'

// Metadata for SEO and social sharing
export const metadata = {
  title: 'BaseRush Arena',
  description: 'Compete, stake, and earn on Base',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://your-domain.com/images/og-image.png',
    'fc:frame:button:1': 'Play Now',
  }
}

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap app with Web3, Theme, and Sound providers */}
        <Web3Provider>
          <ThemeProvider>
            <SoundProvider>
              {children}
            </SoundProvider>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
