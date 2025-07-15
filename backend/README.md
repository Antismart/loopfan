# LoopFan Backend

Backend API server for LoopFan - A fan engagement platform built on Base blockchain.

## Features

- 🔐 Wallet-based authentication using signature verification
- 📊 Creator and fan analytics
- 🎯 Content management with gated access
- 💰 Tip tracking and rewards system
- 🎫 Membership NFT integration
- 🔗 Real-time blockchain event listening
- 📡 RESTful API with Swagger documentation
- 🗄️ MongoDB database with Redis caching
- 🛡️ Rate limiting and security middleware

## Tech Stack

- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Blockchain**: Ethers.js for Base network interaction
- **Authentication**: JWT + Ethereum signature verification
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Redis (optional, for caching)
- Base Sepolia/Mainnet RPC access

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Build the project
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

### Environment Configuration

Key environment variables to configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/looopfan
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Blockchain
BLOCKCHAIN_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your-private-key
CREATOR_ADDRESS=your-creator-address

# Contract Addresses (from deployment)
TIPJAR_CONTRACT_ADDRESS=0x...
MEMBERSHIP_NFT_CONTRACT_ADDRESS=0x...
GATED_CONTENT_REGISTRY_CONTRACT_ADDRESS=0x...
FAN_REWARDS_CONTRACT_ADDRESS=0x...
```

## API Documentation

Once running, visit `http://localhost:3000/api-docs` for interactive API documentation.

## API Endpoints

### Authentication
- `POST /api/users/auth/nonce` - Get signing nonce
- `POST /api/users/auth/verify` - Verify signature and get JWT

### Users
- `GET /api/users/profile` - Get authenticated user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:address` - Get public user profile

### Content
- `POST /api/content` - Create new content
- `GET /api/content` - List content with filters
- `GET /api/content/:id` - Get specific content
- `GET /api/content/:id/access` - Check content access

### Blockchain
- `GET /api/blockchain/tips` - Get tips history
- `GET /api/blockchain/memberships` - Get memberships
- `GET /api/blockchain/contract-info` - Get contract information
- `GET /api/blockchain/membership-tiers/:tierId` - Get tier info
- `GET /api/blockchain/points/:address` - Get points balance

### Analytics
- `GET /api/analytics/creator/:address` - Creator analytics
- `GET /api/analytics/fan/:address` - Fan analytics
- `GET /api/analytics/platform` - Platform-wide analytics

## Development

### Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run typecheck    # Run TypeScript type checking
```

### Database Models

#### User
- Wallet address, profile info
- Creator/fan roles
- Membership history
- Points balance

#### Content
- Title, description, type
- Gated access settings
- Engagement metrics
- File URLs

#### Transactions
- Tips with amounts and messages
- Membership purchases
- Reward redemptions

### Blockchain Integration

The backend automatically listens for blockchain events:

- **Tip Events**: Saves tips to database, awards points
- **Membership Events**: Updates user membership status
- **Reward Events**: Updates points balances

### Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation with express-validator
- JWT token authentication
- Ethereum signature verification

## Deployment

### Using Docker (Recommended)

```bash
# Build Docker image
docker build -t looopfan-backend .

# Run with docker-compose
docker-compose up -d
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Build project
npm run build

# Start with PM2
pm2 start dist/index.js --name looopfan-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

### Environment Setup

1. Set up MongoDB (Atlas or self-hosted)
2. Set up Redis (optional, for caching)
3. Configure environment variables
4. Deploy smart contracts and update contract addresses
5. Start the backend service

## Integration with Frontend

The backend provides a complete REST API that can be consumed by:

- React/Next.js web applications
- Mobile apps (React Native, Flutter)
- Desktop applications
- Third-party integrations

### Authentication Flow

1. Frontend requests nonce for wallet address
2. User signs message with their wallet
3. Frontend sends signature for verification
4. Backend returns JWT token
5. Token used for authenticated requests

### Real-time Updates

Consider integrating Socket.io for real-time features:
- Live tip notifications
- Real-time viewer counts
- Chat functionality
- Activity feeds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
