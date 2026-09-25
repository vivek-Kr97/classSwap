import { NextFunction, Request, Response } from "express";
import { sendResponse } from "./../utils/apiResponse";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let code = err.code || "INTERNAL_ERROR";
  let errors = err.errors || undefined;

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}`;
    code = "DUPLICATE_KEY";
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = "INVALID_ID";
  }

  return sendResponse(res, statusCode, {
    success: false,
    message,
    code,
    errors,
  });
};
