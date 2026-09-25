import { Router } from "express";
import { UserRole } from "./../constants/roles";
import * as studentController from "./../controllers/student.controller";
import { authenticate, authorizeRoles } from "./../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles(UserRole.STUDENT, UserRole.ADMIN));

router.get("/me", studentController.getMyProfile);
router.get("/me/timetable", studentController.getMyTimetable);

export default router;
