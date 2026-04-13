import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { createBooking, getSellerBookings, getCustomerBookings, updateBookingStatus,} from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerBookings);
router.get('/customer', protect, getCustomerBookings);
router.patch('/:id/status', protect, authorize('seller', 'admin'), updateBookingStatus);
router.patch('/:id/cancel', protect, updateBookingStatus); // Customer self-cancel

export default router;
