import { NextFunction, Request, Response } from "express";
import * as academicService from "./../services/academic.service";
import { sendResponse } from "./../utils/apiResponse";

export const getDepartments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getDepartments();
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getDepartmentById(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departmentId = req.query.departmentId as string | undefined;
    const data = await academicService.getPrograms(departmentId);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getProgramById(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSemesters = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const programId = req.query.programId as string | undefined;
    const data = await academicService.getSemesters(programId);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSemesterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getSemesterById(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getCourses(req.query as any);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getCourseById(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourseSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getSlotsByCourse(req.params.courseId);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getSlots(req.query as any);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await academicService.getSlotById(req.params.id);
    return sendResponse(res, 200, { success: true, data });
  } catch (error) {
    next(error);
  }
};
