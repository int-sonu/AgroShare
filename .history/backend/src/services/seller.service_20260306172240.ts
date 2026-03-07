import * as sellerRepo from "../repositories/seller.repository.js";
import { ISeller } from "../models/seller.model.js";

const calculateProfileCompletion = (seller: ISeller) => {
  return (
    seller.state &&
    seller.district &&
    seller.city &&
    seller.address &&
    seller.pincode &&
    seller.sellerType
  );
};


export const createProfile = async (
  userId: string,
  data: Partial<ISeller>
) => {
  const existing = await sellerRepo.findSellerByUserId(userId);

  if (existing) {
    throw new Error("Seller profile already exists");
  }

  delete (data as any).status;
  delete (data as any).accountNumber;
  delete (data as any).bankName;
  delete (data as any).ifscCode;

  const seller = await sellerRepo.createSeller({
    ...data,
    userId,
    status: "pending",
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
  delete (data as any).userId;
  delete (data as any).status;
  delete (data as any).accountNumber;
  delete (data as any).ifscCode;
  delete (data as any).bankName;

  const seller = await sellerRepo.updateSellerByUserId(userId, data);

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
  status: "verified" | "rejected"
) => {
  if (!["verified", "rejected"].includes(status)) {
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