import mongoose from "mongoose";
import { EnrollmentStatus } from "./../constants/roles";
import { NotificationType, SwapRequestStatus } from "./../constants/swapStatus";
import { Enrollment } from "./../models/enrollment.model";
import { Slot } from "./../models/slot.model";
import { SwapRequest } from "./../models/swapRequest.model";
import { User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";
import { logAudit } from "./auditLog.service";
import { createNotification } from "./notification.service";
import { SwapRuleEngine } from "./swapRuleEngine.service";

export const checkSwap = async (
  studentId: string,
  currentSlotId: string,
  desiredSlotId: string,
) => {
  return SwapRuleEngine.runAllChecks(studentId, currentSlotId, desiredSlotId);
};

export const createSwapRequest = async (
  studentId: string,
  payload: {
    currentSlotId: string;
    desiredSlotId: string;
    reason: string;
  },
) => {
  const currentSlot = await Slot.findById(payload.currentSlotId);
  if (!currentSlot || !currentSlot.isActive) {
    throw ApiError.notFound("Current slot not found");
  }

  const desiredSlot = await Slot.findById(payload.desiredSlotId);
  if (!desiredSlot || !desiredSlot.isActive) {
    throw ApiError.notFound("Desired slot not found");
  }

  const existingActive = await SwapRequest.findOne({
    requesterId: studentId,
    currentSlotId: payload.currentSlotId,
    status: {
      $in: [
        SwapRequestStatus.OPEN,
        SwapRequestStatus.MATCHED,
        SwapRequestStatus.PENDING_APPROVAL,
      ],
    },
  });

  if (existingActive) {
    throw ApiError.conflict(
      "You already have an active swap request for this slot",
      "DUPLICATE_SWAP_REQUEST",
    );
  }

  const ruleResult = await SwapRuleEngine.runAllChecks(
    studentId,
    payload.currentSlotId,
    payload.desiredSlotId,
  );

  if (!ruleResult.passed) {
    const failedCheck = ruleResult.checks.find((c) => !c.passed);
    throw ApiError.unprocessable(
      failedCheck
        ? failedCheck.message
        : "Swap request failed university rule checks",
      "RULE_CHECK_FAILED",
      ruleResult.checks,
    );
  }

  const student = await User.findById(studentId);

  const swapRequest = await SwapRequest.create({
    requesterId: studentId,
    courseId: currentSlot.courseId,
    currentSlotId: payload.currentSlotId,
    desiredSlotId: payload.desiredSlotId,
    reason: payload.reason,
    status: SwapRequestStatus.OPEN,
    requesterChecks: ruleResult.checks,
  });

  await logAudit({
    actor: student || undefined,
    action: "SWAP_CREATED",
    entityType: "SwapRequest",
    entityId: swapRequest._id.toString(),
    details: `Created swap request ${swapRequest._id} for course ${currentSlot.courseId}`,
  });

  if (student) {
    await createNotification({
      userId: student._id,
      type: NotificationType.SWAP_CREATED,
      title: "Swap Request Created",
      message: `Your swap request for slot ${currentSlot.room} (${currentSlot.dayOfWeek} ${currentSlot.startTime}-${currentSlot.endTime}) has been created successfully.`,
      swapRequestId: swapRequest._id,
    });
  }

  return swapRequest;
};

export const getOpenSwaps = async (
  studentId: string,
  query: { page?: number; limit?: number; courseId?: string },
) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const filter: any = {
    status: SwapRequestStatus.OPEN,
    requesterId: { $ne: new mongoose.Types.ObjectId(studentId) },
  };

  if (query.courseId) {
    filter.courseId = query.courseId;
  }

  const total = await SwapRequest.countDocuments(filter);

  const swaps = await SwapRequest.find(filter)
    .populate("requesterId", "fullName enrollmentNumber batch programId")
    .populate({
      path: "courseId",
      select: "name code",
    })
    .populate({
      path: "currentSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .populate({
      path: "desiredSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const formattedSwaps = swaps.map((swap) => {
    const requester = swap.requesterId as any;
    const currentSlot = swap.currentSlotId as any;
    const desiredSlot = swap.desiredSlotId as any;
    const course = swap.courseId as any;

    return {
      id: swap._id.toString(),
      swapId: swap._id.toString(),
      requesterId: requester ? requester._id.toString() : "",
      requesterName: requester ? requester.fullName : "Student",
      requesterBatch: requester ? requester.batch || "Batch A" : "Batch A",
      requesterSlot: currentSlot
        ? {
            id: currentSlot._id.toString(),
            course: course ? course.name : "",
            code: course ? course.code : "",
            type: currentSlot.type === "LAB" ? "Lab" : "Lecture",
            day: currentSlot.dayOfWeek
              ? currentSlot.dayOfWeek.charAt(0) +
                currentSlot.dayOfWeek.slice(1).toLowerCase()
              : "",
            dayOfWeek: currentSlot.dayOfWeek,
            time: `${currentSlot.startTime} - ${currentSlot.endTime}`,
            startTime: currentSlot.startTime,
            endTime: currentSlot.endTime,
            batch: currentSlot.batch || "",
            room: currentSlot.room,
            faculty: currentSlot.facultyId
              ? currentSlot.facultyId.fullName
              : "Faculty Member",
          }
        : null,
      targetSlot: desiredSlot
        ? {
            id: desiredSlot._id.toString(),
            course: course ? course.name : "",
            code: course ? course.code : "",
            type: desiredSlot.type === "LAB" ? "Lab" : "Lecture",
            day: desiredSlot.dayOfWeek
              ? desiredSlot.dayOfWeek.charAt(0) +
                desiredSlot.dayOfWeek.slice(1).toLowerCase()
              : "",
            dayOfWeek: desiredSlot.dayOfWeek,
            time: `${desiredSlot.startTime} - ${desiredSlot.endTime}`,
            startTime: desiredSlot.startTime,
            endTime: desiredSlot.endTime,
            batch: desiredSlot.batch || "",
            room: desiredSlot.room,
            faculty: desiredSlot.facultyId
              ? desiredSlot.facultyId.fullName
              : "Faculty Member",
          }
        : null,
      reason: swap.reason,
      status: swap.status,
      ruleChecksPassed: swap.requesterChecks
        ? swap.requesterChecks.every((c) => c.passed)
        : true,
      createdAt: swap.createdAt.toISOString(),
      updatedAt: swap.updatedAt.toISOString(),
    };
  });

  return {
    swaps: formattedSwaps,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getStudentSwapRequests = async (studentId: string) => {
  const swaps = await SwapRequest.find({
    $or: [{ requesterId: studentId }, { matchedStudentId: studentId }],
  })
    .populate("requesterId", "fullName enrollmentNumber batch")
    .populate("matchedStudentId", "fullName enrollmentNumber batch")
    .populate("courseId", "name code")
    .populate({
      path: "currentSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .populate({
      path: "desiredSlotId",
      populate: { path: "facultyId", select: "fullName" },
    })
    .sort({ createdAt: -1 });

  return swaps;
};

export const getSwapRequestById = async (id: string) => {
  const swap = await SwapRequest.findById(id)
    .populate("requesterId", "fullName enrollmentNumber batch email")
    .populate("matchedStudentId", "fullName enrollmentNumber batch email")
    .populate("courseId", "name code")
    .populate("facultyId", "fullName email")
    .populate("currentSlotId")
    .populate("desiredSlotId");

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  return swap;
};

export const acceptSwapRequest = async (swapId: string, accepterId: string) => {
  const swap = await SwapRequest.findById(swapId);

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  if (swap.status !== SwapRequestStatus.OPEN) {
    throw ApiError.conflict(
      "Swap request is no longer open for acceptance",
      "SWAP_NOT_OPEN",
    );
  }

  if (swap.requesterId.toString() === accepterId) {
    throw ApiError.badRequest("You cannot accept your own swap request");
  }

  const accepter = await User.findById(accepterId);
  if (!accepter) {
    throw ApiError.notFound("Accepter student account not found");
  }

  const accepterEnrollment = await Enrollment.findOne({
    studentId: accepterId,
    slotId: swap.desiredSlotId,
    status: EnrollmentStatus.ACTIVE,
  });

  if (!accepterEnrollment) {
    throw ApiError.badRequest(
      "You do not own the target slot required for this swap",
    );
  }

  const requesterEnrollment = await Enrollment.findOne({
    studentId: swap.requesterId,
    slotId: swap.currentSlotId,
    status: EnrollmentStatus.ACTIVE,
  });

  if (!requesterEnrollment) {
    throw ApiError.conflict(
      "Requester is no longer enrolled in the original slot",
    );
  }

  const accepterRuleResult = await SwapRuleEngine.runAllChecks(
    accepterId,
    swap.desiredSlotId.toString(),
    swap.currentSlotId.toString(),
  );

  if (!accepterRuleResult.passed) {
    const failedCheck = accepterRuleResult.checks.find((c) => !c.passed);
    throw ApiError.unprocessable(
      `Acceptance failed rule checks: ${failedCheck ? failedCheck.message : "Incompatible timetable"}`,
      "ACCEPTER_RULE_FAILED",
      accepterRuleResult.checks,
    );
  }

  const requesterRuleResult = await SwapRuleEngine.runAllChecks(
    swap.requesterId.toString(),
    swap.currentSlotId.toString(),
    swap.desiredSlotId.toString(),
  );

  if (!requesterRuleResult.passed) {
    throw ApiError.unprocessable(
      "Requester validation failed upon acceptance",
      "REQUESTER_RULE_FAILED",
      requesterRuleResult.checks,
    );
  }

  const updatedSwap = await SwapRequest.findOneAndUpdate(
    { _id: swapId, status: SwapRequestStatus.OPEN },
    {
      $set: {
        matchedStudentId: accepterId,
        matchedStudentChecks: accepterRuleResult.checks,
        matchedAt: new Date(),
        status: SwapRequestStatus.PENDING_APPROVAL,
      },
    },
    { new: true },
  );

  if (!updatedSwap) {
    throw ApiError.conflict(
      "Another student accepted this swap request simultaneously",
      "CONCURRENT_ACCEPTANCE",
    );
  }

  await logAudit({
    actor: accepter,
    action: "SWAP_ACCEPTED",
    entityType: "SwapRequest",
    entityId: updatedSwap._id.toString(),
    details: `Student ${accepter.fullName} accepted swap request ${updatedSwap._id}`,
  });

  await createNotification({
    userId: updatedSwap.requesterId,
    type: NotificationType.SWAP_MATCHED,
    title: "Swap Request Matched!",
    message: `${accepter.fullName} accepted your swap request. Sent to faculty for approval.`,
    swapRequestId: updatedSwap._id,
  });

  await createNotification({
    userId: accepter._id,
    type: NotificationType.SWAP_PENDING_APPROVAL,
    title: "Swap Pending Approval",
    message: `You accepted the swap request. Pending faculty review.`,
    swapRequestId: updatedSwap._id,
  });

  return updatedSwap;
};

export const cancelSwapRequest = async (swapId: string, studentId: string) => {
  const swap = await SwapRequest.findById(swapId);

  if (!swap) {
    throw ApiError.notFound("Swap request not found");
  }

  if (swap.requesterId.toString() !== studentId) {
    throw ApiError.forbidden("You can only cancel your own swap request");
  }

  if (
    swap.status !== SwapRequestStatus.OPEN &&
    swap.status !== SwapRequestStatus.MATCHED
  ) {
    throw ApiError.conflict(
      `Cannot cancel swap request with status ${swap.status}`,
    );
  }

  swap.status = SwapRequestStatus.CANCELLED;
  swap.cancelledAt = new Date();
  await swap.save();

  const student = await User.findById(studentId);

  await logAudit({
    actor: student || undefined,
    action: "SWAP_CANCELLED",
    entityType: "SwapRequest",
    entityId: swap._id.toString(),
    details: `Swap request ${swap._id} cancelled by requester`,
  });

  return swap;
};
