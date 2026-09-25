import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import * as facultyService from "./../services/faculty.service";
import { sendResponse } from "./../utils/apiResponse";

export const getPendingSwaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await facultyService.getPendingFacultySwaps(
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

export const getFacultySwapHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await facultyService.getFacultySwapHistory(
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

export const getFacultySwapById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await facultyService.getFacultySwapById(
      req.params.id,
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

export const approveSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { comment } = req.body;
    const result = await facultyService.approveSwapRequest(
      req.params.id,
      req.user!._id.toString(),
      comment,
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Swap request approved and timetables updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectSwap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { comment } = req.body;
    const result = await facultyService.rejectSwapRequest(
      req.params.id,
      req.user!._id.toString(),
      comment,
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Swap request rejected",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
