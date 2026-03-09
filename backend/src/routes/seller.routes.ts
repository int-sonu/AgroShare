import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import * as sellerController from '../controllers/seller.controller.js';

const router = express.Router();

router.post('/profile', protect, authorize('seller'), sellerController.createSellerProfile);

router.get('/profile', protect, authorize('seller'), sellerController.getMySellerProfile);

router.put('/profile', protect, authorize('seller'), sellerController.updateSellerProfile);

router.put('/bank', protect, authorize('seller'), sellerController.updateSellerBankDetails);

router.delete('/profile', protect, authorize('seller'), sellerController.deleteSellerProfile);

export default router;
