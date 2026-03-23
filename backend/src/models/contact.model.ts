import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema);
