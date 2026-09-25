import { z } from 'zod';

export const registerStudentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  enrollmentNumber: z.string().min(3, 'Enrollment number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  programId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid program ID'),
  semesterId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid semester ID'),
  batch: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
