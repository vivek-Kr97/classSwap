import { Course } from "./../models/course.model";
import { Department } from "./../models/department.model";
import { Program } from "./../models/program.model";
import { Semester } from "./../models/semester.model";
import { Slot } from "./../models/slot.model";
import { ApiError } from "./../utils/apiError";

export const getDepartments = async () => {
  return Department.find({ isActive: true }).sort({ name: 1 });
};

export const getDepartmentById = async (id: string) => {
  const dept = await Department.findById(id);
  if (!dept) throw ApiError.notFound("Department not found");
  return dept;
};

export const getPrograms = async (departmentId?: string) => {
  const filter: any = { isActive: true };
  if (departmentId) filter.departmentId = departmentId;
  return Program.find(filter)
    .populate("departmentId", "name code")
    .sort({ name: 1 });
};

export const getProgramById = async (id: string) => {
  const prog = await Program.findById(id).populate("departmentId", "name code");
  if (!prog) throw ApiError.notFound("Program not found");
  return prog;
};

export const getSemesters = async (programId?: string) => {
  const filter: any = { isActive: true };
  if (programId) filter.programId = programId;
  return Semester.find(filter)
    .populate("programId", "name code")
    .sort({ number: 1 });
};

export const getSemesterById = async (id: string) => {
  const sem = await Semester.findById(id).populate("programId", "name code");
  if (!sem) throw ApiError.notFound("Semester not found");
  return sem;
};

export const getCourses = async (query: {
  departmentId?: string;
  programId?: string;
  semesterId?: string;
  facultyId?: string;
}) => {
  const filter: any = { isActive: true };
  if (query.departmentId) filter.departmentId = query.departmentId;
  if (query.programId) filter.programId = query.programId;
  if (query.semesterId) filter.semesterId = query.semesterId;
  if (query.facultyId) filter.facultyIds = query.facultyId;

  return Course.find(filter)
    .populate("departmentId", "name code")
    .populate("programId", "name code")
    .populate("semesterId", "name number")
    .populate("facultyIds", "fullName email employeeId")
    .sort({ code: 1 });
};

export const getCourseById = async (id: string) => {
  const course = await Course.findById(id)
    .populate("departmentId", "name code")
    .populate("programId", "name code")
    .populate("semesterId", "name number")
    .populate("facultyIds", "fullName email employeeId");
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

export const getSlotsByCourse = async (courseId: string) => {
  const slots = await Slot.find({ courseId, isActive: true })
    .populate("facultyId", "fullName email")
    .sort({ dayOfWeek: 1, startTime: 1 });
  return slots;
};

export const getSlots = async (query: {
  courseId?: string;
  semesterId?: string;
  type?: string;
}) => {
  const filter: any = { isActive: true };
  if (query.courseId) filter.courseId = query.courseId;
  if (query.semesterId) filter.semesterId = query.semesterId;
  if (query.type) filter.type = query.type;

  return Slot.find(filter)
    .populate({
      path: "courseId",
      select: "name code credits departmentId",
    })
    .populate("facultyId", "fullName email")
    .sort({ dayOfWeek: 1, startTime: 1 });
};

export const getSlotById = async (id: string) => {
  const slot = await Slot.findById(id)
    .populate("courseId", "name code")
    .populate("facultyId", "fullName email");
  if (!slot) throw ApiError.notFound("Slot not found");
  return slot;
};
