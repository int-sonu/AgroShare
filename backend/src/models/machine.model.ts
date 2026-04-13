import mongoose, { Schema, Document } from 'mongoose';

export interface IMachine extends Document {
  seller: mongoose.Types.ObjectId;

  machineName: string;
  slug: string; 

  category: mongoose.Types.ObjectId;

  brandModel?: string;
  yearOfManufacture?: number;

  condition?: 'New' | 'Good' | 'Used';

  machineCapacityHP?: number;

  fuelType?: 'Diesel' | 'Petrol';

  description?: string;

  pricing?: {
    priceType: 'Per Hour' | 'Per Day' | 'Per Acre';
    rentalPrice: number;
    minimumRentalDuration?: number;
    securityDeposit?: number;
  };

  location?: {
    address?: string;
    village?: string;
    district?: string;
    state?: string;
    pincode?: string;

    type?: 'Point';
    coordinates?: number[];
  };

  images?: string[];

  operator?: {
    operatorIncluded: boolean;
    operatorName?: string;
    operatorPhone?: string;
  };

  transport?: {
    transportAvailable: boolean;
    transportCost?: number;
  };

  stock: number;
  quantity: number;

  isPublished: boolean;
  wizardStep: number;
}

const machineSchema = new Schema<IMachine>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    machineName: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    brandModel: String,

    yearOfManufacture: Number,

    condition: {
      type: String,
      enum: ['New', 'Good', 'Used'],
    },

    machineCapacityHP: Number,

    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol'],
    },

    description: String,

    pricing: {
      priceType: {
        type: String,
        enum: ['Per Hour', 'Per Day', 'Per Acre'],
      },
      rentalPrice: Number,
      minimumRentalDuration: Number,
      securityDeposit: Number,
    },

    location: {
      address: String,
      village: String,
      district: String,
      state: String,
      pincode: String,

      type: {
        type: String,
        enum: ['Point'],
      },

      coordinates: {
        type: [Number],
        default: undefined,
        validate: {
          validator: (v: number[]) => !v || v.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },

    images: [String],

    operator: {
      operatorIncluded: {
        type: Boolean,
        default: false,
      },
      operatorName: String,
      operatorPhone: String,
    },

    transport: {
      transportAvailable: {
        type: Boolean,
        default: false,
      },
      transportCost: Number,
    },

    stock: {
      type: Number,
      default: 1,
    },
    quantity: {
      type: Number,
      default: 1,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    wizardStep: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);


machineSchema.index({ 'location.coordinates': '2dsphere' });


machineSchema.pre('validate', async function () {
  if (!this.machineName) return;

  const Machine =
    mongoose.models.Machine || mongoose.model<IMachine>('Machine');

  const baseSlug = this.machineName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  let slug = baseSlug;
  let count = 1;

  while (await Machine.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});


export default mongoose.model<IMachine>('Machine', machineSchema);