    # LoopFan 🎯

**The first truly decentralized creator wallet app** — enabling direct creator-to-fan payments with **zero middlemen**. Built on Base blockchain, LoopFan puts creators in complete control of their earnings through tips, paid content, NFT memberships, and exclusive drops.

## 🌟 Overview

LoopFan revolutionizes creator monetization by **eliminating all intermediaries** between creators and their fans. Unlike traditional platforms that take 15-30% cuts, LoopFan enables **100% direct-to-creator payments** (minus only gas fees):

- **🪙 Creator Wallet**: Your personal blockchain wallet receives all payments instantly
- **💰 Direct Tips**: ETH/USDC tips flow straight to your wallet, no platform fees
- **🎫 Membership NFTs**: Tradeable subscription tokens you control and price
- **🔒 Gated Content**: Premium content with decentralized access control
- **🎁 NFT Drops**: Exclusive releases for your most loyal supporters
- **🏆 Fan Rewards**: Custom point systems and incentives you design
- **🚫 Platform Independence**: Own your audience, keep your earnings, control your content

## 🔥 Why LoopFan?

| Traditional Platforms | LoopFan |
|----------------------|---------|
| 15-30% platform fees | **0% platform fees** |
| Platform owns audience | **You own your audience** |
| Algorithm controls reach | **Direct creator-fan connection** |
| Centralized content control | **Decentralized sovereignty** |
| Platform can ban/demonetize | **Censorship resistant** |
| Monthly payouts | **Instant blockchain payments** |

## 🏗️ Architecture

The project consists of three main components:

### 1. Smart Contracts (`/contracts`)
- **TipJar**: Direct creator wallet for receiving ETH/USDC tips
- **MembershipNFT**: NFT-based subscription system with tiered access
- **GatedContentRegistry**: Decentralized content access control
- **FanRewards**: Creator-controlled point and reward system

### 2. Backend API (`/backend`)
- **Node.js/TypeScript**: Decentralized API server
- **MongoDB**: Off-chain metadata and user preferences
- **Blockchain Integration**: Real-time transaction monitoring
- **Wallet Authentication**: Signature-based authentication (no passwords)

### 3. Frontend (Coming Soon)
- **Creator Dashboard**: Wallet management and content monetization tools
- **Fan Interface**: Direct support and exclusive content access
- **Web3 Integration**: Seamless wallet connection and blockchain interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Git
- Wallet with Base Sepolia ETH (for deployment)

### 1. Clone Repository
```bash
git clone https://github.com/Antismart/loopfan.git
cd loopfan
```

### 2. Deploy Smart Contracts
```bash
cd contracts

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your private key and creator address

# Deploy to Base Sepolia
make deploy-sepolia

# Setup membership tiers (optional)
make setup-tiers
```

### 3. Start Backend API
```bash
cd ../backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with contract addresses and database settings

# Start development server
npm run dev

# Or build and start production
npm run build
npm start
```

### 4. Access API Documentation
Visit `http://localhost:3000/api-docs` for interactive API documentation.

## 📋 Smart Contracts

### Contract Addresses (Base Sepolia)
Update these in your `.env` files after deployment:

```env
TIPJAR_CONTRACT_ADDRESS=0x...
MEMBERSHIP_NFT_CONTRACT_ADDRESS=0x...
GATED_CONTENT_REGISTRY_CONTRACT_ADDRESS=0x...
FAN_REWARDS_CONTRACT_ADDRESS=0x...
```

### Key Features

#### TipJar Contract
- **Zero-Fee Creator Payments**: Direct ETH and USDC tips with no platform cuts
- **Instant Settlement**: Immediate payment to creator wallets on every tip
- **Referral Economy**: 5% referral rewards to grow creator communities organically
- **Gas Optimized**: Minimal transaction costs for fans supporting creators

#### MembershipNFT Contract
- **NFT-Based Subscriptions**: Membership represented as tradeable NFTs
- **Tiered Access**: Multiple membership levels with different benefits
- **Time-Based Expiration**: Automatic membership renewal system
- **Creator Control**: Full control over pricing and tier benefits

#### GatedContentRegistry Contract
- **Decentralized Access Control**: No central authority controls content access
- **Multiple Payment Methods**: NFT ownership or direct USDC payments
- **Creator Sovereignty**: Creators maintain full content ownership
- **Transparent Verification**: On-chain proof of content access rights

#### FanRewards Contract
- **Creator-Managed Points**: Custom point systems for each creator
- **Reward Marketplace**: Creators define their own reward catalog
- **Engagement Incentives**: Points awarded for tips, referrals, and interactions
- **Flexible Redemption**: Custom rewards from exclusive content to physical merchandise

## 🔧 Backend API

### Authentication Flow
1. **Get Nonce**: `POST /api/users/auth/nonce`
2. **Sign Message**: User signs with wallet
3. **Verify Signature**: `POST /api/users/auth/verify`
4. **Use JWT Token**: Include in Authorization header

### Key Endpoints

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:address` - Public profile

#### Content Management
- `POST /api/content` - Create content
- `GET /api/content` - List content with filters
- `GET /api/content/:id/access` - Check access permissions

#### Blockchain Integration
- `GET /api/blockchain/tips` - Tip history
- `GET /api/blockchain/memberships` - Membership data
- `GET /api/blockchain/points/:address` - Points balance

#### Analytics
- `GET /api/analytics/creator/:address` - Creator metrics
- `GET /api/analytics/fan/:address` - Fan statistics
- `GET /api/analytics/platform` - Platform insights

## 🛠️ Development

### Contract Development
```bash
cd contracts

# Run tests
forge test

# Deploy locally
anvil
make deploy-local

# Verify contracts
make verify-sepolia
```

### Backend Development
```bash
cd backend

# Development with hot reload
npm run dev

# Run tests
npm test

# Lint and type check
npm run lint
npm run typecheck
```

### Environment Setup

#### Contracts (.env)
```env
PRIVATE_KEY=your-private-key
CREATOR_ADDRESS=your-creator-address
ETHERSCAN_API_KEY=your-etherscan-key
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/looopfan
JWT_SECRET=your-jwt-secret
BLOCKCHAIN_RPC_URL=https://sepolia.base.org
# ... contract addresses from deployment
```

## 🐳 Docker Deployment

### Full Stack with Docker Compose
```bash
cd backend
docker-compose up -d
```

This starts:
- Backend API server
- MongoDB database
- Redis cache

### Individual Services
```bash
# Backend only
docker build -t looopfan-backend .
docker run -p 3000:3000 looopfan-backend
```

## 📊 Features

### For Creators
- 💰 **100% Earnings**: Keep every dollar except gas fees — no platform cuts ever
- 🪙 **Your Wallet, Your Money**: Direct payments to your personal blockchain wallet
- 📊 **Real-time Analytics**: Live insights on earnings and fan engagement
- 🎯 **Complete Sovereignty**: Full control over content access, pricing, and audience
- 🏆 **Custom Economies**: Design unique reward systems for your community
- 🔒 **NFT-Gated Exclusives**: Create scarcity and value for your biggest supporters
- 🚀 **Platform Independence**: Never lose your audience to algorithm changes

### For Fans
- 💝 **Direct Impact**: 100% of your support reaches creators instantly
- 🎫 **True Ownership**: NFT memberships you actually own and can trade
- 🏅 **Earn While Supporting**: Get rewards for engaging with your favorite creators
- 🎁 **Exclusive Access**: Unlock premium content through blockchain verification
- 🤝 **Referral Rewards**: Share creators you love and earn together
- 🔐 **Censorship Resistant**: Access content without platform interference

### For Developers
- 🔗 **Fully Decentralized**: No central authority or platform control
- 🛡️ **Battle-Tested**: Comprehensive test coverage and security audits
- 🔧 **Composable**: Build on top of LoopFan's creator economy primitives
- 📚 **Open Source**: MIT licensed with complete documentation
- ⚡ **Base Optimized**: Built for Base's fast, low-cost transactions

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
forge test -vvv
```

### Backend API
```bash
cd backend
npm test
npm run test:watch
```

## 🚀 Deployment

### Production Checklist
- [ ] Deploy contracts to Base Mainnet
- [ ] Update contract addresses in backend
- [ ] Set up production MongoDB
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Deploy frontend application

### Base Mainnet Deployment
```bash
cd contracts
cp .env.example .env.mainnet
# Configure for mainnet
make deploy-mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Contracts**: `./contracts/` - Solidity smart contracts
- **Backend**: `./backend/` - Node.js API server
- **Documentation**: API docs available at `/api-docs` when running
- **Base Network**: [Base Documentation](https://docs.base.org/)

## 💡 Roadmap

### Phase 1 (Current) ✅
- [x] Creator wallet smart contracts
- [x] Direct payment infrastructure  
- [x] NFT-based membership system
- [x] Decentralized API backend
- [x] Wallet-based authentication

### Phase 2 (Next)
- [ ] Creator dashboard web app
- [ ] Fan mobile wallet app
- [ ] NFT marketplace integration
- [ ] Advanced creator analytics
- [ ] Social discovery features

### Phase 3 (Future)
- [ ] Cross-chain creator wallets
- [ ] DAO governance for creators
- [ ] Creator token launchpad
- [ ] Decentralized content hosting
- [ ] Creator collective tools

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Join our Discord community
- Follow updates on Twitter

---

**Built for creators, owned by creators** — LoopFan is the first truly decentralized creator wallet on Base 🔵

*No middlemen. No platform fees. Just direct creator-to-fan value exchange.*
