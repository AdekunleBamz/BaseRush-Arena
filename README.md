# ⚡ BaseRush Arena - Enhanced Prediction Game dApp

**A feature-rich Web3 prediction game on Base Network with achievements, analytics, and modern UX!** ✅

## 🚀 Quick Start (2 Commands)

```bash
npm install
npm run dev
```

Open http://localhost:3000

**That's it!** Modern dApp with no build errors! 🎉

## 📦 What's Included

- ✅ Next.js 14 + React 18 + TypeScript ready
- ✅ WalletConnect/Reown AppKit integration
- ✅ Wagmi + Viem for contract interactions
- ✅ All contracts connected (GamePool, RewardVault, AchievementNFT)
- ✅ Sound effects and theme system
- ✅ Comprehensive error handling
- ✅ Accessibility features (ARIA, keyboard navigation)
- ✅ Performance optimizations (memoization, loading states)
- ✅ Data visualization (performance charts)
- ✅ Gamification (achievements, streaks)
- ✅ Settings panel with preferences
- ✅ Help & tutorial system

## 📝 Contract Addresses (Base Mainnet)

- **GamePool**: `0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1`
- **RewardVault**: `0xb6339F1857Ab28105472F1827C0D7948e8c3608D`
- **AchievementNFT**: `0x1C9a074Eba68cbEf15BCeab209743388786A9756`

## 🎮 Features

### 🎯 Game Tab
- Enter prediction rounds (0.0001 ETH entry fee)
- Choose from 3 prediction options (0, 1, 2)
- Multi-entry support (up to 10x entries)
- 1-hour prediction rounds with auto-resolution
- Real-time transaction status and confirmations
- Sound feedback for actions

### 💰 Stake Tab
- Stake ETH to earn passive rewards (1% per hour APY)
- Minimum stake: 0.0001 ETH
- Claim rewards or compound for higher yields
- Real-time reward calculations
- Staking statistics and history

### 🏆 Achievements Tab
- Unlockable achievement system with milestones
- Win streaks and performance-based badges
- Visual progress tracking
- Achievement notifications with animations
- Current/best streak counters

### 📊 Leaderboard Tab
- Sortable leaderboard by entries and wins
- Real-time player statistics
- Performance metrics and rankings

### ⚙️ Additional Features

#### User Experience
- **Dark/Light Theme**: Toggle with button or 'T' key
- **Sound Effects**: Enable/disable audio feedback
- **Performance Chart**: Visualize game history and trends
- **Settings Panel**: Customize preferences and accessibility
- **Help & Tutorial**: Comprehensive in-app guidance

#### Accessibility
- Full keyboard navigation support
- Screen reader compatible (ARIA labels, semantic HTML)
- High contrast mode support
- Reduced motion preferences
- Focus indicators and skip links

#### Technical Features
- Error handling with user-friendly messages
- Loading states for all contract interactions
- Memoized calculations for performance
- Local storage for user preferences
- Responsive design for all devices

## 🎯 How to Play

1. **Connect Wallet**: Use the wallet button to connect your Web3 wallet
2. **Choose Prediction**: Select 0, 1, or 2 for your prediction
3. **Enter Game**: Click "Enter Game" or use Ctrl/Cmd + Enter
4. **Wait for Results**: Contract resolves predictions every hour
5. **Collect Winnings**: Winners receive ETH from the prize pool
6. **Build Streaks**: Maintain winning streaks for achievements

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Web3 wallet (MetaMask, etc.)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles and themes
│   ├── layout.js       # Root layout with providers
│   └── page.js         # Main game interface
├── components/         # Reusable UI components
└── lib/               # Utilities and configurations
    ├── contracts.js   # Contract addresses and ABIs
    ├── theme-context.js # Theme management
    ├── sound-context.js # Audio effects
    └── web3.js        # Web3 utilities
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution process.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This is a Web3 gambling dApp. Please gamble responsibly. Only use funds you can afford to lose. Smart contract interactions carry financial risk.
- Sortable columns (entries, wins, win rate)
- Manual refresh functionality

### Chat Tab
- Real-time chat with other players
- Auto-scroll to latest messages
- Enter key support for sending

### Notifications Tab
- Filter by notification type (win, prize, entry, stake)
- Clear all notifications
- Timestamp display

### Additional Features
- Dark/Light theme toggle
- Sound effects toggle
- Responsive design
- Transaction status feedback

## �️ Development

### Project Structure
```
src/
├── app/
│   ├── globals.css          # Global styles with themes
│   ├── layout.js            # Root layout with providers
│   └── page.js              # Main game page
├── components/
│   ├── Chat.js              # Real-time chat component
│   ├── Leaderboard.js       # Sortable leaderboard
│   ├── Loading.js           # Loading spinner with animations
│   ├── Notifications.js     # Filterable notifications
│   └── ErrorMessage.js      # Error display component
└── lib/
    ├── contracts.js         # Contract ABIs and addresses
    ├── sound-context.js     # Sound effects provider
    ├── theme-context.js     # Theme provider
    └── web3.js              # Web3 configuration
```

### Key Technologies
- **Next.js 14** - React framework
- **Wagmi** - Ethereum interactions
- **Reown AppKit** - Wallet connection
- **Base Network** - L2 blockchain
- **Tailwind-like CSS** - Custom styling

## �🚀 Deploy to Vercel

```bash
npm i -g vercel
vercel
vercel --prod
```

Get your URL and update `public/.well-known/farcaster.json`

## 📊 Transaction Strategy

**Every hour with 8 wallets:**

1. Wallets 1-4: Multi-entry 5x on Option A
2. Wallets 5-8: Multi-entry 5x on Option B  
3. Winners: Claim prizes
4. All: Stake/claim/compound

**Result**: 170+ transactions/day = Top 50-100 rank! 🎯

## 🎨 Images

All images are SVG (no build needed):
- ✅ `public/images/icon.svg`
- ✅ `public/images/splash.svg`
- ✅ `public/images/og-image.svg`
- ✅ `public/images/screenshot-1.svg`
- ✅ `public/favicon.svg`

## 📱 Update for Farcaster

After deploying, edit `public/.well-known/farcaster.json`:

```json
{
  "frame": {
    "iconUrl": "https://YOUR-URL.vercel.app/images/icon.svg",
    "splashImageUrl": "https://YOUR-URL.vercel.app/images/splash.svg",
    "homeUrl": "https://YOUR-URL.vercel.app"
  }
}
```

Then redeploy: `vercel --prod`

## 🎯 Success!

- ✅ No build errors
- ✅ No canvas dependency
- ✅ Works on Mac/Linux/Windows
- ✅ Ready to deploy immediately

**Start generating transactions NOW!** 🚀
