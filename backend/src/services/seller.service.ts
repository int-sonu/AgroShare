import { Types } from "mongoose";
import * as sellerRepo from "../repositories/seller.repository.js";
import { ISeller } from "../models/seller.model.js";



export const createProfile = async (
  userId: string,
  data: Partial<ISeller>
) => {
  const existing = await sellerRepo.findSellerByUserId(userId);

  if (existing) {
    throw new Error("Seller profile already exists");
  }

  const sellerData: any = { ...data };
  delete sellerData.verificationStatus;
  delete sellerData.accountNumber;
  delete sellerData.bankName;
  delete sellerData.ifscCode;

  const seller = await sellerRepo.createSeller({
    ...sellerData,
    userId: new Types.ObjectId(userId) as any,
    verificationStatus: "pending",
  });

  return seller;
};


export const getMyProfile = async (userId: string) => {
  const seller = await sellerRepo.findSellerByUserId(userId);

  if (!seller) {
    throw new Error("Seller profile not found");
  }

  return seller;
};

export const updateProfile = async (
  userId: string,
  data: Partial<ISeller>
) => {
  const updateData: any = { ...data };
  delete updateData.userId;
  delete updateData.verificationStatus;
  delete updateData.accountNumber;
  delete updateData.ifscCode;
  delete updateData.bankName;

  const seller = await sellerRepo.updateSellerByUserId(userId, updateData);

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};

export const updateBankDetails = async (
  userId: string,
  bankData: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  }
) => {
  const seller = await sellerRepo.findSellerByUserId(userId);

  if (!seller) {
    throw new Error("Seller not found");
  }

  if (seller.verificationStatus !== "approved") {
    throw new Error("Seller not approved by admin");
  }
  seller.bankName = bankData.bankName;
  seller.accountNumber = bankData.accountNumber;
  seller.ifscCode = bankData.ifscCode;

  await seller.save();

  return seller;
};

export const verifySeller = async (
  sellerId: string,
  status: "approved" | "rejected"
) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const seller = await sellerRepo.updateSellerStatus(
    sellerId,
    status
  );

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};

export const deleteProfile = async (userId: string) => {
  const seller = await sellerRepo.deleteSellerByUserId(userId);

  if (!seller) {
    throw new Error("Seller not found");
  }

  return { message: "Seller profile deleted successfully" };
};