# LoopFan Smart Contracts Deployment Guide

This guide covers deploying the LoopFan smart contracts to Base network.

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- Base Sepolia ETH for testnet deployment
- Base ETH for mainnet deployment
- USDC contract address for the target network

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your environment variables in `.env`:
```env
PRIVATE_KEY=your_private_key_without_0x
CREATOR_ADDRESS=0x_your_creator_address
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

## Network Configuration

### Base Sepolia (Testnet)
- Chain ID: 84532
- RPC: https://sepolia.base.org
- USDC: 0xA0b86a33E6441B8Dc30c5FC08ca6b8E5DbB4CECa
- Block Explorer: https://sepolia.basescan.org

### Base Mainnet
- Chain ID: 8453
- RPC: https://mainnet.base.org
- USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- Block Explorer: https://basescan.org

## Deployment Commands

### Deploy to Base Sepolia
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Deploy to Base Mainnet
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

## Post-Deployment Setup

### 1. Setup Membership Tiers
After deployment, run the membership tiers setup:

```bash
# Set the deployed MembershipNFT address
export MEMBERSHIP_NFT_ADDRESS=0x_deployed_address
export CREATOR_PRIVATE_KEY=$PRIVATE_KEY

forge script script/SetupMembershipTiers.s.sol:SetupMembershipTiers \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast
```

This creates 4 default tiers:
- **Tier 0 (Basic)**: 0.01 ETH / 10 USDC for 30 days
- **Tier 1 (Premium)**: 0.025 ETH / 25 USDC for 90 days  
- **Tier 2 (VIP)**: 0.04 ETH / 40 USDC for 180 days
- **Tier 3 (Lifetime)**: 0.1 ETH / 100 USDC for 365 days

### 2. Verify Deployment
Check that all contracts are properly initialized:

```bash
# Check TipJar
cast call $TIPJAR_ADDRESS "creator()" --rpc-url $BASE_SEPOLIA_RPC_URL

# Check MembershipNFT
cast call $MEMBERSHIP_NFT_ADDRESS "nextTierId()" --rpc-url $BASE_SEPOLIA_RPC_URL

# Check ContentRegistry
cast call $CONTENT_REGISTRY_ADDRESS "owner()" --rpc-url $BASE_SEPOLIA_RPC_URL
```

## Contract Addresses

After deployment, contract addresses will be saved to:
- `deployments/base-sepolia.json` (testnet)
- `deployments/base-mainnet.json` (mainnet)

## Contract Functions

### TipJar
- `tipETH(message, referrer)` - Send ETH tip with optional referrer
- `tipUSDC(amount, message, referrer)` - Send USDC tip with optional referrer
- `setReferralFee(bps)` - Set referral fee (owner only)

### MembershipNFT
- `createTier(priceETH, priceUSDC, duration)` - Create new membership tier (owner only)
- `mintETH(tierId)` - Buy membership with ETH
- `mintUSDC(tierId)` - Buy membership with USDC
- `isMember(user, tierId)` - Check if user has active membership

### GatedContentRegistry
- `publishContent(encryptedURI, membershipNFT, requiredTier)` - Publish gated content
- `getContentURI(viewer, contentId)` - Access content (if authorized)

### FanRewards
- `recordTip(fan, amount)` - Record tip for fan (creator only)
- `recordNFT(fan)` - Mark fan as NFT holder (creator only)
- `airdropReward(to, rewardId, amount)` - Send reward NFT (creator only)

## Security Considerations

- All contracts use UUPS upgradeable pattern
- Only contract owners can upgrade implementations
- Referral fees are capped at 10%
- Reentrancy protection on all payable functions
- Input validation on all external functions

## Troubleshooting

### Common Issues

1. **Deployment fails with "insufficient funds"**
   - Ensure you have enough ETH for gas fees
   - Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

2. **Verification fails**
   - Check your Basescan API key
   - Ensure the contract is deployed correctly
   - Try manual verification on Basescan

3. **Environment variables not found**
   - Check your `.env` file exists and has correct format
   - Source the environment: `source .env`

### Getting Help

- Check the [Base docs](https://docs.base.org)
- Join the [LoopFan Discord](https://discord.gg/looopfan)
- Review test files for usage examples
