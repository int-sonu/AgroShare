import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimit.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), rateLimiter, authController.register);
router.post('/login', validate(loginSchema), rateLimiter, authController.login);
router.post('/forgot-password', rateLimiter, authController.forgotPassword);

router.get('/user', protect, authController.getUser);
router.post('/refresh', authController.refresh);
router.put('/reset-password/:token', authController.resetPassword);
router.post('/logout', protect, authController.logout);

export default router;
