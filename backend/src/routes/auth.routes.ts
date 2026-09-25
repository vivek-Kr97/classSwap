import { Router } from "express";
import * as authController from "./../controllers/auth.controller";
import { authenticate } from "./../middlewares/auth.middleware";
import { validateBody } from "./../middlewares/validate.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerStudentSchema,
} from "./../validators/auth.validator";

const router = Router();

router.post(
  "/register/student",
  validateBody(registerStudentSchema),
  authController.registerStudent,
);
router.post("/login", validateBody(loginSchema), authController.login);
router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  authController.refresh,
);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;
