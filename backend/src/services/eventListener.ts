import { blockchainService } from './blockchain';
import { Tip, Membership } from '../models/Transaction';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export class EventListenerService {
  private isListening = false;

  async startListening(): Promise<void> {
    if (this.isListening) {
      logger.warn('Event listeners already running');
      return;
    }

    try {
      // Listen for tip events
      await blockchainService.listenForTips(async (event) => {
        try {
          await this.handleTipEvent(event);
        } catch (error) {
          logger.error('Error handling tip event:', error);
        }
      });

      // Listen for membership events
      await blockchainService.listenForMemberships(async (event) => {
        try {
          await this.handleMembershipEvent(event);
        } catch (error) {
          logger.error('Error handling membership event:', error);
        }
      });

      // Listen for reward events
      await blockchainService.listenForRewards(async (event) => {
        try {
          await this.handleRewardEvent(event);
        } catch (error) {
          logger.error('Error handling reward event:', error);
        }
      });

      this.isListening = true;
      logger.info('✅ Blockchain event listeners started');
    } catch (error) {
      logger.error('Failed to start event listeners:', error);
      throw error;
    }
  }

  private async handleTipEvent(event: any): Promise<void> {
    logger.info('Processing tip event:', event);

    // Save tip to database
    const tip = new Tip({
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      tipperAddress: event.tipper.toLowerCase(),
      creatorAddress: await this.getCreatorFromTipJar(), // You'll need to implement this
      amount: parseFloat(event.amount),
      token: event.token || 'ETH',
      message: event.message,
      referrerAddress: event.referrer !== '0x0000000000000000000000000000000000000000' ? event.referrer.toLowerCase() : undefined,
      referralAmount: event.referralAmount ? parseFloat(event.referralAmount) : undefined,
    });

    await tip.save();

    // Update user stats
    await this.updateUserTipStats(tip.tipperAddress, tip.creatorAddress, tip.amount);

    // Award points to tipper
    const pointsToAward = Math.floor(tip.amount * 10); // 10 points per 1 ETH/USDC
    if (pointsToAward > 0) {
      try {
        await blockchainService.awardPoints(
          tip.tipperAddress,
          pointsToAward,
          `Tip of ${tip.amount} ${tip.token}`
        );
      } catch (error) {
        logger.error('Failed to award points for tip:', error);
      }
    }

    logger.info(`Tip processed: ${tip.amount} ${tip.token} from ${tip.tipperAddress}`);
  }

  private async handleMembershipEvent(event: any): Promise<void> {
    logger.info('Processing membership event:', event);

    // Save membership to database
    const membership = new Membership({
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      memberAddress: event.member.toLowerCase(),
      creatorAddress: await this.getCreatorFromMembershipNFT(), // You'll need to implement this
      tierId: event.tierId,
      duration: event.duration,
      expiresAt: new Date(event.expiresAt * 1000),
      isActive: true,
    });

    await membership.save();

    // Update user membership history
    await User.findOneAndUpdate(
      { address: membership.memberAddress },
      {
        $push: {
          'fanProfile.membershipHistory': {
            creatorAddress: membership.creatorAddress,
            tierId: membership.tierId,
            startDate: membership.createdAt,
            endDate: membership.expiresAt,
            isActive: true,
          }
        }
      },
      { upsert: true }
    );

    logger.info(`Membership processed: Tier ${membership.tierId} for ${membership.memberAddress}`);
  }

  private async handleRewardEvent(event: any): Promise<void> {
    logger.info('Processing reward event:', event);

    if (event.type === 'PointsAwarded') {
      // Update user points balance
      await User.findOneAndUpdate(
        { address: event.fan.toLowerCase() },
        {
          $inc: { 'fanProfile.pointsBalance': event.points }
        },
        { upsert: true }
      );

      logger.info(`Points awarded: ${event.points} to ${event.fan}`);
    } else if (event.type === 'RewardRedeemed') {
      // Update user points balance (subtract)
      await User.findOneAndUpdate(
        { address: event.fan.toLowerCase() },
        {
          $inc: { 'fanProfile.pointsBalance': -event.pointsCost }
        }
      );

      logger.info(`Reward redeemed: ${event.rewardId} by ${event.fan} for ${event.pointsCost} points`);
    }
  }

  private async updateUserTipStats(tipperAddress: string, creatorAddress: string, amount: number): Promise<void> {
    // Update tipper stats
    await User.findOneAndUpdate(
      { address: tipperAddress },
      {
        $inc: { 'fanProfile.totalTipsGiven': amount }
      },
      { upsert: true }
    );

    // Note: Creator stats are calculated dynamically from tips collection
  }

  private async getCreatorFromTipJar(): Promise<string> {
    // This should get the creator address from the TipJar contract
    // For now, return the configured creator address
    const tipJarInfo = await blockchainService.getTipJarInfo();
    return tipJarInfo.creator.toLowerCase();
  }

  private async getCreatorFromMembershipNFT(): Promise<string> {
    // This should get the creator address from the MembershipNFT contract
    // For now, return the configured creator address
    const tipJarInfo = await blockchainService.getTipJarInfo();
    return tipJarInfo.creator.toLowerCase();
  }

  stopListening(): void {
    this.isListening = false;
    logger.info('Event listeners stopped');
  }

  isRunning(): boolean {
    return this.isListening;
  }
}

export const eventListenerService = new EventListenerService();
