import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
