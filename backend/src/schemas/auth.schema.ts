import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(30, 'Name must be less than 30 characters')
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Only letters allowed'),

  email: z.string().trim().email('Invalid email format').max(254),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number')
    .regex(/[\W]/, 'Must contain one special character'),

  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone must be 10 digits and start with 6-9'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format').max(254),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number')
    .regex(/[\W]/, 'Must contain one special character'),
});
