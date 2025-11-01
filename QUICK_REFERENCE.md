# Fastest Finger Pot - Quick Reference Card

## 🚀 Setup Commands

```bash
# Install dependencies
yarn install

# Compile contracts
yarn compile

# Deploy to Monad Testnet
yarn deploy --network monadTestnet

# Start frontend
yarn start

# Run tests
yarn test
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `packages/hardhat/contracts/FastestFingerPot.sol` | Smart contract |
| `packages/hardhat/test/FastestFingerPot.ts` | Tests |
| `packages/nextjs/app/page.tsx` | Game UI |
| `packages/hardhat/hardhat.config.ts` | Network config |
| `packages/nextjs/utils/customChains.ts` | Chain config |

## ⚙️ Environment Variables

### Hardhat (.env)
```
DEPLOYER_PRIVATE_KEY=your_key
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

### Next.js (.env.local) - Optional
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id
```

## 🎮 Game Rules

- **Round Duration**: 15 seconds
- **Entry**: Stake any amount
- **Scoring**: `clicks × stake`
- **Winner**: Highest score
- **Payout**: Automatic to winner

## 🔗 Important URLs

- **RPC**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet.monadexplorer.com
- **Chain ID**: 10200
- **Currency**: MON

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Yarn PnP error | Use npm or add nodeLinker |
| Contract not found | Run `yarn deploy` |
| Network error | Check RPC URL |
| No test MON | Request from Discord |

## 📊 Contract Functions

### Read
- `roundActive()` - Is round active
- `potSize()` - Current pot
- `getPlayerScore(address)` - Player score
- `getTimeRemaining()` - Time left
- `getPlayerData(address)` - Player info

### Write
- `joinRound()` - Stake and join
- `click()` - Record click
- `endRound()` - End round

## 🎯 Demo Flow

1. Connect MetaMask
2. Switch to Monad Testnet
3. Join round: 0.1 MON
4. Click button rapidly
5. Wait for round end
6. Check winner payout

## ✅ Checklist

- [ ] Installed dependencies
- [ ] Created .env file
- [ ] Compiled contracts
- [ ] Deployed to testnet
- [ ] Got test MON
- [ ] Started frontend
- [ ] Connected wallet
- [ ] Tested gameplay

## 📞 Need Help?

1. Check README.md
2. Read SETUP.md
3. Review PROJECT_SUMMARY.md
4. Check contract comments
5. Look at test files

---

**Ready to play? Let's click! 🎮**

