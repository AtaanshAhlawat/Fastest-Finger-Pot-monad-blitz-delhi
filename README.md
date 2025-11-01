# 🎮 Fastest Finger Pot

<div align="center">
  <h1>🚀 Fastest Finger Pot on Monad Testnet 🚀</h1>
  <p>A full-stack Ethereum dApp where players stake MON tokens and compete by clicking!</p>
  <p><b>Highest (clicks × stake) wins the entire pot!</b></p>
</div>

---

## 🎯 Game Overview

**Fastest Finger Pot** is an exciting blockchain game built on Monad Testnet where:

- ⚡ Players join rounds by staking MON tokens
- 🕐 Each round lasts 15 seconds
- 🖱️ Players compete by clicking as fast as they can
- 🏆 Winner is determined by highest **score = clicks × stake**
- 💰 Winner automatically receives the entire pot!

Built with NextJS, RainbowKit, Hardhat, Wagmi, Viem, and TypeScript.

---

## 📋 Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install) (v1 or v2+)
- [Git](https://git-scm.com/downloads)
- [MetaMask](https://metamask.io/) or compatible wallet

---

## 🚀 Quickstart

### 1. Clone & Install

```sh
git clone <your-repo-url>
cd fastest-finger-pot
yarn install
```

### 2. Configure Monad Testnet

#### Set up Hardhat `.env` file:

Create `packages/hardhat/.env`:

```env
# Your deployer private key (get testnet MON from faucet first!)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Monad Testnet RPC URL
MONAD_RPC_URL=https://testnet-rpc.monad.xyz

# Monad Testnet Chain ID
MONAD_CHAIN_ID=10143

# Monad Testnet Explorer
MONAD_EXPLORER_URL=https://testnet.monadexplorer.com
```

> ⚠️ **Never commit your private key!** The `.env` file is in `.gitignore`.

#### Generate a new account (optional):

```sh
yarn account generate
```

This will generate a random private key and display the address. Fund it with testnet MON from the faucet.

#### Get Testnet MON:

Visit the [Monad Testnet Faucet](https://testnet.monad.xyz) to get test MON tokens for your deployer address.

### 3. Deploy Smart Contract

Deploy to Monad Testnet:

```sh
yarn deploy --network monadTestnet
```

Or deploy locally:

```sh
yarn deploy
```

The contract will be deployed and ready to use. Contract address: `0x4Cc11C19078BE33F5DD2e05055a878E48c51dE93`

### 4. Configure Frontend (Optional)

Create `packages/nextjs/.env.local`:

```env
# Optional: WalletConnect Project ID
# Get your own at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Optional: Alchemy API Key
# NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

> The app works without these, using default fallback values.

### 5. Start Frontend

```sh
yarn start
```

Visit `http://localhost:3000` and click **"🎮 Play Now!"** to start playing!

---

## 🎮 How to Play

1. **Connect Wallet**: Click the wallet connect button in the header
2. **Switch to Monad Testnet**: Make sure your wallet is connected to Monad Testnet (Chain ID: 10143)
3. **Get Testnet MON**: Visit the [Monad Testnet Faucet](https://testnet.monad.xyz) if you need test tokens
4. **Join Round**: Enter your stake amount (minimum 0.001 MON) and click "Join Round"
5. **Click Fast!**: Click the button as fast as you can during the 15-second round
6. **Auto-Click**: Toggle the auto-click feature for maximum speed
7. **Win**: Highest score (clicks × stake) wins the pot automatically!

---

## ⚙️ Monad Testnet Configuration

### Network Details

- **Network Name**: Monad Testnet
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Chain ID**: `10143`
- **Currency Symbol**: `MON`
- **Block Explorer**: [https://testnet.monadexplorer.com](https://testnet.monadexplorer.com)

### Adding Monad Testnet to MetaMask

1. Open MetaMask
2. Click the network dropdown (top left)
3. Select "Add Network" or "Add Network Manually"
4. Enter the following details:
   - **Network Name**: `Monad Testnet`
   - **RPC URL**: `https://testnet-rpc.monad.xyz`
   - **Chain ID**: `10143`
   - **Currency Symbol**: `MON`
   - **Block Explorer URL**: `https://testnet.monadexplorer.com`
5. Click "Save"

### Getting Testnet MON

Visit the [Monad Testnet Faucet](https://testnet.monad.xyz) and follow the instructions to get testnet MON tokens.

---

## 🧪 Testing

Run the smart contract tests:

```sh
yarn test
```

The test suite includes:

- ✅ Contract deployment
- ✅ Round management
- ✅ Player joining and clicking
- ✅ Winner determination
- ✅ Leaderboard functionality
- ✅ Auto-payout verification

---

## 📁 Project Structure

```
fastest-finger-pot/
├── packages/
│   ├── hardhat/
│   │   ├── contracts/
│   │   │   └── FastestFingerPot.sol      # Main game contract
│   │   ├── deploy/
│   │   │   └── 00_deploy_fastest_finger_pot.ts  # Deployment script
│   │   └── test/
│   │       └── FastestFingerPot.ts       # Contract tests
│   └── nextjs/
│       ├── app/
│       │   ├── game/
│       │   │   └── page.tsx               # Game frontend
│       │   └── page.tsx                   # Homepage
│       └── utils/
│           └── customChains.ts            # Monad network config
```

---

## 🔧 Development

### Compile Contracts

```sh
yarn compile
```

### Deploy Contracts

```sh
# Deploy to Monad Testnet
yarn deploy --network monadTestnet

# Deploy locally
yarn deploy
```

### Run Tests

```sh
yarn test
```

### Start Frontend

```sh
yarn start
```

### Format Code

```sh
yarn format
```

---

## 🎯 Smart Contract Features

### `FastestFingerPot.sol`

- ✅ **Reentrancy Guard**: Secure against reentrancy attacks
- ✅ **Input Validation**: Minimum stake enforcement (0.001 MON)
- ✅ **15-Second Rounds**: Time-limited gameplay
- ✅ **On-Chain Click Tracking**: Every click recorded on-chain
- ✅ **Auto-Payout**: Winner automatically receives the pot
- ✅ **Leaderboard**: Real-time score tracking
- ✅ **Round Management**: Automatic round cycling

### Key Functions

- `joinRound()`: Join the current round by staking MON
- `click()`: Record a click (only if you've joined)
- `endRound()`: End the round and determine winner
- `startNewRound()`: Start a fresh round
- `getLeaderboard()`: Get current round leaderboard
- `getRoundInfo()`: Get current round details

---

## 🌐 Deployment

### Deploy to Monad Testnet

1. Set up `.env` file in `packages/hardhat/` with your private key
2. Fund your deployer address with testnet MON
3. Run: `yarn deploy --network monadTestnet`
4. The contract address will be displayed and saved to `deployments/`

### Current Deployment

- **Contract Address**: `0x4Cc11C19078BE33F5DD2e05055a878E48c51dE93`
- **Network**: Monad Testnet
- **Block Explorer**: [View on Monad Explorer](https://testnet.monadexplorer.com/address/0x4Cc11C19078BE33F5DD2e05055a878E48c51dE93)

---

## 🐛 Troubleshooting

### "Insufficient funds" error

- Make sure your wallet/deployer address has enough MON tokens
- Get testnet MON from the [Monad Testnet Faucet](https://testnet.monad.xyz)

### "Wrong network" error

- Switch your wallet to Monad Testnet (Chain ID: 10143)
- See [Adding Monad Testnet to MetaMask](#adding-monad-testnet-to-metamask) above

### Contract not deploying

- Check your `.env` file has the correct `DEPLOYER_PRIVATE_KEY`
- Ensure your deployer address has MON tokens for gas
- Verify you're using the correct network: `--network monadTestnet`

### Frontend not connecting

- Make sure the contract is deployed and address is in `deployments/`
- Check that you're on the correct network in your wallet
- Try refreshing the page

---

## 🎉 Demo Flow

1. **Deploy**: `yarn deploy --network monadTestnet`
2. **Start Frontend**: `yarn start`
3. **Connect Wallet**: Click wallet button, connect to Monad Testnet
4. **Join Round**: Enter stake (e.g., 0.01 MON), click "Join Round"
5. **Click!**: Click the button as fast as possible during the 15-second round
6. **Watch Leaderboard**: See your score update in real-time
7. **Win!**: If you have the highest (clicks × stake), you automatically win the pot!

---

## 📚 Additional Resources

- [Monad Documentation](https://docs.monad.xyz)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy clicking! May the fastest finger win! 🏆🚀**
