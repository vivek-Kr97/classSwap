import { Router } from "express";
import { UserRole } from "./../constants/roles";
import * as adminController from "./../controllers/admin.controller";
import { authenticate, authorizeRoles } from "./../middlewares/auth.middleware";
import { validateBody } from "./../middlewares/validate.middleware";
import {
  createCourseSchema,
  createDepartmentSchema,
  createProgramSchema,
  createSemesterSchema,
  createSlotSchema,
  updateCourseSchema,
  updateDepartmentSchema,
  updateProgramSchema,
  updateSemesterSchema,
  updateSlotSchema,
} from "./../validators/academic.validator";
import {
  bulkEnrollmentSchema,
  createEnrollmentSchema,
  createSwapRuleSchema,
  updateSwapRuleSchema,
} from "./../validators/admin.validator";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles(UserRole.ADMIN));

// Admin Dashboard & Audit Logs
router.get("/dashboard", adminController.getDashboardStats);
router.get("/audit-logs", adminController.getAuditLogs);
router.get("/swaps", adminController.getAllSwaps);

// Departments
router.post(
  "/departments",
  validateBody(createDepartmentSchema),
  adminController.createDepartment,
);
router.patch(
  "/departments/:id",
  validateBody(updateDepartmentSchema),
  adminController.updateDepartment,
);
router.delete("/departments/:id", adminController.deleteDepartment);

// Programs
router.post(
  "/programs",
  validateBody(createProgramSchema),
  adminController.createProgram,
);
router.patch(
  "/programs/:id",
  validateBody(updateProgramSchema),
  adminController.updateProgram,
);
router.delete("/programs/:id", adminController.deleteProgram);

// Semesters
router.post(
  "/semesters",
  validateBody(createSemesterSchema),
  adminController.createSemester,
);
router.patch(
  "/semesters/:id",
  validateBody(updateSemesterSchema),
  adminController.updateSemester,
);

// Courses
router.post(
  "/courses",
  validateBody(createCourseSchema),
  adminController.createCourse,
);
router.patch(
  "/courses/:id",
  validateBody(updateCourseSchema),
  adminController.updateCourse,
);
router.delete("/courses/:id", adminController.deleteCourse);
router.patch(
  "/courses/:courseId/faculty",
  adminController.assignFacultyToCourse,
);

// Slots
router.post(
  "/slots",
  validateBody(createSlotSchema),
  adminController.createSlot,
);
router.patch(
  "/slots/:id",
  validateBody(updateSlotSchema),
  adminController.updateSlot,
);
router.delete("/slots/:id", adminController.deleteSlot);

// Enrollments
router.post(
  "/enrollments",
  validateBody(createEnrollmentSchema),
  adminController.createEnrollment,
);
router.post(
  "/enrollments/bulk",
  validateBody(bulkEnrollmentSchema),
  adminController.bulkCreateEnrollments,
);

// Swap rules
router.get("/swap-rules", adminController.getSwapRules);
router.post(
  "/swap-rules",
  validateBody(createSwapRuleSchema),
  adminController.createSwapRule,
);
router.patch(
  "/swap-rules/:id",
  validateBody(updateSwapRuleSchema),
  adminController.updateSwapRule,
);

// Student inspection & conflict check
router.get(
  "/students/:id/timetable",
  adminController.getStudentTimetableForAdmin,
);
router.post(
  "/students/:id/check-slot",
  adminController.checkStudentSlotConflict,
);

export default router;
