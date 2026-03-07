import { Request, Response } from "express";
import { User } from "../models/user.model.js"; 
import Seller from "../models/seller.model.js";
import * as adminService from "../services/admin.service.js";
export const dashboard = async (req: any, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        adminId: req.user.userId,
        role: req.user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async(req: Request, res: Response) => {
  try {

    const users = await User.find({role:"customer"})
      .select("-password -refreshToken") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });

  }
};

export const getAllSellers = async (_req: Request, res: Response) => {
  try {
    const sellers = await adminService.getAllSellers();

    return res.status(200).json({
      success: true,
      data: sellers,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingSellers = async (_req: Request, res: Response) => {
  try {
    const sellers = await adminService.getPendingSellers();

    return res.status(200).json({
      success: true,
      data: sellers,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifySeller = async (
  req: Request<{ sellerId: string }>,
  res: Response
) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;

    const seller = await adminService.verifySeller(
      sellerId,
      status
    );

    return res.status(200).json({
      success: true,
      data: seller,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
