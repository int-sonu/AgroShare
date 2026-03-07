import { Request, Response } from "express";
import * as sellerService from "../services/seller.service.js";

export const createSellerProfile = async (req: any, res: Response) => {
  try {
    const seller = await sellerService.createProfile(
      req.user.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      data: seller,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMySellerProfile = async (req: any, res: Response) => {
  try {
    const seller = await sellerService.getMyProfile(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSellerProfile = async (req: any, res: Response) => {
  try {
    const seller = await sellerService.updateProfile(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: seller,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSellerBankDetails = async (req: any, res: Response) => {
  try {
    const seller = await sellerService.updateBankDetails(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: seller,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSellerProfile = async (req: any, res: Response) => {
  try {
    const result = await sellerService.deleteProfile(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
