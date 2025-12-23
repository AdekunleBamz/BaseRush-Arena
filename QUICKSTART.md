# ⚡ BaseRush Arena - QUICK START

## 🎯 What You Have

✅ **3 Deployed Contracts on Base:**
- GamePool: `0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1`
- RewardVault: `0xb6339F1857Ab28105472F1827C0D7948e8c3608D`
- AchievementNFT: `0x1C9a074Eba68cbEf15BCeab209743388786A9756`

✅ **Complete Farcaster Mini App:**
- Next.js 14 frontend
- WalletConnect integration
- All 3 contract interactions
- Required Farcaster images
- Proper manifest file

## 🚀 Get Started in 3 Commands

```bash
# 1. Run setup (installs deps & generates images)
./setup.sh

# 2. Test locally
npm run dev

# 3. Deploy to Vercel
npm i -g vercel && vercel --prod
```

That's it! Your app is live! 🎉

## 📱 After Deployment

1. **Get your Vercel URL** (e.g., `baserush-arena.vercel.app`)

2. **Update manifest**: Edit `public/.well-known/farcaster.json`
   - Replace `your-domain.com` with your Vercel URL
   - Redeploy: `vercel --prod`

3. **Test it works**:
   - Visit: `https://YOUR-URL.vercel.app`
   - Check: `https://YOUR-URL.vercel.app/.well-known/farcaster.json`
   - Connect wallet and try a game entry

4. **Submit to Farcaster**:
   - Go to: https://warpcast.com/~/developers
   - Add your URL
   - Submit for review

## 🎮 Start Generating Volume

With your 8 wallets, run this strategy:

### Every Hour (24x per day):

**Wallets 1-4:**
```
→ Connect wallet
→ Choose Option A
→ Multi-entry: 5x
→ Send 0.0005 ETH
```

**Wallets 5-8:**
```
→ Connect wallet
→ Choose Option B
→ Multi-entry: 5x
→ Send 0.0005 ETH
```

**After round ends (1 hour):**
```
→ All winners claim prizes
→ Half wallets: Stake 0.0001 ETH
→ Other half: Claim/compound rewards
```

### Expected Results:
- **8 entries/hour** × 24 hours = **192 transactions/day**
- **Fees generated**: ~0.00015 ETH/day
- **Rank**: Top 50-100 on Base Builders 🎯

## 📊 Monitor Progress

1. **Check transactions**: https://basescan.org/address/0x47fc8E5c84c49d6e888314dfB9705964dE24fbf1

2. **Check rank**: https://base.org/builders/december

3. **Check mini app**: https://warpcast.com/~/developers

## 🆘 Need Help?

See detailed guides:
- **README.md**: Full documentation
- **DEPLOYMENT.md**: Step-by-step deployment guide

## 🎉 You're Ready!

Start generating transactions and climb that leaderboard! 🚀

---

**Contracts**: ✅ Deployed & Linked
**Mini App**: ✅ Ready to Deploy  
**WalletConnect**: ✅ Configured
**Images**: ✅ Will Generate on Setup

**RUN `./setup.sh` NOW!** ⚡
