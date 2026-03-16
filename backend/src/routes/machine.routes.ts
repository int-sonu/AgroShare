import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { uploadMachineImages } from '../middlewares/upload.js';

import {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
  getSellerMachines,
  uploadMachineImages as uploadMachineImagesController,
} from '../controllers/machine.controller.js';

const router = express.Router();

router.post('/', protect, authorize('seller'), createMachine);

router.get('/', getAllMachines);

router.get('/seller', protect, authorize('seller'), getSellerMachines);

router.get('/:id', getMachineById);

router.put('/:id', protect, authorize('seller'), updateMachine);

router.delete('/:id', protect, authorize('seller'), deleteMachine);

router.put(
  '/:id/images',
  protect,
  authorize('seller'),
  uploadMachineImages.array('images', 5),
  uploadMachineImagesController,
);

export default router;
