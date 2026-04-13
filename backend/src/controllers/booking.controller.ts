import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service.js';
import logger from '../config/logger.js';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId;
    const booking = await bookingService.createBooking(customerId, req.body);
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error(`Create Booking Error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerBookings = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.userId;
    const bookings = await bookingService.getSellerBookings(sellerId);
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    logger.error(`Get Seller Bookings Error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerBookings = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId;
    const bookings = await bookingService.getCustomerBookings(customerId);
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    logger.error(`Get Customer Bookings Error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const role = (req as any).user.role;
    const { id } = req.params;
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(id as string, userId, status, role);
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error(`Update Booking Status Error: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
