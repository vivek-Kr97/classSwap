import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  slotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid slot ID'),
  semesterId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid semester ID'),
});

export const bulkEnrollmentSchema = z.object({
  enrollments: z.array(createEnrollmentSchema).min(1, 'At least one enrollment required'),
});

export const createSwapRuleSchema = z.object({
  programId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  semesterId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  maxSwapsPerStudent: z.number().int().nonnegative().default(2),
  swapWindowStart: z.string().transform((val) => new Date(val)),
  swapWindowEnd: z.string().transform((val) => new Date(val)),
  sameCourseOnly: z.boolean().default(true),
  sameProgramOnly: z.boolean().default(true),
  capacityCheckEnabled: z.boolean().default(true),
  clashCheckEnabled: z.boolean().default(true),
  requireFacultyApproval: z.boolean().default(true),
});

export const updateSwapRuleSchema = createSwapRuleSchema.partial();
