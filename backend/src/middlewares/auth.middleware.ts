import { NextFunction, Request, Response } from "express";

import { UserRole } from "./../constants/roles";
import { IUser, User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";
import { verifyAccessToken } from "./../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token is missing or invalid");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("User not found or inactive");
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("User is not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user.role}' is not authorized to access this resource`,
        ),
      );
    }

    next();
  };
};
