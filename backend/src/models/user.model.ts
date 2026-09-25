import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "./../constants/roles";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  collegeId?: string;
  enrollmentNumber?: string;
  employeeId?: string;
  departmentId?: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  semesterId?: mongoose.Types.ObjectId;
  batch?: string;
  isActive: boolean;
  emailVerified: boolean;
  avatar?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.STUDENT,
    },
    collegeId: { type: String, trim: true },
    enrollmentNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
    },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    programId: { type: Schema.Types.ObjectId, ref: "Program" },
    semesterId: { type: Schema.Types.ObjectId, ref: "Semester" },
    batch: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: true },
    avatar: { type: String, trim: true },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", UserSchema);
