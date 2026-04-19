import Booking from '../models/booking.model.js';
import logger from '../config/logger.js';
import { sendReservationExpiredEmail } from '../services/email.service.js';

export const startReservationCleanup = () => {
  // Check every 15 minutes
  setInterval(async () => {
    try {
      const now = new Date();
      // Find bookings with type 'reservation', status 'pending', and holdExpiresAt < now
      const expiredBookings = await Booking.find({
        bookingType: 'reservation',
        status: 'pending',
        holdExpiresAt: { $lt: now }
      }).populate('customer machine');

      if (expiredBookings.length > 0) {
        logger.info(`Found ${expiredBookings.length} expired reservations. Cleaning up...`);
      }

      for (const booking of expiredBookings) {
        // Cancel booking
        booking.status = 'cancelled';
        booking.holdExpiresAt = undefined;
        await booking.save();
        
        logger.info(`Reservation ${booking._id} expired. Slot released.`);
        
        // Notify user
        const customer = booking.customer as any;
        const machine = booking.machine as any;
        if (customer?.email) {
          try {
            await sendReservationExpiredEmail(customer.email, machine?.machineName || 'Machine');
            logger.info(`Sent expiry notification to ${customer.email}`);
          } catch (mailError: any) {
            logger.error(`Failed to send expiry email: ${mailError.message}`);
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error in reservation cleanup: ${error.message}`);
    }
  }, 15 * 60 * 1000);
};
