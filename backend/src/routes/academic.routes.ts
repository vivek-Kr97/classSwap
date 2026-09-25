import { Router } from "express";
import * as academicController from "./../controllers/academic.controller";

const router = Router();

// Departments
router.get("/departments", academicController.getDepartments);
router.get("/departments/:id", academicController.getDepartmentById);

// Programs
router.get("/programs", academicController.getPrograms);
router.get("/programs/:id", academicController.getProgramById);

// Semesters
router.get("/semesters", academicController.getSemesters);
router.get("/semesters/:id", academicController.getSemesterById);

// Courses
router.get("/courses", academicController.getCourses);
router.get("/courses/:id", academicController.getCourseById);
router.get("/courses/:courseId/slots", academicController.getCourseSlots);

// Slots
router.get("/slots", academicController.getSlots);
router.get("/slots/:id", academicController.getSlotById);

export default router;
