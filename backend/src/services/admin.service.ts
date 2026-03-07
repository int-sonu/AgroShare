import Seller from "../models/seller.model.js";

export const getAllSellers = async () => {
  return Seller.find()
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });
};

export const getPendingSellers = async () => {
  return Seller.find({ verificationStatus: "pending" })
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });
};

export const verifySeller = async (
  sellerId: string,
  status: "approved" | "rejected"
) => {

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    throw new Error("Seller not found");
  }

  seller.verificationStatus = status;

  await seller.save();

  return seller;
};