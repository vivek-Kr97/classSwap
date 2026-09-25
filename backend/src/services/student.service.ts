import { EnrollmentStatus } from "./../constants/roles";
import { Enrollment } from "./../models/enrollment.model";
import { User } from "./../models/user.model";
import { ApiError } from "./../utils/apiError";

export const getStudentTimetable = async (studentId: string) => {
  const student = await User.findById(studentId)
    .populate("programId", "name code")
    .populate("semesterId", "name number");

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  const enrollments = await Enrollment.find({
    studentId,
    status: EnrollmentStatus.ACTIVE,
  })
    .populate({
      path: "slotId",
      populate: { path: "facultyId", select: "fullName email" },
    })
    .populate("courseId", "name code hasLecture hasLab");

  const formattedTimetable = enrollments
    .filter((e) => e.slotId && (e.slotId as any).isActive)
    .map((e) => {
      const slot = e.slotId as any;
      const course = e.courseId as any;
      const faculty = slot.facultyId as any;

      return {
        enrollmentId: e._id.toString(),
        slotId: slot._id.toString(),
        courseId: course ? course._id.toString() : slot.courseId?.toString(),
        course: course ? course.name : "Unknown Course",
        code: course ? course.code : "",
        type: slot.type === "LAB" ? "Lab" : "Lecture",
        day: slot.dayOfWeek
          ? slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()
          : "",
        dayOfWeek: slot.dayOfWeek,
        time: `${slot.startTime} - ${slot.endTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        batch: slot.batch || "",
        room: slot.room,
        faculty: faculty ? faculty.fullName : "Faculty Member",
        swappable: slot.swappable !== false,
      };
    });

  return {
    student: {
      id: student._id.toString(),
      fullName: student.fullName,
      enrollmentNumber: student.enrollmentNumber,
      email: student.email,
      program: student.programId ? (student.programId as any).name : "MCA",
      semester: student.semesterId ? (student.semesterId as any).number : 3,
      batch: student.batch || "Batch A",
    },
    timetable: formattedTimetable,
  };
};
