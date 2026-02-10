import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  role: "renter" | "seller" | "admin";
  status: "Enable" | "Disable";
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true, 
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["renter", "seller", "admin"],
      default: "renter",
    },

    status: {
      type: String,
      enum: ["Enable", "Disable"],
      default: "Enable",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
