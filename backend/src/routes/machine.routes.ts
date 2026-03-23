import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { uploadMachineImages } from '../middlewares/upload.js';

import {createMachine,getAllMachines,getMachineById,getMachineBySlug,updateMachine,deleteMachine,getSellerMachines,uploadMachineImages as uploadMachineImagesController,
  getMachinesByCategory,
  getUniqueLocations,
} from '../controllers/machine.controller.js';

const router = express.Router();

router.post('/', protect, authorize('seller'), createMachine);

router.get('/', getAllMachines);

router.get('/seller', protect, authorize('seller'), getSellerMachines);

router.get('/slug/:slug', getMachineBySlug);

router.get('/:id', getMachineById);

router.get('/category/:categoryId', getMachinesByCategory);

router.get('/locations', getUniqueLocations);

router.put('/:id', protect, authorize('seller'), updateMachine);

router.delete('/:id', protect, authorize('seller'), deleteMachine);

router.put('/:id/images',protect,authorize('seller'),uploadMachineImages.array('images', 5),
uploadMachineImagesController,
);

export default router;
