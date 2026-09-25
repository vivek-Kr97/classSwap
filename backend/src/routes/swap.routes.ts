import { Router } from "express";
import { UserRole } from "./../constants/roles";
import * as swapController from "./../controllers/swap.controller";
import { authenticate, authorizeRoles } from "./../middlewares/auth.middleware";
import { validateBody } from "./../middlewares/validate.middleware";
import {
  checkSwapSchema,
  createSwapRequestSchema,
} from "./../validators/swap.validator";

const router = Router();

router.use(authenticate);

// Student swap endpoints
router.post(
  "/check",
  authorizeRoles(UserRole.STUDENT),
  validateBody(checkSwapSchema),
  swapController.checkSwap,
);
router.post(
  "/",
  authorizeRoles(UserRole.STUDENT),
  validateBody(createSwapRequestSchema),
  swapController.createSwap,
);

router.get(
  "/open",
  authorizeRoles(UserRole.STUDENT),
  swapController.getOpenSwaps,
);
router.get("/me", authorizeRoles(UserRole.STUDENT), swapController.getMySwaps);
router.get(
  "/history",
  authorizeRoles(UserRole.STUDENT),
  swapController.getSwapHistory,
);
router.get("/:id", swapController.getSwapById);

router.post(
  "/:id/accept",
  authorizeRoles(UserRole.STUDENT),
  swapController.acceptSwap,
);
router.post(
  "/:id/cancel",
  authorizeRoles(UserRole.STUDENT),
  swapController.cancelSwap,
);

export default router;
