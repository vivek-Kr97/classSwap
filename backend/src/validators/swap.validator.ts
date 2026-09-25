import { z } from 'zod';

export const checkSwapSchema = z.object({
  currentSlotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid current slot ID'),
  desiredSlotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid desired slot ID'),
});

export const createSwapRequestSchema = z.object({
  currentSlotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid current slot ID'),
  desiredSlotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid desired slot ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});
