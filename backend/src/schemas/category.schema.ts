import { z } from 'zod';

export const generateSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '-');

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be under 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed')
    .refine((val) => !/\s{2,}/.test(val), {
      message: 'Multiple spaces are not allowed',
    }),

  description: z.string().trim().max(200, 'Description too long').optional(),

  status: z.enum(['active', 'inactive']),
});
