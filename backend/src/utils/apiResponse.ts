import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  errors?: any[];
  meta?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponsePayload<T>
) => {
  return res.status(statusCode).json({
    success: payload.success,
    ...(payload.message && { message: payload.message }),
    ...(payload.code && { code: payload.code }),
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.errors && { errors: payload.errors }),
    ...(payload.meta && { meta: payload.meta }),
  });
};
