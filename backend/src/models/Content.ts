import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  creatorAddress: string;
  title: string;
  description: string;
  contentHash: string;
  contentType: 'video' | 'audio' | 'image' | 'text' | 'livestream';
  fileUrl?: string;
  thumbnailUrl?: string;
  isGated: boolean;
  requiredTiers: number[];
  priceInUSDC?: number;
  isActive: boolean;
  metadata: {
    duration?: number;
    fileSize?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  engagement: {
    views: number;
    tips: {
      count: number;
      totalAmount: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>({
  creatorAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  contentHash: {
    type: String,
    required: true,
    unique: true,
  },
  contentType: {
    type: String,
    enum: ['video', 'audio', 'image', 'text', 'livestream'],
    required: true,
  },
  fileUrl: String,
  thumbnailUrl: String,
  isGated: {
    type: Boolean,
    default: false,
  },
  requiredTiers: [Number],
  priceInUSDC: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    duration: Number,
    fileSize: Number,
    dimensions: {
      width: Number,
      height: Number,
    },
  },
  engagement: {
    views: {
      type: Number,
      default: 0,
    },
    tips: {
      count: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
  },
}, {
  timestamps: true,
});

// Indexes
contentSchema.index({ creatorAddress: 1, createdAt: -1 });
contentSchema.index({ contentHash: 1 });
contentSchema.index({ isGated: 1, isActive: 1 });
contentSchema.index({ contentType: 1 });

export const Content = mongoose.model<IContent>('Content', contentSchema);
