# 🚀 Deployment Checklist for Fastest Finger Pot

## Pre-Deployment

- [x] Smart contract created and tested
- [x] Frontend UI built
- [x] Monad Testnet configuration
- [x] Test suite written
- [x] Documentation complete
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Wallet funded with test MON

## Step 1: Environment Setup

### Create Hardhat .env
```bash
cd packages/hardhat
touch .env
```

Add:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

**Security Checklist:**
- [ ] Using testnet wallet only
- [ ] Private key NOT committed to git
- [ ] .env in .gitignore

## Step 2: Install Dependencies

Choose one method:

### Option A: Yarn (May have PnP issues)
```bash
yarn install
```

### Option B: npm (Recommended)
```bash
# Remove Yarn PnP
rm -rf .yarn .pnp.* yarn.lock

# Install with npm
npm install
```

**Verification:**
- [ ] No installation errors
- [ ] node_modules created
- [ ] All packages installed

## Step 3: Configure MetaMask

### Add Monad Testnet
- Network Name: `Monad Testnet`
- RPC URL: `https://testnet-rpc.monad.xyz`
- Chain ID: `10200`
- Currency Symbol: `MON`
- Block Explorer: `https://testnet.monadexplorer.com`

**Verification:**
- [ ] MetaMask connected
- [ ] Switched to Monad Testnet
- [ ] Balance visible

## Step 4: Get Test MON

**Options:**
1. Monad Discord faucet
2. Request from team
3. Use testnet portal

**Verification:**
- [ ] Wallet has MON balance
- [ ] Balance sufficient for gas + stake

## Step 5: Compile Contracts

```bash
yarn compile
# or
npm run compile
```

**Verification:**
- [ ] Compilation successful
- [ ] No errors
- [ ] Artifacts generated

## Step 6: Deploy to Monad

```bash
yarn deploy --network monadTestnet
# or
npm run deploy --network monadTestnet
```

**Verification:**
- [ ] Deployment successful
- [ ] Contract address received
- [ ] TypeScript types generated
- [ ] deployedContracts.ts updated

**Expected Output:**
```
🎮 FastestFingerPot deployed at: 0x...
📊 Round duration: 15
📝 Updated TypeScript contract definition file
```

## Step 7: Verify Deployment

### Check Explorer
- [ ] Visit testnet.monadexplorer.com
- [ ] Search for contract address
- [ ] Contract verified

### Check Frontend Config
- [ ] packages/nextjs/contracts/deployedContracts.ts updated
- [ ] Contract address present
- [ ] ABI included

## Step 8: Start Frontend

```bash
yarn start
# or
npm run start
```

**Verification:**
- [ ] Server starts on :3000
- [ ] No build errors
- [ ] UI renders

## Step 9: Test Gameplay

### Test 1: Connection
- [ ] Connect MetaMask
- [ ] Switch to Monad Testnet
- [ ] Wallet address displays

### Test 2: Join Round
- [ ] Enter stake amount
- [ ] Click "Join Round"
- [ ] Transaction approves
- [ ] Joined state updates

### Test 3: Click
- [ ] Click button appears
- [ ] Can click multiple times
- [ ] Clicks increment
- [ ] Score updates

### Test 4: Leaderboard
- [ ] Players display
- [ ] Scores correct
- [ ] Rankings accurate

### Test 5: Round End
- [ ] Timer counts down
- [ ] Round ends at 0:00
- [ ] Winner determined
- [ ] Payout executed

## Step 10: Demo Preparation

### Single Player Demo
1. Connect wallet
2. Join with 0.1 MON
3. Click 15 times
4. Wait for round end
5. Show payout

### Multi-Player Demo
1. Two wallets connect
2. Player 1: 0.1 MON, 10 clicks
3. Player 2: 0.5 MON, 5 clicks
4. Player 2 wins
5. Show automatic payout

## Post-Deployment

### Documentation
- [x] README complete
- [x] SETUP guide
- [x] Quick reference
- [ ] Deployment video
- [ ] Demo recording

### Code Quality
- [x] No linting errors
- [x] Tests passing
- [x] Security checks
- [x] Gas optimization

### UX Testing
- [ ] Mobile responsive
- [ ] Fast loading
- [ ] Error handling
- [ ] User feedback

## Troubleshooting

### Issue: Compilation Fails
**Solution**: Check Solidity version, imports, syntax

### Issue: Deployment Fails
**Solution**: Check .env, network config, balance

### Issue: Frontend Not Connecting
**Solution**: Check deployedContracts.ts, network, RPC

### Issue: Transactions Failing
**Solution**: Check gas settings, balance, permissions

## Final Checks

- [ ] All tests pass
- [ ] Contract deployed
- [ ] Frontend running
- [ ] Wallet connected
- [ ] Can join round
- [ ] Can click
- [ ] Leaderboard works
- [ ] Payout executes
- [ ] Documentation ready
- [ ] Demo prepared

## 🎉 Ready to Demo!

### Demo Script

1. **Introduction** (30s)
   - "Fastest Finger Pot on Monad"
   - Click to win concept
   
2. **Gameplay** (2min)
   - Join round with stake
   - Click rapidly
   - Show leaderboard
   - Wait for round end
   
3. **Highlights** (1min)
   - Automatic payout
   - Fair scoring system
   - Real-time updates
   - Monad integration

4. **Conclusion** (30s)
   - Playable now
   - Deployed on Monad
   - Future enhancements

---

**Good luck with your demo! 🚀**

