import { Router } from "express";
import { UserRole } from "./../constants/roles";
import * as facultyController from "./../controllers/faculty.controller";
import { authenticate, authorizeRoles } from "./../middlewares/auth.middleware";
import { validateBody } from "./../middlewares/validate.middleware";
import { facultyDecisionSchema } from "./../validators/faculty.validator";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles(UserRole.FACULTY, UserRole.ADMIN));

router.get("/swaps/pending", facultyController.getPendingSwaps);
router.get("/swaps/history", facultyController.getFacultySwapHistory);
router.get("/swaps/:id", facultyController.getFacultySwapById);

router.post(
  "/swaps/:id/approve",
  validateBody(facultyDecisionSchema),
  facultyController.approveSwap,
);
router.post(
  "/swaps/:id/reject",
  validateBody(facultyDecisionSchema),
  facultyController.rejectSwap,
);

export default router;
