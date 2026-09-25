import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import * as studentService from "./../services/student.service";
import { sendResponse } from "./../utils/apiResponse";

export const getMyTimetable = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await studentService.getStudentTimetable(
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

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    return sendResponse(res, 200, {
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};
