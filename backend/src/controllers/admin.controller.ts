import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./../middlewares/auth.middleware";
import { Course } from "./../models/course.model";
import { Department } from "./../models/department.model";
import { Program } from "./../models/program.model";
import { Semester } from "./../models/semester.model";
import { Slot } from "./../models/slot.model";
import { SwapRequest } from "./../models/swapRequest.model";
import * as adminService from "./../services/admin.service";
import { sendResponse } from "./../utils/apiResponse";

export const getDashboardStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await adminService.getAdminDashboardStats();
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await adminService.getAuditLogs(req.query as any);
    return sendResponse(res, 200, {
      success: true,
      data: result.logs,
      meta: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSwaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const swaps = await SwapRequest.find(filter)
      .populate("requesterId", "fullName enrollmentNumber batch")
      .populate("matchedStudentId", "fullName enrollmentNumber batch")
      .populate("courseId", "name code")
      .populate("facultyId", "fullName email")
      .populate("currentSlotId")
      .populate("desiredSlotId")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, { success: true, data: swaps });
  } catch (error) {
    next(error);
  }
};

// Departments
export const createDepartment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dept = await Department.create(req.body);
    return sendResponse(res, 201, { success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, { success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendResponse(res, 200, {
      success: true,
      message: "Department deactivated",
    });
  } catch (error) {
    next(error);
  }
};

// Programs
export const createProgram = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prog = await Program.create(req.body);
    return sendResponse(res, 201, { success: true, data: prog });
  } catch (error) {
    next(error);
  }
};

export const updateProgram = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prog = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, { success: true, data: prog });
  } catch (error) {
    next(error);
  }
};

export const deleteProgram = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Program.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendResponse(res, 200, {
      success: true,
      message: "Program deactivated",
    });
  } catch (error) {
    next(error);
  }
};

// Semesters
export const createSemester = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sem = await Semester.create(req.body);
    return sendResponse(res, 201, { success: true, data: sem });
  } catch (error) {
    next(error);
  }
};

export const updateSemester = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sem = await Semester.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, { success: true, data: sem });
  } catch (error) {
    next(error);
  }
};

// Courses
export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = { ...req.body };
    if (!payload.departmentId) {
      const dept = await Department.findOne({ isActive: true });
      if (dept) payload.departmentId = dept._id.toString();
    }
    if (!payload.programId) {
      const prog = await Program.findOne({ isActive: true });
      if (prog) payload.programId = prog._id.toString();
    }
    if (!payload.semesterId) {
      const sem = await Semester.findOne({ isActive: true });
      if (sem) payload.semesterId = sem._id.toString();
    }

    const course = await Course.create(payload);
    return sendResponse(res, 201, { success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, { success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendResponse(res, 200, {
      success: true,
      message: "Course deactivated",
    });
  } catch (error) {
    next(error);
  }
};

export const assignFacultyToCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { facultyIds } = req.body;
    const course = await adminService.assignFacultyToCourse(
      req.params.courseId,
      facultyIds,
      req.user,
    );
    return sendResponse(res, 200, { success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// Slots
export const createSlot = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = { ...req.body };
    if (!payload.semesterId && payload.courseId) {
      const course = await Course.findById(payload.courseId);
      if (course && course.semesterId) {
        payload.semesterId = course.semesterId.toString();
      }
    }
    if (!payload.semesterId) {
      const sem = await Semester.findOne({ isActive: true });
      if (sem) payload.semesterId = sem._id.toString();
    }

    const slot = await Slot.create(payload);
    return sendResponse(res, 201, { success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, { success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Slot.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendResponse(res, 200, {
      success: true,
      message: "Slot deactivated",
    });
  } catch (error) {
    next(error);
  }
};

// Enrollments
export const createEnrollment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const enrollment = await adminService.createEnrollment(req.body);
    return sendResponse(res, 201, { success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateEnrollments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await adminService.bulkCreateEnrollments(req.body.enrollments);
    return sendResponse(res, 201, { success: true, data });
  } catch (error) {
    next(error);
  }
};

// Swap rules
export const getSwapRules = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await adminService.getSwapRules();
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSwapRule = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rule = await adminService.createSwapRule(req.body, req.user);
    return sendResponse(res, 201, { success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

export const updateSwapRule = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rule = await adminService.updateSwapRule(
      req.params.id,
      req.body,
      req.user,
    );
    return sendResponse(res, 200, { success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// Admin student inspection
export const getStudentTimetableForAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await adminService.getStudentTimetableForAdmin(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const checkStudentSlotConflict = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slotId } = req.body;
    const data = await adminService.checkStudentSlotConflict(
      req.params.id,
      slotId,
    );
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};
