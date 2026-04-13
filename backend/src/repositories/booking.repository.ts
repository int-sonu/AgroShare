import Booking, { IBooking } from '../models/booking.model.js';

export const createBooking = async (data: Partial<IBooking>) => {
  return Booking.create(data);
};

export const getBookingById = async (id: string) => {
  return Booking.findById(id).populate('machine customer seller');
};

export const getSellerBookings = async (sellerId: string) => {
  return Booking.find({ seller: sellerId })
    .populate('machine customer')
    .sort({ createdAt: -1 });
};

export const getCustomerBookings = async (customerId: string) => {
  return Booking.find({ customer: customerId })
    .populate('machine seller')
    .sort({ createdAt: -1 });
};

export const updateBookingStatus = async (id: string, status: string) => {
  return Booking.findByIdAndUpdate(id, { status }, { new: true });
};

export const updateBooking = async (id: string, data: Partial<IBooking>) => {
  return Booking.findByIdAndUpdate(id, data, { new: true });
};
