import { Request, Response, NextFunction } from 'express';
import Seller from '../models/seller.model.js';

export const sellerActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authenticated',
      });
    }

    const seller = await Seller.findOne({
      userId: req.user.userId,
    });

    if (!seller) {
      return res.status(404).json({
        message: 'Seller profile not found',
      });
    }

    if (seller.verificationStatus !== 'approved') {
      return res.status(403).json({
        message: 'Admin approval pending',
      });
    }

    if (!seller.bankAdded) {
      return res.status(403).json({
        message: 'Add bank details first',
      });
    }

    next();
  } catch {
    return res.status(500).json({
      message: 'Server error',
    });
  }
};
