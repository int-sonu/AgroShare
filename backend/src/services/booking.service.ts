import * as bookingRepo from '../repositories/booking.repository.js';
import * as machineRepo from '../repositories/machine.repository.js';
import { checkAvailability } from './machine.service.js';
import mongoose from 'mongoose';

export const createBooking = async (
  customerId: string,
  data: {
    machineId: string;
    startDate: string;
    endDate: string;
    quantity: number;
    bookingType: 'reservation' | 'rental';
    duration?: number;
    deliveryMethod?: 'pickup' | 'delivery';
    deliveryAddress?: string;
  }
) => {
  const machine = await machineRepo.getMachineById(data.machineId);
  if (!machine) {
    throw new Error('Machine not found');
  }

  const availability = await checkAvailability(
    data.machineId,
    data.startDate,
    data.endDate,
    data.quantity
  );

  if (!availability.isAvailable) {
    throw new Error(`Requested quantity not available for these dates. Max available: ${availability.availableQty}`);
  }

  if (data.quantity > 2 && data.bookingType === 'reservation') {
    throw new Error('Reservations are only allowed for quantities of 2 or less');
  }

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const billingUnits = data.duration || diffDays;
  const dailyPrice = machine.pricing?.rentalPrice || 0;
  const securityDeposit = machine.pricing?.securityDeposit || 0;
  
  let totalPrice = (dailyPrice * billingUnits * data.quantity) + securityDeposit;

  if (data.deliveryMethod === 'delivery' && machine.transport?.transportAvailable) {
    totalPrice += (machine.transport?.transportCost || 200);
  }

  const bookingData: any = {
    machine: new mongoose.Types.ObjectId(data.machineId),
    customer: new mongoose.Types.ObjectId(customerId),
    seller: machine.seller,
    startDate: start,
    endDate: end,
    quantity: data.quantity,
    totalPrice,
    bookingType: data.bookingType,
    deliveryMethod: data.deliveryMethod || 'pickup',
    deliveryAddress: data.deliveryAddress,
    status: 'pending' as const,
  };

  if (data.bookingType === 'reservation') {
    const holdHours = 6;
    bookingData.holdExpiresAt = new Date(Date.now() + holdHours * 60 * 60 * 1000);
  } else {
    const holdMinutes = 30;
    bookingData.holdExpiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);
  }

  return bookingRepo.createBooking(bookingData);
};

export const getSellerBookings = async (sellerId: string) => {
  return bookingRepo.getSellerBookings(sellerId);
};

export const getCustomerBookings = async (customerId: string) => {
  return bookingRepo.getCustomerBookings(customerId);
};

export const updateBookingStatus = async (id: string, userId: string, status: string, role: string) => {
  const booking = await bookingRepo.getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (role === 'seller' && booking.seller._id.toString() !== userId) {
    throw new Error('Unauthorized to update this booking (Seller Check)');
  }

  if (role === 'customer') {
    if (booking.customer._id.toString() !== userId) {
      throw new Error('Unauthorized: This is not your booking');
    }
    if (status !== 'cancelled') {
      throw new Error('Customers can only cancel their own bookings');
    }
  }

  return bookingRepo.updateBookingStatus(id, status);
};
