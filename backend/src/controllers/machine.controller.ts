import { RequestHandler } from 'express';
import * as machineService from '../services/machine.service.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';

type IdParams = {
  id: string;
};

export const createMachine: RequestHandler = async (req, res) => {
  try {
    const sellerId = req.user?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const machine = await machineService.createMachine(sellerId, req.body);

    res.status(201).json({
      success: true,
      data: machine,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Create machine error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Machine creation failed',
    });
  }
};

export const getAllMachines: RequestHandler = async (_req, res) => {
  try {
    const machines = await machineService.getAllMachines();

    res.json({
      success: true,
      data: machines,
    });
  } catch (err: unknown) {
    console.error('Fetch machines error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch machines',
    });
  }
};

export const getMachineById: RequestHandler<IdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await machineService.getMachineById(id);

    res.json({
      success: true,
      data: machine,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMachineBySlug: RequestHandler<{ slug: string }> = async (req, res) => {
  try {
    const { slug } = req.params;
    const machine = await machineService.getMachineBySlug(slug);

    res.json({
      success: true,
      data: machine,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMachine: RequestHandler<IdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await machineService.updateMachine(id, req.body);

    res.json({
      success: true,
      data: machine,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMachine: RequestHandler<IdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    await machineService.deleteMachine(id);

    res.json({
      success: true,
      message: 'Machine deleted',
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerMachines: RequestHandler = async (req, res) => {
  try {
    const sellerId = req.user?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const machines = await machineService.getSellerMachines(sellerId);

    res.json({
      success: true,
      data: machines,
    });
  } catch (err: unknown) {
    console.error('Seller machines error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller machines',
    });
  }
};

export const uploadMachineImages: RequestHandler<IdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    const uploadPromises = files.map((file) => uploadBufferToCloudinary(file.buffer));

    console.log(`[Images] Starting Cloudinary upload for ${files.length} files...`);

    const imageUrls = await Promise.all(uploadPromises);
    console.log(`[Images] Upload successful:`, imageUrls);

    const machine = await machineService.updateMachine(id, {
      images: imageUrls,
      wizardStep: 4,
    });

    res.json({
      success: true,
      data: machine,
    });
  } catch (err: unknown) {
    const error = err as Error & { http_code?: number };
    console.error('Image upload error:', error);

    res.status(error.http_code || 500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

export const getMachinesByCategory: RequestHandler<{ categoryId: string }> = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const machines = await machineService.getMachinesByCategory(categoryId);

    res.json({
      success: true,
      data: machines,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUniqueLocations: RequestHandler = async (_req, res) => {
  try {
    const locations = await machineService.getUniqueLocations();
    res.json({
      success: true,
      data: locations,
    });
  } catch (err: unknown) {
    console.error('Fetch locations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
    });
  }
};

export const checkAvailability: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, quantity } = req.query;

    if (!startDate || !endDate || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'startDate, endDate, and quantity are required',
      });
    }

    const availability = await machineService.checkAvailability(
      id as string,
      startDate as string,
      endDate as string,
      Number(quantity)
    );

    res.json({
      success: true,
      data: availability,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({
      success: false,
      message: error.message || 'Availability check failed',
    });
  }
};
