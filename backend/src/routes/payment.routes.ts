import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-payment', protect, paymentController.confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router;
