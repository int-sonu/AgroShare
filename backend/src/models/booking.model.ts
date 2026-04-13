import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  machine: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  quantity: number;
  totalPrice: number;
  bookingType: 'reservation' | 'rental';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  holdExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    machine: {
      type: Schema.Types.ObjectId,
      ref: 'Machine',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['reservation', 'rental'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: {
      type: String,
    },
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    deliveryAddress: {
      type: String,
    },
    holdExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
