import { z } from "zod";
import { DayOfWeek, SlotType } from "./../constants/roles";

export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name required"),
  code: z.string().min(2, "Department code required"),
  description: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const createProgramSchema = z.object({
  name: z.string().min(2, "Program name required"),
  code: z.string().min(2, "Program code required"),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID"),
  durationSemesters: z.number().int().positive().default(4),
});

export const updateProgramSchema = createProgramSchema.partial();

export const createSemesterSchema = z.object({
  name: z.string().min(2, "Semester name required"),
  number: z.number().int().positive(),
  academicYear: z.string().min(4, "Academic year required"),
  programId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid program ID"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateSemesterSchema = createSemesterSchema.partial();

export const createCourseSchema = z.object({
  code: z.string().min(2, "Course code required"),
  name: z.string().min(2, "Course name required"),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID").optional(),
  programId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid program ID").optional(),
  semesterId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid semester ID").optional(),
  credits: z.number().int().positive().default(3),
  hasLecture: z.boolean().default(true),
  hasLab: z.boolean().default(false),
  facultyIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

const baseSlotSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  semesterId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid semester ID").optional(),
  type: z.nativeEnum(SlotType),
  batch: z.string().optional(),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid startTime format HH:MM",
    ),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid endTime format HH:MM"),
  room: z.string().min(1, "Room is required"),
  capacity: z.number().int().positive().default(30),
  facultyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  swappable: z.boolean().default(true),
});

export const createSlotSchema = baseSlotSchema.refine(
  (data) => data.startTime < data.endTime,
  {
    message: "startTime must be before endTime",
    path: ["endTime"],
  },
);

export const updateSlotSchema = baseSlotSchema.partial();
