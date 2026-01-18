import { Web3Provider } from '../lib/web3'
import { ThemeProvider } from '../lib/theme-context'
import './globals.css'

export const metadata = {
  title: 'BaseRush Arena',
  description: 'Compete, stake, and earn on Base',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://your-domain.com/images/og-image.png',
    'fc:frame:button:1': 'Play Now',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
