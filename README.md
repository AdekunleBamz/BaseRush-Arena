# BaseRush Arena - Farcaster Mini App

A competitive gaming platform on Base with prediction markets, staking, and achievement NFTs.

## 🎯 Features

- **Prediction Game**: Hourly rounds with Option A vs Option B
- **Staking Pool**: Earn rewards by staking ETH
- **Achievement NFTs**: Collect badges for milestones
- **Multi-Entry**: Enter games up to 10x at once
- **Referral System**: Earn bonuses for referrals

## 📦 Deployed Contracts

- **GamePool**: `0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1`
- **RewardVault**: `0xb6339F1857Ab28105472F1827C0D7948e8c3608D`
- **AchievementNFT**: `0x1C9a074Eba68cbEf15BCeab209743388786A9756`

All deployed on **Base Mainnet**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Images

```bash
npm run generate-images
```

This creates all required Farcaster images:
- `icon.png` (512x512)
- `splash.png` (1080x1920)
- `og-image.png` (1200x630)
- `screenshot-1.png` (750x1334)
- `favicon.ico` (32x32)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📱 Farcaster Mini App Setup

### Required Files

- ✅ `public/.well-known/farcaster.json` - Manifest file
- ✅ `public/images/icon.png` - App icon
- ✅ `public/images/splash.png` - Splash screen
- ✅ `public/images/og-image.png` - Open Graph image
- ✅ `public/images/screenshot-1.png` - Screenshot
- ✅ `public/favicon.ico` - Favicon

### Update Manifest

Edit `public/.well-known/farcaster.json`:

1. Replace `your-domain.com` with your actual domain
2. Add your Farcaster FID if you have one
3. Update account association (optional for initial testing)

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=d9ee535d7d4ce234b0496f9efc38970b
NEXT_PUBLIC_GAME_POOL=0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1
NEXT_PUBLIC_REWARD_VAULT=0xb6339F1857Ab28105472F1827C0D7948e8c3608D
NEXT_PUBLIC_ACHIEVEMENT_NFT=0x1C9a074Eba68cbEf15BCeab209743388786A9756
```

## 📤 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically
4. Add custom domain

### Option 2: Netlify

1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Option 3: Self-Hosted

```bash
npm run build
npm start
```

## 🎮 How to Use

### For Players (Your 8 Test Wallets)

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Enter Game**: Choose Option A or B, enter with 0.0001 ETH
3. **Multi-Entry**: Set count to 2-10 for multiple entries
4. **Wait for Round**: Rounds finalize after 1 hour
5. **Claim Prize**: If you win, claim your share
6. **Stake ETH**: Go to Stake tab, stake minimum 0.0001 ETH
7. **Claim Rewards**: Earn 1% per hour, claim or compound
8. **Collect Badges**: Go to Badges tab, claim achievements

### Transaction Volume Strategy

**Generate 170+ transactions/day:**

- **Morning (8 wallets)**: Each enters game (8 TX)
- **Afternoon (8 wallets)**: Multi-entry 5x each (8 TX)
- **Evening (8 wallets)**: Stake + claim (16 TX)
- **Night (4 wallets)**: Compound or unstake (4-8 TX)

**Repeat every hour** for maximum volume!

## 🏆 Achievements

| Badge | Requirement |
|-------|-------------|
| First Entry | Make your first game entry |
| Ten Entries | Reach 10 total entries |
| Fifty Entries | Reach 50 total entries |
| First Win | Win your first round |
| Five Wins | Win 5 rounds |
| Staker | Make your first stake |
| Referrer | Refer another player |
| Whale | Stake large amount |
| Streak 3 | 3 day activity streak |
| Legend | Reach 100+ entries |

## 📊 Expected Results

With your 8-wallet testing setup:

- **Daily Transactions**: 170+
- **Daily Fees Generated**: ~0.00015 ETH
- **Active Addresses**: 8 unique wallets
- **Contract Interactions**: 3 contracts with cross-calls

This should rank you in **Top 100** of Base Builders leaderboard!

## 🐛 Troubleshooting

### Images Not Showing

```bash
npm run generate-images
```

### Wallet Not Connecting

- Check WalletConnect Project ID
- Ensure you're on Base network
- Clear browser cache

### Transaction Failing

- Ensure you have enough ETH (0.0001 + gas)
- Check contract addresses are correct
- Wait for previous transaction to confirm

## 📝 License

MIT

## 🤝 Support

Need help? Open an issue or reach out on Farcaster [@bamzzz](https://warpcast.com/bamzzz)

---

Built for **Base Top Builders** competition 🚀
