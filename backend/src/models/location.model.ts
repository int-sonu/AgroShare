import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const locationSchema = new Schema<ILocation>({
  city: String,
  state: String,
  country: String,
  pincode: String,
});

export default mongoose.model<ILocation>('Location', locationSchema);
