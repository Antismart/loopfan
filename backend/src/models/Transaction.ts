import mongoose, { Document, Schema } from 'mongoose';

export interface ITip extends Document {
  txHash: string;
  blockNumber: number;
  tipperAddress: string;
  creatorAddress: string;
  amount: number;
  token: string; // 'ETH' or USDC contract address
  message: string;
  referrerAddress?: string;
  referralAmount?: number;
  createdAt: Date;
}

const tipSchema = new Schema<ITip>({
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  tipperAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  creatorAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  referrerAddress: {
    type: String,
    lowercase: true,
  },
  referralAmount: Number,
}, {
  timestamps: true,
});

// Indexes
tipSchema.index({ creatorAddress: 1, createdAt: -1 });
tipSchema.index({ tipperAddress: 1, createdAt: -1 });
tipSchema.index({ txHash: 1 });
tipSchema.index({ blockNumber: 1 });

export const Tip = mongoose.model<ITip>('Tip', tipSchema);

export interface IMembership extends Document {
  txHash: string;
  blockNumber: number;
  memberAddress: string;
  creatorAddress: string;
  tierId: number;
  duration: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

const membershipSchema = new Schema<IMembership>({
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  memberAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  creatorAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  tierId: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
membershipSchema.index({ memberAddress: 1, creatorAddress: 1, isActive: 1 });
membershipSchema.index({ creatorAddress: 1, createdAt: -1 });
membershipSchema.index({ expiresAt: 1 });
membershipSchema.index({ txHash: 1 });

export const Membership = mongoose.model<IMembership>('Membership', membershipSchema);

export interface IReward extends Document {
  rewardId: number;
  creatorAddress: string;
  pointsCost: number;
  description: string;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>({
  rewardId: {
    type: Number,
    required: true,
  },
  creatorAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  pointsCost: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  maxRedemptions: {
    type: Number,
    required: true,
  },
  currentRedemptions: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index for unique reward ID per creator
rewardSchema.index({ rewardId: 1, creatorAddress: 1 }, { unique: true });
rewardSchema.index({ creatorAddress: 1, isActive: 1 });

export const Reward = mongoose.model<IReward>('Reward', rewardSchema);
