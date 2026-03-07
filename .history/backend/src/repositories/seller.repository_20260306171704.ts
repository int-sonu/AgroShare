import Seller from "../models/seller.model.js";

export const createSeller = (data: any) => {
  return Seller.create(data);
};

export const findSellerByUserId = (userId: string) => {
  return Seller.findOne({ userId });
};

export const findSellerById = (sellerId: string) => {
  return Seller.findById(sellerId);
};

export const findAllSellers = () => {
  return Seller.find();
};

export const updateSellerByUserId = (
  userId: string,
  data: any
) => {
  return Seller.findOneAndUpdate(
    { userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const updateSellerStatus = (
  sellerId: string,
  status: "pending" | "verified" | "rejected"
) => {
  return Seller.findByIdAndUpdate(
    sellerId,
    { status },
    { new: true }
  );
};

export const deleteSellerByUserId = (userId: string) => {
  return Seller.findOneAndDelete({ userId });
};