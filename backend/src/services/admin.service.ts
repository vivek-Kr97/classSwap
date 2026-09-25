import { EnrollmentStatus, UserRole } from "./../constants/roles";
import { SwapRequestStatus } from "./../constants/swapStatus";
import { AuditLog } from "./../models/auditLog.model";
import { Course } from "./../models/course.model";
import { Enrollment } from "./../models/enrollment.model";
import { ISlot, Slot } from "./../models/slot.model";
import { SwapRequest } from "./../models/swapRequest.model";
import { SwapRule } from "./../models/swapRule.model";
import { User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";
import { logAudit } from "./auditLog.service";
import { getStudentTimetable } from "./student.service";
import { hasTimeOverlap } from "./swapRuleEngine.service";

export const getAdminDashboardStats = async () => {
  const studentsCount = await User.countDocuments({
    role: UserRole.STUDENT,
    isActive: true,
  });
  const facultyCount = await User.countDocuments({
    role: UserRole.FACULTY,
    isActive: true,
  });
  const activeRequests = await SwapRequest.countDocuments({
    status: SwapRequestStatus.OPEN,
  });
  const pendingApprovals = await SwapRequest.countDocuments({
    status: SwapRequestStatus.PENDING_APPROVAL,
  });
  const approvedSwaps = await SwapRequest.countDocuments({
    status: SwapRequestStatus.APPROVED,
  });
  const rejectedSwaps = await SwapRequest.countDocuments({
    status: SwapRequestStatus.REJECTED,
  });

  return {
    students: studentsCount,
    faculty: facultyCount,
    activeRequests,
    pendingApprovals,
    approvedSwaps,
    rejectedSwaps,
  };
};

export const getAuditLogs = async (query: {
  page?: number;
  limit?: number;
  action?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.action) filter.action = query.action;
  if (query.actorId) filter.actorId = query.actorId;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  const total = await AuditLog.countDocuments(filter);
  const logs = await AuditLog.find(filter)
    .populate("actorId", "fullName email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const assignFacultyToCourse = async (
  courseId: string,
  facultyIds: string[],
  adminUser: any,
) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  course.facultyIds = facultyIds as any;
  await course.save();

  await logAudit({
    actor: adminUser,
    action: "FACULTY_ASSIGNED_TO_COURSE",
    entityType: "Course",
    entityId: courseId,
    details: `Assigned ${facultyIds.length} faculty members to course ${course.code}`,
  });

  return course;
};

export const createEnrollment = async (payload: {
  studentId: string;
  courseId: string;
  slotId: string;
  semesterId: string;
}) => {
  const existing = await Enrollment.findOne({
    studentId: payload.studentId,
    courseId: payload.courseId,
    slotId: payload.slotId,
  });

  if (existing) {
    if (existing.status !== EnrollmentStatus.ACTIVE) {
      existing.status = EnrollmentStatus.ACTIVE;
      await existing.save();
      return existing;
    }
    throw ApiError.conflict("Student already enrolled in this slot");
  }

  const enrollment = await Enrollment.create({
    studentId: payload.studentId,
    courseId: payload.courseId,
    slotId: payload.slotId,
    semesterId: payload.semesterId,
    status: EnrollmentStatus.ACTIVE,
  });

  return enrollment;
};

export const bulkCreateEnrollments = async (enrollments: any[]) => {
  const results: any[] = [];
  for (const item of enrollments) {
    try {
      const created = await createEnrollment(item);
      results.push(created);
    } catch (e: any) {
      // skip existing
    }
  }
  return results;
};

export const getSwapRules = async () => {
  return SwapRule.find({ isActive: true })
    .populate("programId", "name code")
    .populate("semesterId", "name number");
};

export const createSwapRule = async (payload: any, adminUser: any) => {
  const rule = await SwapRule.create(payload);
  await logAudit({
    actor: adminUser,
    action: "RULE_UPDATED",
    entityType: "SwapRule",
    entityId: rule._id.toString(),
    details: `Created new swap rule ${rule._id}`,
  });
  return rule;
};

export const updateSwapRule = async (
  id: string,
  payload: any,
  adminUser: any,
) => {
  const rule = await SwapRule.findByIdAndUpdate(id, payload, { new: true });
  if (!rule) throw ApiError.notFound("Swap rule not found");

  await logAudit({
    actor: adminUser,
    action: "RULE_UPDATED",
    entityType: "SwapRule",
    entityId: rule._id.toString(),
    details: `Updated swap rule ${rule._id}`,
  });

  return rule;
};

export const checkStudentSlotConflict = async (
  studentId: string,
  slotId: string,
) => {
  const targetSlot = await Slot.findById(slotId).populate(
    "courseId",
    "name code",
  );
  if (!targetSlot) throw ApiError.notFound("Slot not found");

  const activeEnrollments = await Enrollment.find({
    studentId,
    status: EnrollmentStatus.ACTIVE,
  }).populate({
    path: "slotId",
    populate: { path: "courseId", select: "name code" },
  });

  const conflicts: any[] = [];
  for (const enrollment of activeEnrollments) {
    const existingSlot = enrollment.slotId as any as ISlot;
    if (!existingSlot || existingSlot._id.toString() === slotId) continue;

    if (existingSlot.dayOfWeek === targetSlot.dayOfWeek) {
      if (
        hasTimeOverlap(
          targetSlot.startTime,
          targetSlot.endTime,
          existingSlot.startTime,
          existingSlot.endTime,
        )
      ) {
        const course = existingSlot.courseId as any;
        conflicts.push({
          course: course ? course.name : "Course",
          code: course ? course.code : "",
          day: existingSlot.dayOfWeek,
          startTime: existingSlot.startTime,
          endTime: existingSlot.endTime,
          room: existingSlot.room,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};

export const getStudentTimetableForAdmin = async (studentId: string) => {
  return getStudentTimetable(studentId);
};
