# 🎮 Fastest Finger Pot - Monad Testnet

A fast-paced clicking game where players compete for the prize pool on Monad Testnet. Click faster, stake higher, win bigger!

## 🎯 Game Rules

1. **Connect Wallet**: Connect using MetaMask or WalletConnect
2. **Join Round**: Stake MON tokens to enter (minimum 0.001 MON)
3. **Click to Win**: You have 15 seconds to click as many times as possible
4. **Scoring**: Your score = Number of Clicks × Stake Amount
5. **Winner Takes All**: Highest score wins the entire pot!

## 🚀 Project Status

Currently running locally with smart contract deployed on Monad Testnet.

## 🔧 Technology Stack

- **Blockchain**: Monad Testnet
- **Smart Contracts**: Solidity 0.8.20
- **Frontend**: Next.js, React, TailwindCSS
- **Development**: Scaffold-ETH 2, Hardhat

## 📱 Features

- Real-time leaderboard
- Live pot size tracking
- Automatic payouts
- Fair scoring system
- Mobile responsive design
- Real-time click tracking
- Transaction notifications

## 🛠️ Local Development

### Prerequisites

- Node.js >=18.0.0
- Git
- MetaMask wallet with Monad testnet MON

### Monad Testnet Setup

Add to MetaMask:

- Network Name: `Monad Testnet`
- RPC URL: `https://testnet-rpc.monad.xyz`
- Chain ID: `10143`
- Currency Symbol: `MON`
- Block Explorer: `https://testnet.monadexplorer.com`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AtaanshAhlawat/Fastest-Finger-Pot-monad-blitz-delhi.git
cd Fastest-Finger-Pot-monad-blitz-delhi
```

2. Install dependencies:

```bash
cd packages/hardhat
npm install
cd ../nextjs
npm install
```

3. Create environment files:

```bash
# In packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

### Deployment

1. Deploy the contract:

```bash
cd packages/hardhat
npm run deploy --network monadTestnet
```

2. Start the frontend:

```bash
cd packages/nextjs
npm run dev
```

Visit `http://localhost:3000` to play!

## 🎮 How to Play

1. **Connect Your Wallet**
   - Click "Connect Wallet"
   - Switch to Monad Testnet
   - Ensure you have MON for gas and stakes

2. **Join a Round**
   - Enter your stake amount (minimum 0.001 MON)
   - Click "Join Round"
   - Approve the transaction

3. **Play the Game**
   - Once joined, click the big button as fast as you can
   - You have 15 seconds
   - Each click is recorded on-chain
   - Your score = clicks × stake

4. **Check Results**
   - Watch the leaderboard for real-time standings
   - When the timer hits zero, the round ends
   - Winner receives the entire pot automatically
   - A new round starts immediately

## 📈 Smart Contract

The game is powered by `FastestFingerPot.sol`, deployed at [0xb4043511cBA785F67D4Dc7D19431A088553A0370](https://testnet.monadexplorer.com/address/0xb4043511cBA785F67D4Dc7D19431A088553A0370) on Monad Testnet.

### Key Features

- Non-reentrant functions for security
- Automatic winner calculation
- Fair scoring system
- Real-time click tracking
- Instant payouts

## 🔐 Security

- ReentrancyGuard for critical functions
- Secure fund handling
- Required minimum stake
- Automatic round transitions
- No admin privileges

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- Deployed on [Monad](https://monad.xyz) Testnet
- Developed during Monad Blitz Delhi

## 📞 Support

If you have any questions or need help:

- Open an issue
- Join [Monad Discord](https://discord.gg/monad)
- Follow [@MonadLabs](https://twitter.com/MonadLabs) for updates
