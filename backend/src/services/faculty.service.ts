import mongoose from "mongoose";
import { EnrollmentStatus } from "./../constants/roles";
import { NotificationType, SwapRequestStatus } from "./../constants/swapStatus";
import { Course } from "./../models/course.model";
import { Enrollment } from "./../models/enrollment.model";
import { SwapRequest } from "./../models/swapRequest.model";
import { User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";
import { logAudit } from "./auditLog.service";
import { createNotification } from "./notification.service";
import { SwapRuleEngine } from "./swapRuleEngine.service";

export const getFacultyCourses = async (facultyId: string) => {
  return Course.find({ facultyIds: facultyId, isActive: true })
    .populate("departmentId", "name code")
    .populate("programId", "name code")
    .populate("semesterId", "name number");
};

export const getPendingFacultySwaps = async (facultyId: string) => {
  const facultyCourses = await Course.find({ facultyIds: facultyId }).select(
    "_id",
  );
  const courseIds = facultyCourses.map((c) => c._id);

  const swaps = await SwapRequest.find({
    courseId: { $in: courseIds },
    status: SwapRequestStatus.PENDING_APPROVAL,
  })
    .populate("requesterId", "fullName enrollmentNumber batch email programId")
    .populate(
      "matchedStudentId",
      "fullName enrollmentNumber batch email programId",
    )
    .populate("courseId", "name code")
    .populate({
      path: "currentSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .populate({
      path: "desiredSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .sort({ updatedAt: -1 });

  return swaps;
};

export const getFacultySwapHistory = async (facultyId: string) => {
  const facultyCourses = await Course.find({ facultyIds: facultyId }).select(
    "_id",
  );
  const courseIds = facultyCourses.map((c) => c._id);

  const swaps = await SwapRequest.find({
    courseId: { $in: courseIds },
    status: { $in: [SwapRequestStatus.APPROVED, SwapRequestStatus.REJECTED] },
  })
    .populate("requesterId", "fullName enrollmentNumber batch")
    .populate("matchedStudentId", "fullName enrollmentNumber batch")
    .populate("courseId", "name code")
    .populate("facultyId", "fullName email")
    .populate("currentSlotId")
    .populate("desiredSlotId")
    .sort({ updatedAt: -1 });

  return swaps;
};

export const getFacultySwapById = async (swapId: string, facultyId: string) => {
  const swap = await SwapRequest.findById(swapId)
    .populate("requesterId", "fullName enrollmentNumber batch email")
    .populate("matchedStudentId", "fullName enrollmentNumber batch email")
    .populate("courseId", "name code facultyIds")
    .populate("facultyId", "fullName email")
    .populate("currentSlotId")
    .populate("desiredSlotId");

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  const course = swap.courseId as any;
  if (
    !course ||
    !course.facultyIds.some((fId: any) => fId.toString() === facultyId)
  ) {
    throw ApiError.forbidden(
      "You are not authorized to access swap requests for this course",
    );
  }

  return swap;
};

export const approveSwapRequest = async (
  swapId: string,
  facultyId: string,
  comment?: string,
) => {
  const swap = await SwapRequest.findById(swapId);

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  if (swap.status !== SwapRequestStatus.PENDING_APPROVAL) {
    throw ApiError.conflict(
      `Swap request is not pending approval (Current status: ${swap.status})`,
    );
  }

  if (!swap.matchedStudentId) {
    throw ApiError.badRequest(
      "Swap request has no matched student to swap with",
    );
  }

  const course = await Course.findById(swap.courseId);
  if (
    !course ||
    !course.facultyIds.some((fId) => fId.toString() === facultyId)
  ) {
    throw ApiError.forbidden(
      "You can only approve swap requests for courses assigned to you",
    );
  }

  const requesterEnrollment = await Enrollment.findOne({
    studentId: swap.requesterId,
    slotId: swap.currentSlotId,
    status: EnrollmentStatus.ACTIVE,
  });

  if (!requesterEnrollment) {
    throw ApiError.conflict("Requester no longer owns the starting slot");
  }

  const matchedEnrollment = await Enrollment.findOne({
    studentId: swap.matchedStudentId,
    slotId: swap.desiredSlotId,
    status: EnrollmentStatus.ACTIVE,
  });

  if (!matchedEnrollment) {
    throw ApiError.conflict("Matched student no longer owns the target slot");
  }

  const requesterCheck = await SwapRuleEngine.runAllChecks(
    swap.requesterId.toString(),
    swap.currentSlotId.toString(),
    swap.desiredSlotId.toString(),
  );

  const matchedCheck = await SwapRuleEngine.runAllChecks(
    swap.matchedStudentId.toString(),
    swap.desiredSlotId.toString(),
    swap.currentSlotId.toString(),
  );

  if (!requesterCheck.passed || !matchedCheck.passed) {
    throw ApiError.unprocessable(
      "Final validation failed: Timetable conflict or eligibility changed",
      "FINAL_VALIDATION_FAILED",
    );
  }

  const faculty = await User.findById(facultyId);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Enrollment.updateOne(
      { _id: requesterEnrollment._id },
      { $set: { slotId: swap.desiredSlotId } },
      { session },
    );

    await Enrollment.updateOne(
      { _id: matchedEnrollment._id },
      { $set: { slotId: swap.currentSlotId } },
      { session },
    );

    swap.status = SwapRequestStatus.APPROVED;
    swap.approvedAt = new Date();
    swap.facultyId = new mongoose.Types.ObjectId(facultyId);
    if (comment) swap.facultyComment = comment;

    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    requesterEnrollment.slotId = swap.desiredSlotId;
    await requesterEnrollment.save();

    matchedEnrollment.slotId = swap.currentSlotId;
    await matchedEnrollment.save();

    swap.status = SwapRequestStatus.APPROVED;
    swap.approvedAt = new Date();
    swap.facultyId = new mongoose.Types.ObjectId(facultyId);
    if (comment) swap.facultyComment = comment;

    await swap.save();
  }

  await logAudit({
    actor: faculty || undefined,
    action: "SWAP_APPROVED",
    entityType: "SwapRequest",
    entityId: swap._id.toString(),
    details: `Faculty ${faculty?.fullName || facultyId} approved swap request ${swap._id}`,
  });

  await logAudit({
    actorName: "System",
    actorRole: "SYSTEM",
    action: "TIMETABLE_UPDATED",
    entityType: "SwapRequest",
    entityId: swap._id.toString(),
    details: `Exchanged slot enrollments between student ${swap.requesterId} and ${swap.matchedStudentId}`,
  });

  await createNotification({
    userId: swap.requesterId,
    type: NotificationType.SWAP_APPROVED,
    title: "Swap Request Approved!",
    message: `Your class swap request has been approved by faculty. Your timetable has been updated.`,
    swapRequestId: swap._id,
  });

  await createNotification({
    userId: swap.matchedStudentId,
    type: NotificationType.SWAP_APPROVED,
    title: "Swap Approved!",
    message: `The class swap request has been approved by faculty. Your timetable has been updated.`,
    swapRequestId: swap._id,
  });

  return swap;
};

export const rejectSwapRequest = async (
  swapId: string,
  facultyId: string,
  comment?: string,
) => {
  const swap = await SwapRequest.findById(swapId);

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  if (swap.status !== SwapRequestStatus.PENDING_APPROVAL) {
    throw ApiError.conflict(
      `Swap request is not pending approval (Current status: ${swap.status})`,
    );
  }

  const course = await Course.findById(swap.courseId);
  if (
    !course ||
    !course.facultyIds.some((fId) => fId.toString() === facultyId)
  ) {
    throw ApiError.forbidden(
      "You can only reject swap requests for courses assigned to you",
    );
  }

  swap.status = SwapRequestStatus.REJECTED;
  swap.rejectedAt = new Date();
  swap.facultyId = new mongoose.Types.ObjectId(facultyId);
  if (comment) {
    swap.facultyComment = comment;
    swap.rejectionReason = comment;
  }

  await swap.save();

  const faculty = await User.findById(facultyId);

  await logAudit({
    actor: faculty || undefined,
    action: "SWAP_REJECTED",
    entityType: "SwapRequest",
    entityId: swap._id.toString(),
    details: `Faculty ${faculty?.fullName || facultyId} rejected swap request ${swap._id}. Reason: ${comment || "No comment"}`,
  });

  await createNotification({
    userId: swap.requesterId,
    type: NotificationType.SWAP_REJECTED,
    title: "Swap Request Rejected",
    message: `Your class swap request was rejected by faculty. Reason: ${comment || "Policy restriction"}`,
    swapRequestId: swap._id,
  });

  if (swap.matchedStudentId) {
    await createNotification({
      userId: swap.matchedStudentId,
      type: NotificationType.SWAP_REJECTED,
      title: "Swap Request Rejected",
      message: `The class swap request was rejected by faculty. Reason: ${comment || "Policy restriction"}`,
      swapRequestId: swap._id,
    });
  }

  return swap;
};
