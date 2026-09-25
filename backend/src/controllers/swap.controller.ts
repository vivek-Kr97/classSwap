import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import * as swapService from "./../services/swap.service";
import { sendResponse } from "./../utils/apiResponse";

export const checkSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentSlotId, desiredSlotId } = req.body;
    const result = await swapService.checkSwap(
      req.user!._id.toString(),
      currentSlotId,
      desiredSlotId,
    );
    return sendResponse(res, 200, {
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await swapService.createSwapRequest(
      req.user!._id.toString(),
      req.body,
    );
    return sendResponse(res, 201, {
      success: true,
      message: "Swap request created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpenSwaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const courseId = req.query.courseId as string | undefined;

    const result = await swapService.getOpenSwaps(req.user!._id.toString(), {
      page,
      limit,
      courseId,
    });

    return sendResponse(res, 200, {
      success: true,
      data: result.swaps,
      meta: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySwaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await swapService.getStudentSwapRequests(
      req.user!._id.toString(),
    );
    return sendResponse(res, 200, {
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSwapHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await swapService.getStudentSwapRequests(
      req.user!._id.toString(),
    );
    return sendResponse(res, 200, {
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSwapById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await swapService.getSwapRequestById(req.params.id);
    return sendResponse(res, 200, {
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await swapService.acceptSwapRequest(
      req.params.id,
      req.user!._id.toString(),
    );
    return sendResponse(res, 200, {
      success: true,
      message:
        "Swap request accepted successfully and sent to faculty for approval",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await swapService.cancelSwapRequest(
      req.params.id,
      req.user!._id.toString(),
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Swap request cancelled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
