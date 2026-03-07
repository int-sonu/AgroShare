import { Request, Response } from "express";
import * as sellerService from "../services/seller.service.js";

export const createSellerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Not authenticated");
    }
    const seller = await sellerService.createProfile(
      req.user.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      data: seller,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Creation failed",
    });
  }
};

export const getMySellerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Not authenticated");
    }
    const seller = await sellerService.getMyProfile(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Profile not found",
    });
  }
};

export const updateSellerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Not authenticated");
    }
    const seller = await sellerService.updateProfile(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: seller,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    });
  }
};

export const updateSellerBankDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Not authenticated");
    }
    const seller = await sellerService.updateBankDetails(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: seller,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Bank details update failed",
    });
  }
};

export const deleteSellerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Not authenticated");
    }
    const result = await sellerService.deleteProfile(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Delete failed",
    });
  }
};
