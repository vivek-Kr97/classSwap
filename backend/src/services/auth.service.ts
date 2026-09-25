import bcrypt from "bcrypt";
import { UserRole } from "./../constants/roles";
import { Program } from "./../models/program.model";
import { Semester } from "./../models/semester.model";
import { User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./../utils/jwt";
import { logAudit } from "./auditLog.service";

export const registerStudent = async (payload: {
  fullName: string;
  email: string;
  enrollmentNumber: string;
  password: string;
  programId: string;
  semesterId: string;
  batch?: string;
}) => {
  const existingEmail = await User.findOne({
    email: payload.email.toLowerCase(),
  });
  if (existingEmail) {
    throw ApiError.conflict("Email address already registered", "EMAIL_EXISTS");
  }

  const existingEnrollment = await User.findOne({
    enrollmentNumber: payload.enrollmentNumber,
  });
  if (existingEnrollment) {
    throw ApiError.conflict(
      "Enrollment number already registered",
      "ENROLLMENT_EXISTS",
    );
  }

  const program = await Program.findById(payload.programId);
  if (!program || !program.isActive) {
    throw ApiError.notFound("Program not found or inactive");
  }

  const semester = await Semester.findById(payload.semesterId);
  if (!semester || !semester.isActive) {
    throw ApiError.notFound("Semester not found or inactive");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(payload.password, saltRounds);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: UserRole.STUDENT,
    enrollmentNumber: payload.enrollmentNumber,
    departmentId: program.departmentId,
    programId: program._id,
    semesterId: semester._id,
    batch: payload.batch || "Batch A",
    isActive: true,
    emailVerified: true,
  });

  await logAudit({
    actor: user,
    action: "STUDENT_REGISTERED",
    entityType: "User",
    entityId: user._id.toString(),
    details: `Student registered: ${user.fullName} (${user.enrollmentNumber})`,
  });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString(), user.role);

  const userObj = user.toObject();
  delete (userObj as any).passwordHash;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() })
    .select("+passwordHash")
    .populate("departmentId", "name code")
    .populate("programId", "name code")
    .populate("semesterId", "name number academicYear");
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  await logAudit({
    actor: user,
    action: "LOGIN",
    entityType: "User",
    entityId: user._id.toString(),
    details: `User logged in: ${user.fullName} (${user.role})`,
  });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString(), user.role);

  const userObj = user.toObject();
  delete (userObj as any).passwordHash;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token: string) => {
  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Invalid refresh token or inactive user");
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    return { accessToken };
  } catch (error: any) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId)
    .populate("departmentId", "name code")
    .populate("programId", "name code")
    .populate("semesterId", "name number academicYear");

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};
