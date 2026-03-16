import mongoose, { Schema, Document } from 'mongoose';

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;

  sellerType: 'individual' | 'shop';
  businessName?: string;
  profileImage?: string;

  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;

  isProfileComplete: boolean;

  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNote?: string;

  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankAdded: boolean;

  deliveryAvailable: boolean;
  deliveryRadius?: number;

  profileStep: number;

  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  fullAddress?: string;
}

const sellerSchema = new Schema<ISeller>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    sellerType: {
      type: String,
      enum: ['individual', 'shop'],
      required: true,
    },

    businessName: {
      type: String,
      trim: true,
      required: function (this: ISeller) {
        return this.sellerType === 'shop';
      },
    },

    profileImage: String,

    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, 'Invalid pincode'],
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    verificationNote: String,

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockReason: {
      type: String,
      trim: true,
    },

    blockedAt: {
      type: Date,
    },

    bankName: { type: String, trim: true },

    accountNumber: {
      type: String,
      trim: true,
      select: false,
    },

    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'],
    },

    bankAdded: {
      type: Boolean,
      default: false,
    },

    deliveryAvailable: {
      type: Boolean,
      default: false,
    },

    deliveryRadius: {
      type: Number,
      min: 0,
      required: function (this: ISeller) {
        return this.deliveryAvailable === true;
      },
    },

    profileStep: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

sellerSchema.virtual('fullAddress').get(function (this: ISeller) {
  return `${this.address}, ${this.city}, ${this.district}, ${this.state} - ${this.pincode}`;
});

sellerSchema.index({ state: 1, district: 1, city: 1 });

export default mongoose.model<ISeller>('Seller', sellerSchema);
