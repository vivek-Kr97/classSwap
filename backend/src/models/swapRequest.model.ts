import mongoose, { Document, Schema } from "mongoose";
import { SwapRequestStatus } from "./../constants/swapStatus";

export interface IRuleCheckItem {
  code: string;
  name: string;
  passed: boolean;
  message: string;
}

export interface ISwapRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  matchedStudentId?: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  currentSlotId: mongoose.Types.ObjectId;
  desiredSlotId: mongoose.Types.ObjectId;
  reason: string;
  status: SwapRequestStatus;
  requesterChecks: IRuleCheckItem[];
  matchedStudentChecks: IRuleCheckItem[];
  facultyId?: mongoose.Types.ObjectId;
  facultyComment?: string;
  rejectionReason?: string;
  matchedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  cancelledAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RuleCheckItemSchema = new Schema<IRuleCheckItem>(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    passed: { type: Boolean, required: true },
    message: { type: String, required: true },
  },
  { _id: false },
);

const SwapRequestSchema = new Schema<ISwapRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matchedStudentId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    currentSlotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      index: true,
    },
    desiredSlotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      index: true,
    },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(SwapRequestStatus),
      required: true,
      default: SwapRequestStatus.OPEN,
      index: true,
    },
    requesterChecks: [RuleCheckItemSchema],
    matchedStudentChecks: [RuleCheckItemSchema],
    facultyId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    facultyComment: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    matchedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    cancelledAt: { type: Date },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

SwapRequestSchema.index({ requesterId: 1, status: 1 });
SwapRequestSchema.index({ courseId: 1, status: 1 });
SwapRequestSchema.index({ createdAt: -1 });

export const SwapRequest = mongoose.model<ISwapRequest>(
  "SwapRequest",
  SwapRequestSchema,
);
