# ⚡ BaseRush Arena - EASY VERSION

**No build errors! Just works!** ✅

## 🚀 Quick Start (2 Commands)

```bash
npm install
npm run dev
```

Open http://localhost:3000

**That's it!** No canvas, no compilation errors! 🎉

## 📦 What's Included

- ✅ Next.js 14 + React 18
- ✅ WalletConnect/Reown AppKit
- ✅ All 3 contracts connected
- ✅ SVG images (no build needed!)
- ✅ Farcaster manifest ready

## 📝 Contract Addresses

- **GamePool**: `0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1`
- **RewardVault**: `0xb6339F1857Ab28105472F1827C0D7948e8c3608D`
- **AchievementNFT**: `0x1C9a074Eba68cbEf15BCeab209743388786A9756`

All on **Base Mainnet**.

## 🎮 Features

### Game Tab
- Enter prediction rounds (0.0001 ETH)
- Multi-entry up to 10x
- 1-hour rounds
- Auto prize distribution

### Stake Tab
- Stake 0.0001 ETH minimum
- Earn 1% per hour
- Claim or compound rewards

### Badges Tab
- 10 achievement NFTs
- Free minting (gas only)

### Leaderboard Tab
- View top players by entries and wins
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
