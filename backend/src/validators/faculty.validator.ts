import { z } from 'zod';

export const facultyDecisionSchema = z.object({
  comment: z.string().optional(),
});
