import mongoose, { Document, Schema } from "mongoose";
import { EnrollmentStatus } from "./../constants/roles";

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  semesterId: mongoose.Types.ObjectId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      index: true,
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      required: true,
      default: EnrollmentStatus.ACTIVE,
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

EnrollmentSchema.index(
  { studentId: 1, courseId: 1, slotId: 1 },
  { unique: true },
);
EnrollmentSchema.index({ studentId: 1, status: 1 });
EnrollmentSchema.index({ slotId: 1, status: 1 });

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  EnrollmentSchema,
);
