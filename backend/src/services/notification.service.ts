import mongoose from "mongoose";
import { NotificationType } from "./../constants/swapStatus";
import { Notification } from "./../models/notification.model";

export interface CreateNotificationParams {
  userId: string | mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  swapRequestId?: string | mongoose.Types.ObjectId;
}

export const createNotification = async (params: CreateNotificationParams) => {
  try {
    await Notification.create({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      swapRequestId: params.swapRequestId,
    });
  } catch (err: any) {
    console.error("[Notification] Error creating notification:", err.message);
  }
};
