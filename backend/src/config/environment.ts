import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/looopfan',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.base.org',
    chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '84532', 10),
    privateKey: process.env.PRIVATE_KEY || '',
    creatorAddress: process.env.CREATOR_ADDRESS || '',
  },
  
  contracts: {
    tipJar: process.env.TIPJAR_CONTRACT_ADDRESS || '',
    membershipNFT: process.env.MEMBERSHIP_NFT_CONTRACT_ADDRESS || '',
    gatedContentRegistry: process.env.GATED_CONTENT_REGISTRY_CONTRACT_ADDRESS || '',
    fanRewards: process.env.FAN_REWARDS_CONTRACT_ADDRESS || '',
    usdc: process.env.USDC_CONTRACT_ADDRESS || '0xA0B86a33E6441b8Dc30c5Fc08Ca6b8E5dBb4cEcA',
  },
  
  storage: {
    ipfs: {
      projectId: process.env.IPFS_PROJECT_ID || '',
      projectSecret: process.env.IPFS_PROJECT_SECRET || '',
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET || 'looopfan-content',
    },
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASS || '',
  },
  
  apiKeys: {
    coingecko: process.env.COINGECKO_API_KEY || '',
    alchemy: process.env.ALCHEMY_API_KEY || '',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};
