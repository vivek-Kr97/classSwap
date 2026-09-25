import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import { Notification } from "./../models/notification.model";
import { ApiError } from "./../utils/apiError";
import { sendResponse } from "./../utils/apiResponse";

export const getMyNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notifications = await Notification.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendResponse(res, 200, { success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { $set: { read: true, readAt: new Date() } },
      { new: true },
    );
    if (!notification) throw ApiError.notFound("Notification not found");
    return sendResponse(res, 200, { success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Notification.updateMany(
      { userId: req.user!._id, read: false },
      { $set: { read: true, readAt: new Date() } },
    );
    return sendResponse(res, 200, {
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
