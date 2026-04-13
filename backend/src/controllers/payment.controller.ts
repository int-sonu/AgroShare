import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service.js';
import * as bookingRepo from '../repositories/booking.repository.js';
import logger from '../config/logger.js';

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
       res.status(400).json({ message: 'Booking ID is required' });
       return;
    }

    const booking = await bookingRepo.getBookingById(bookingId);
    if (!booking) {
       res.status(404).json({ message: 'Booking not found' });
       return;
    }

    // BLOCK DOUBLE PAYMENT: If already confirmed or paid, don't create new intent
    if (booking.status === 'confirmed' || booking.paymentStatus === 'paid') {
       res.status(400).json({ message: 'This booking is already confirmed and paid.' });
       return;
    }

    // Ensure the customer requesting the payment is the one who made the booking
    const customerId = (booking.customer as any)._id?.toString() || booking.customer.toString();
    if (customerId !== (req.user as any).userId) {
       res.status(403).json({ message: 'Forbidden: You do not own this booking' });
       return;
    }

    const paymentIntent = await paymentService.createPaymentIntent(booking.totalPrice, 'inr');
    
    // Update booking with payment intent ID
    await bookingRepo.updateBooking(bookingId, { 
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: 'pending' 
    } as any);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error: any) {
    logger.error(`Create Payment Intent Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    const customerId = (req as any).user.userId;

    const booking = await bookingRepo.getBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.customer._id.toString() !== customerId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    // OPTIONAL: Verify with Stripe if paymentIntentId is provided
    if (paymentIntentId) {
      const intent = await paymentService.getPaymentIntent(paymentIntentId);
      if (intent.status !== 'succeeded') {
        res.status(400).json({ success: false, message: `Stripe payment status: ${intent.status}. Confirmation denied.` });
        return;
      }
    }

    // Update booking status and clear hold
    await bookingRepo.updateBooking(bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid',
      holdExpiresAt: undefined as any
    });

    res.status(200).json({ success: true, message: 'Payment confirmed and hold cleared' });
  } catch (error: any) {
    logger.error(`Confirm Payment Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  // Webhook implementation can be added here for robust payment confirmation
  res.status(200).send('Webhook received');
};
