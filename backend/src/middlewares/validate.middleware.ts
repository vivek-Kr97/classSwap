import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ApiError } from "./../utils/apiError";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(
          ApiError.unprocessable(
            "Validation failed",
            "VALIDATION_ERROR",
            formattedErrors,
          ),
        );
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as any;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(
          ApiError.unprocessable(
            "Query validation failed",
            "VALIDATION_ERROR",
            formattedErrors,
          ),
        );
      }
      next(error);
    }
  };
};
