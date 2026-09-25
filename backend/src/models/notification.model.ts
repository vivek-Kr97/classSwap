import mongoose, { Document, Schema } from "mongoose";
import { NotificationType } from "./../constants/swapStatus";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  swapRequestId?: mongoose.Types.ObjectId;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    swapRequestId: {
      type: Schema.Types.ObjectId,
      ref: "SwapRequest",
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
