import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import * as authService from "./../services/auth.service";
import { sendResponse } from "./../utils/apiResponse";

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.registerStudent(req.body);
    return sendResponse(res, 201, {
      success: true,
      message: "Student registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendResponse(res, 200, {
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getCurrentUser(req.user!._id.toString());
    return sendResponse(res, 200, {
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return sendResponse(res, 200, {
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  return sendResponse(res, 200, {
    success: true,
    message: "Logged out successfully",
  });
};
