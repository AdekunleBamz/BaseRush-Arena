# 🚀 BaseRush Arena - Complete Deployment Guide

## 📋 Pre-Deployment Checklist

- ✅ All 3 contracts deployed and verified on Base
- ✅ Contracts linked together (setGamePool, setRewardVault, setAchievementNFT called)
- ✅ WalletConnect Project ID obtained from https://cloud.reown.com
- ✅ Domain ready (for production) or use Vercel subdomain

## 🏗️ Step-by-Step Deployment

### Step 1: Prepare Your Environment

```bash
cd BaseRushArena
npm install
```

Wait for all dependencies to install (~2-3 minutes)

### Step 2: Generate Images

```bash
npm run generate-images
```

This creates all required Farcaster images in `public/images/`

Verify files exist:
- ✅ `public/images/icon.png`
- ✅ `public/images/splash.png`
- ✅ `public/images/og-image.png`
- ✅ `public/images/screenshot-1.png`
- ✅ `public/favicon.ico`

### Step 3: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser:

1. Click "Connect Wallet"
2. Connect with MetaMask/WalletConnect
3. Ensure you're on Base network
4. Try entering a game with 0.0001 ETH
5. Check staking tab works
6. Check badges tab works

If everything works, proceed to deployment!

### Step 4: Deploy to Vercel (Recommended)

#### Option A: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? baserush-arena
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit: BaseRush Arena"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

3. **Get Your URL**:
   - Vercel will give you a URL like `baserush-arena.vercel.app`
   - Test it in your browser

### Step 5: Update Farcaster Manifest

Once deployed, update `public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4...",
    "payload": "eyJkb21haW4iOiJiYXNlcnVzaC5hcHAifQ==",
    "signature": "MHg..."
  },
  "frame": {
    "version": "next",
    "name": "BaseRush Arena",
    "iconUrl": "https://YOUR-DEPLOYED-URL.vercel.app/images/icon.png",
    "splashImageUrl": "https://YOUR-DEPLOYED-URL.vercel.app/images/splash.png",
    "splashBackgroundColor": "#667eea",
    "homeUrl": "https://YOUR-DEPLOYED-URL.vercel.app"
  }
}
```

**Important**: Replace `YOUR-DEPLOYED-URL` with your actual Vercel URL!

Then redeploy:
```bash
vercel --prod
```

### Step 6: Verify Farcaster Manifest

Test your manifest:

1. Go to `https://YOUR-URL.vercel.app/.well-known/farcaster.json`
2. Should see JSON response
3. Images should load: `https://YOUR-URL.vercel.app/images/icon.png`

### Step 7: Submit to Farcaster

1. Go to https://warpcast.com/~/developers
2. Add new mini app
3. Enter your URL: `https://YOUR-URL.vercel.app`
4. Verify manifest is detected
5. Submit for review

## 🧪 Testing with Your 8 Wallets

### Setup Testing Script

Create `test-volume.sh`:

```bash
#!/bin/bash

echo "🎮 BaseRush Arena - Volume Generation Test"
echo "Testing with 8 wallets..."

# You'll manually operate each wallet, but here's the strategy:

# WALLET 1-4: Option A
# WALLET 5-8: Option B

# Hour 1:
echo "Hour 1: Single entries (8 TX)"
# Each wallet: enterGame(0 or 1, 0x0) with 0.0001 ETH

# Hour 2:
echo "Hour 2: Multi entries (8 TX)"
# Each wallet: multiEntry(0 or 1, 5, 0x0) with 0.0005 ETH

# Hour 3:
echo "Hour 3: Staking (8 TX)"
# Each wallet: stake(0x0) with 0.0001 ETH

# Hour 4:
echo "Hour 4: Claims and compounds (8 TX)"
# 4 wallets: claimRewards()
# 4 wallets: compoundRewards()

echo "Total expected: 32+ transactions in 4 hours"
echo "Scale this up to 24 hours for 170+ transactions!"
```

### Expected Results After 24 Hours

- **Transaction Count**: 170+
- **Fees Generated**: ~0.00015 ETH
- **Active Addresses**: 8 unique
- **Contract Calls**: Mix of GamePool, RewardVault, AchievementNFT

### Monitoring Your Progress

1. **BaseScan**: Watch your contract transactions
   - GamePool: https://basescan.org/address/0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1
   - RewardVault: https://basescan.org/address/0xb6339F1857Ab28105472F1827C0D7948e8c3608D

2. **Base Builder Leaderboard**: Check your rank
   - https://base.org/builders/december
   - Look for your address in rankings

3. **Mini App Stats**: Monitor Farcaster engagement
   - Views, clicks, wallet connections

## 🎯 Maximizing Your Leaderboard Position

### Transaction Volume Strategies

1. **Hourly Rounds**: New round every hour = natural tx volume
2. **Multi-Entry**: 10x entries = 1 TX but counts as 10 entries
3. **Stake Cycling**: Stake → Wait 1hr → Claim → Restake
4. **Badge Claiming**: Claim all 10 badges = 10 TX
5. **Prize Claims**: Winners claim prizes = more TX

### Fee Generation Tips

1. **Higher Entry Counts**: More multi-entries = more fees
2. **Frequent Restaking**: Unstake 1% fee adds up
3. **Keep Rounds Active**: Never let a round go unfilled

### Automation Ideas (Advanced)

Create a simple Node.js script to automate transactions:

```javascript
// auto-enter.js
const { ethers } = require('ethers');

async function autoEnter(walletPrivateKey) {
  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  const wallet = new ethers.Wallet(walletPrivateKey, provider);
  
  const gamePool = new ethers.Contract(
    '0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1',
    GAME_POOL_ABI,
    wallet
  );
  
  // Enter game every hour
  const tx = await gamePool.enterGame(0, ethers.ZeroAddress, {
    value: ethers.parseEther('0.0001')
  });
  
  console.log('Tx:', tx.hash);
}
```

## 🚨 Common Issues & Fixes

### Issue: Images not loading

**Fix**:
```bash
npm run generate-images
vercel --prod
```

### Issue: Wallet connection fails

**Fix**:
- Clear browser cache
- Check you're on Base network
- Verify WalletConnect Project ID

### Issue: Transactions reverting

**Fix**:
- Ensure sufficient ETH balance
- Check you're on Base mainnet
- Verify contract addresses

### Issue: Manifest not found

**Fix**:
- Check file exists: `public/.well-known/farcaster.json`
- Verify URL: `https://YOUR-URL/.well-known/farcaster.json`
- Redeploy: `vercel --prod`

## 📊 Success Metrics

After 7 days of testing:

- ✅ **Rank**: Top 50-100 on Base Builders
- ✅ **Transactions**: 1000+ total
- ✅ **Fees**: 0.001+ ETH generated
- ✅ **Mini App**: Listed on Farcaster
- ✅ **Users**: 8+ unique active addresses

## 🎉 You're Ready!

Your BaseRush Arena is now:
- ✅ Deployed to production
- ✅ Listed as Farcaster mini app
- ✅ Generating transaction volume
- ✅ Competing for Base Builders rewards

**Keep generating transactions daily to climb the leaderboard!** 🚀

---

Need help? Reach out on Farcaster [@bamzzz](https://warpcast.com/bamzzz)
