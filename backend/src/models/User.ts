import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  address: string;
  email?: string;
  username?: string;
  bio?: string;
  profileImage?: string;
  isCreator: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Creator-specific fields
  creatorProfile?: {
    displayName: string;
    description: string;
    socialLinks: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
      website?: string;
    };
    membershipTiers: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      maxDuration: number;
      benefits: string[];
      isActive: boolean;
    }>;
  };
  
  // Fan-specific fields
  fanProfile?: {
    pointsBalance: number;
    totalTipsGiven: number;
    membershipHistory: Array<{
      creatorAddress: string;
      tierId: number;
      startDate: Date;
      endDate: Date;
      isActive: boolean;
    }>;
  };
}

const userSchema = new Schema<IUser>({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
  },
  username: {
    type: String,
    sparse: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  profileImage: String,
  isCreator: {
    type: Boolean,
    default: false,
  },
  creatorProfile: {
    displayName: String,
    description: String,
    socialLinks: {
      twitter: String,
      instagram: String,
      youtube: String,
      website: String,
    },
    membershipTiers: [{
      id: Number,
      name: String,
      description: String,
      price: Number,
      maxDuration: Number,
      benefits: [String],
      isActive: {
        type: Boolean,
        default: true,
      },
    }],
  },
  fanProfile: {
    pointsBalance: {
      type: Number,
      default: 0,
    },
    totalTipsGiven: {
      type: Number,
      default: 0,
    },
    membershipHistory: [{
      creatorAddress: String,
      tierId: Number,
      startDate: Date,
      endDate: Date,
      isActive: Boolean,
    }],
  },
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ address: 1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isCreator: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
