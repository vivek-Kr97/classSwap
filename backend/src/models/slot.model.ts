import mongoose, { Document, Schema } from "mongoose";
import { DayOfWeek, SlotType } from "./../constants/roles";

export interface ISlot extends Document {
  courseId: mongoose.Types.ObjectId;
  semesterId: mongoose.Types.ObjectId;
  type: SlotType;
  batch?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "14:00"
  endTime: string; // e.g. "16:00"
  room: string;
  capacity: number;
  facultyId?: mongoose.Types.ObjectId;
  swappable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
      index: true,
    },
    type: { type: String, enum: Object.values(SlotType), required: true },
    batch: { type: String, trim: true },
    dayOfWeek: { type: String, enum: Object.values(DayOfWeek), required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    room: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, default: 30 },
    facultyId: { type: Schema.Types.ObjectId, ref: "User" },
    swappable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

SlotSchema.index({ courseId: 1, type: 1, batch: 1 });

export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
