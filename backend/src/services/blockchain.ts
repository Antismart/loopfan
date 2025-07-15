import { ethers } from 'ethers';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

// Contract ABIs (simplified - you should import the full ABIs from your contract artifacts)
const TipJarABI = [
  'function tipETH(string memory message, address referrer) external payable',
  'function tipUSDC(uint256 amount, string memory message, address referrer) external',
  'function creator() external view returns (address)',
  'function referralFeeBps() external view returns (uint256)',
  'event TipReceived(address indexed tipper, uint256 amount, address token, string message, address indexed referrer, uint256 referralAmount)'
];

const MembershipNFTABI = [
  'function mint(address to, uint256 tierId, uint256 duration) external payable',
  'function getTierInfo(uint256 tierId) external view returns (uint256 price, uint256 maxDuration, bool isActive)',
  'function balanceOf(address owner, uint256 id) external view returns (uint256)',
  'function creator() external view returns (address)',
  'event MembershipMinted(address indexed member, uint256 indexed tierId, uint256 duration, uint256 expiresAt)'
];

const GatedContentRegistryABI = [
  'function registerContent(string memory contentHash, uint256[] memory requiredTiers, uint256 priceInUSDC) external',
  'function hasAccess(address user, address creator, string memory contentHash) external view returns (bool)',
  'function getContentInfo(address creator, string memory contentHash) external view returns (uint256[] memory requiredTiers, uint256 priceInUSDC, bool isActive)',
  'event ContentRegistered(address indexed creator, string indexed contentHash, uint256[] requiredTiers, uint256 priceInUSDC)'
];

const FanRewardsABI = [
  'function awardPoints(address fan, uint256 points, string memory reason) external',
  'function redeemReward(uint256 rewardId) external',
  'function getPointsBalance(address fan) external view returns (uint256)',
  'function createReward(uint256 pointsCost, string memory description, uint256 maxRedemptions) external',
  'event PointsAwarded(address indexed fan, uint256 points, string reason)',
  'event RewardRedeemed(address indexed fan, uint256 indexed rewardId, uint256 pointsCost)'
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private tipJarContract: ethers.Contract;
  private membershipNFTContract: ethers.Contract;
  private gatedContentRegistryContract: ethers.Contract;
  private fanRewardsContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
    
    if (!config.blockchain.privateKey) {
      throw new Error('Private key not configured');
    }
    
    this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
    
    // Initialize contracts
    this.tipJarContract = new ethers.Contract(
      config.contracts.tipJar,
      TipJarABI,
      this.wallet
    );
    
    this.membershipNFTContract = new ethers.Contract(
      config.contracts.membershipNFT,
      MembershipNFTABI,
      this.wallet
    );
    
    this.gatedContentRegistryContract = new ethers.Contract(
      config.contracts.gatedContentRegistry,
      GatedContentRegistryABI,
      this.wallet
    );
    
    this.fanRewardsContract = new ethers.Contract(
      config.contracts.fanRewards,
      FanRewardsABI,
      this.wallet
    );
  }

  // TipJar methods
  async getTipJarInfo() {
    try {
      if (!this.tipJarContract) {
        throw new Error('TipJar contract not initialized');
      }
      
      const creator = await this.tipJarContract.creator();
      const referralFeeBps = await this.tipJarContract.referralFeeBps();
      
      return {
        creator,
        referralFeeBps: Number(referralFeeBps),
      };
    } catch (error) {
      logger.error('Error getting TipJar info:', error);
      throw error;
    }
  }

  async listenForTips(callback: (event: any) => void) {
    try {
      this.tipJarContract.on('TipReceived', (tipper, amount, token, message, referrer, referralAmount, event) => {
        callback({
          tipper,
          amount: ethers.formatEther(amount),
          token,
          message,
          referrer,
          referralAmount: ethers.formatEther(referralAmount),
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
        });
      });
      
      logger.info('Started listening for tip events');
    } catch (error) {
      logger.error('Error setting up tip event listener:', error);
      throw error;
    }
  }

  // MembershipNFT methods
  async getMembershipTierInfo(tierId: number) {
    try {
      const tierInfo = await this.membershipNFTContract.getTierInfo(tierId);
      return {
        price: ethers.formatUnits(tierInfo[0], 6), // USDC has 6 decimals
        maxDuration: Number(tierInfo[1]),
        isActive: tierInfo[2],
      };
    } catch (error) {
      logger.error('Error getting membership tier info:', error);
      throw error;
    }
  }

  async getMembershipBalance(userAddress: string, tierId: number) {
    try {
      const balance = await this.membershipNFTContract.balanceOf(userAddress, tierId);
      return Number(balance);
    } catch (error) {
      logger.error('Error getting membership balance:', error);
      throw error;
    }
  }

  async listenForMemberships(callback: (event: any) => void) {
    try {
      this.membershipNFTContract.on('MembershipMinted', (member, tierId, duration, expiresAt, event) => {
        callback({
          member,
          tierId: Number(tierId),
          duration: Number(duration),
          expiresAt: Number(expiresAt),
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
        });
      });
      
      logger.info('Started listening for membership events');
    } catch (error) {
      logger.error('Error setting up membership event listener:', error);
      throw error;
    }
  }

  // GatedContentRegistry methods
  async checkContentAccess(userAddress: string, creatorAddress: string, contentHash: string) {
    try {
      const hasAccess = await this.gatedContentRegistryContract.hasAccess(
        userAddress,
        creatorAddress,
        contentHash
      );
      return hasAccess;
    } catch (error) {
      logger.error('Error checking content access:', error);
      throw error;
    }
  }

  async getContentInfo(creatorAddress: string, contentHash: string) {
    try {
      const contentInfo = await this.gatedContentRegistryContract.getContentInfo(
        creatorAddress,
        contentHash
      );
      return {
        requiredTiers: contentInfo[0].map((tier: bigint) => Number(tier)),
        priceInUSDC: ethers.formatUnits(contentInfo[1], 6),
        isActive: contentInfo[2],
      };
    } catch (error) {
      logger.error('Error getting content info:', error);
      throw error;
    }
  }

  async registerContent(contentHash: string, requiredTiers: number[], priceInUSDC: string) {
    try {
      const priceInWei = ethers.parseUnits(priceInUSDC, 6);
      const tx = await this.gatedContentRegistryContract.registerContent(
        contentHash,
        requiredTiers,
        priceInWei
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      logger.error('Error registering content:', error);
      throw error;
    }
  }

  // FanRewards methods
  async getPointsBalance(userAddress: string) {
    try {
      const balance = await this.fanRewardsContract.getPointsBalance(userAddress);
      return Number(balance);
    } catch (error) {
      logger.error('Error getting points balance:', error);
      throw error;
    }
  }

  async awardPoints(fanAddress: string, points: number, reason: string) {
    try {
      const tx = await this.fanRewardsContract.awardPoints(fanAddress, points, reason);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      logger.error('Error awarding points:', error);
      throw error;
    }
  }

  async createReward(pointsCost: number, description: string, maxRedemptions: number) {
    try {
      const tx = await this.fanRewardsContract.createReward(pointsCost, description, maxRedemptions);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      logger.error('Error creating reward:', error);
      throw error;
    }
  }

  async listenForRewards(callback: (event: any) => void) {
    try {
      this.fanRewardsContract.on('PointsAwarded', (fan, points, reason, event) => {
        callback({
          type: 'PointsAwarded',
          fan,
          points: Number(points),
          reason,
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
        });
      });

      this.fanRewardsContract.on('RewardRedeemed', (fan, rewardId, pointsCost, event) => {
        callback({
          type: 'RewardRedeemed',
          fan,
          rewardId: Number(rewardId),
          pointsCost: Number(pointsCost),
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
        });
      });
      
      logger.info('Started listening for reward events');
    } catch (error) {
      logger.error('Error setting up reward event listeners:', error);
      throw error;
    }
  }

  // Utility methods
  async getBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('Error getting block number:', error);
      throw error;
    }
  }

  async getTransactionReceipt(txHash: string) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      logger.error('Error getting transaction receipt:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
