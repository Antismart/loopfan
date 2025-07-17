import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Contract addresses from deployment
export const CONTRACTS = {
  TIPJAR: process.env.NEXT_PUBLIC_TIPJAR_CONTRACT || '',
  MEMBERSHIP_NFT: process.env.NEXT_PUBLIC_MEMBERSHIP_NFT_CONTRACT || '',
  GATED_CONTENT: process.env.NEXT_PUBLIC_GATED_CONTENT_CONTRACT || '',
  FAN_REWARDS: process.env.NEXT_PUBLIC_FAN_REWARDS_CONTRACT || '',
} as const

// Wagmi configuration with Base support
export const config = getDefaultConfig({
  appName: 'LoopFan - Decentralized Creator Wallet',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// Backend API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Theme colors matching Base brand
export const THEME = {
  colors: {
    primary: '#0052FF', // Base blue
    success: '#10B981', // Green for earnings
    warning: '#F59E0B', // Gold for premium
    accent: '#8B5CF6', // Purple for rewards
  }
} as const
