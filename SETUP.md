# Fastest Finger Pot - Quick Setup Guide

## ✅ What's Been Created

### Smart Contract
- **Location**: `packages/hardhat/contracts/FastestFingerPot.sol`
- **Features**:
  - 15-second rounds
  - Players join by staking MON tokens
  - Score = clicks × stake
  - Winner takes entire pot
  - Automatic payouts
  - ReentrancyGuard security

### Frontend
- **Location**: `packages/nextjs/app/page.tsx`
- **Features**:
  - Beautiful gradient UI
  - Live leaderboard
  - Real-time timer
  - Click button for gameplay
  - Pot size display
  - Winner announcements

### Configuration
- Monad Testnet setup (Chain ID: 10200)
- Hardhat deployment script
- Test suite with comprehensive coverage
- README with full instructions

## 🚀 Quick Start

### 1. Fix Yarn PnP Issue (If Needed)

If you encounter Yarn PnP issues, try:

```bash
# Option 1: Use npm instead
npm install

# Option 2: Or use yarn with nodeLinker
# Add to package.json:
#   "packageManager": "yarn@3.6.4"
#   "nodeLinker": "node-modules"
```

### 2. Set Up Environment

Create `packages/hardhat/.env`:
```bash
DEPLOYER_PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

### 3. Compile and Deploy

```bash
# Compile contracts
yarn compile

# Deploy to Monad Testnet
yarn deploy --network monadTestnet
```

### 4. Run Frontend

```bash
yarn start
```

Visit http://localhost:3000

### 5. Play!

1. Connect MetaMask (ensure you're on Monad Testnet)
2. Join a round with a stake
3. Click as fast as possible
4. Win the pot!

## 🎮 How to Demo

### Scenario 1: Single Player
1. Connect wallet
2. Join with 0.1 MON
3. Click 10 times
4. Wait for round end
5. Claim winnings (if winner)

### Scenario 2: Multiple Players
1. Player 1: Join with 0.1 MON, click 5 times (score: 0.5)
2. Player 2: Join with 0.5 MON, click 3 times (score: 1.5)
3. Player 2 wins due to higher total score

### Tips for Demo
- Test locally first with `yarn chain`
- Get test MON from Monad faucet
- Encourage click spam for excitement
- Show leaderboard updates in real-time
- Highlight automatic payout mechanism

## 🔧 Troubleshooting

### "Cannot read properties" Error
- Issue: Yarn PnP compatibility
- Fix: Switch to npm or configure nodeLinker

### "Contract not deployed" Error
- Check: Deployment completed successfully
- Verify: `packages/nextjs/contracts/deployedContracts.ts` exists
- Redeploy if needed

### MetaMask Connection Issues
- Ensure you're on Monad Testnet
- Check Chain ID is 10200
- Try switching networks and back

## 📝 Next Steps

1. ✅ Complete: Smart contract created
2. ✅ Complete: Frontend UI built
3. ⏳ Pending: Deploy to Monad Testnet
4. ⏳ Pending: Get test MON from faucet
5. ⏳ Pending: Demo gameplay

## 🎯 Hackathon Checklist

- [x] Smart contract with game logic
- [x] Frontend UI
- [x] Monad integration
- [x] README with instructions
- [x] Test suite
- [ ] Deployment to Monad Testnet
- [ ] Demo video
- [ ] Documentation

## 🏆 Potential Improvements

- Add sound effects
- Mobile optimization
- Tournament mode
- NFT rewards for winners
- Governance token
- Analytics dashboard

