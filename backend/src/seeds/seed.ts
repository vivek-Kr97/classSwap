import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "./../config/env";
import {
  DayOfWeek,
  EnrollmentStatus,
  SlotType,
  UserRole,
} from "./../constants/roles";
import { NotificationType, SwapRequestStatus } from "./../constants/swapStatus";
import { AuditLog } from "./../models/auditLog.model";
import { Course } from "./../models/course.model";
import { Department } from "./../models/department.model";
import { Enrollment } from "./../models/enrollment.model";
import { Notification } from "./../models/notification.model";
import { Program } from "./../models/program.model";
import { Semester } from "./../models/semester.model";
import { Slot } from "./../models/slot.model";
import { SwapRequest } from "./../models/swapRequest.model";
import { SwapRule } from "./../models/swapRule.model";
import { IUser, User } from "./../models/user.model";

export const seedDatabase = async () => {
  console.log("[Seed] Starting ClassSwap database seeding...");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGODB_URI);
  }

  // Clear existing collections
  await User.deleteMany({});
  await Department.deleteMany({});
  await Program.deleteMany({});
  await Semester.deleteMany({});
  await Course.deleteMany({});
  await Slot.deleteMany({});
  await Enrollment.deleteMany({});
  await SwapRule.deleteMany({});
  await SwapRequest.deleteMany({});
  await Notification.deleteMany({});
  await AuditLog.deleteMany({});

  console.log("[Seed] Cleared existing database collections");

  const saltRounds = 10;
  const defaultPasswordHash = await bcrypt.hash("Password123!", saltRounds);

  // 1. Create Department
  const department = await Department.create({
    name: "Computer Science",
    code: "CSE",
    description: "Department of Computer Science & Engineering",
    isActive: true,
  });

  // 2. Create Program
  const program = await Program.create({
    name: "MCA",
    code: "MCA",
    departmentId: department._id,
    durationSemesters: 4,
    isActive: true,
  });

  // 3. Create Semester
  const semester = await Semester.create({
    name: "MCA Semester 3",
    number: 3,
    academicYear: "2026-2027",
    programId: program._id,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    isActive: true,
  });

  // 4. Create Admin User
  const admin = await User.create({
    fullName: "Admin User",
    email: "admin@univ.edu",
    passwordHash: defaultPasswordHash,
    role: UserRole.ADMIN,
    employeeId: "ADM001",
    collegeId: "ADM001",
    departmentId: department._id,
    isActive: true,
    emailVerified: true,
  });

  // 5. Create Faculty User (Dr. Mehta)
  const drMehta = await User.create({
    fullName: "Dr. Mehta",
    email: "dr.mehta@univ.edu",
    passwordHash: defaultPasswordHash,
    role: UserRole.FACULTY,
    employeeId: "FAC001",
    collegeId: "FAC001",
    departmentId: department._id,
    isActive: true,
    emailVerified: true,
  });

  // 6. Create Courses
  const dbmsCourse = await Course.create({
    code: "CS301",
    name: "DBMS",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    credits: 4,
    hasLecture: true,
    hasLab: false,
    facultyIds: [drMehta._id],
    isActive: true,
  });

  const networksLabCourse = await Course.create({
    code: "CS302L",
    name: "Networks Lab",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    credits: 2,
    hasLecture: false,
    hasLab: true,
    facultyIds: [drMehta._id],
    isActive: true,
  });

  const javaCourse = await Course.create({
    code: "CS303",
    name: "Java Programming",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    credits: 4,
    hasLecture: true,
    hasLab: false,
    facultyIds: [drMehta._id],
    isActive: true,
  });

  const webTechLabCourse = await Course.create({
    code: "CS304L",
    name: "Web Technology Lab",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    credits: 2,
    hasLecture: false,
    hasLab: true,
    facultyIds: [drMehta._id],
    isActive: true,
  });

  // 7. Create Class & Lab Slots
  const dbmsSlot = await Slot.create({
    courseId: dbmsCourse._id,
    semesterId: semester._id,
    type: SlotType.LECTURE,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: "10:00",
    endTime: "11:00",
    room: "Lab 201",
    capacity: 60,
    facultyId: drMehta._id,
    swappable: false,
    isActive: true,
  });

  const javaSlot = await Slot.create({
    courseId: javaCourse._id,
    semesterId: semester._id,
    type: SlotType.LECTURE,
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: "10:00",
    endTime: "11:00",
    room: "Hall B",
    capacity: 60,
    facultyId: drMehta._id,
    swappable: false,
    isActive: true,
  });

  // Networks Lab Batch A (Monday 14:00 - 16:00)
  const networksLabBatchA = await Slot.create({
    courseId: networksLabCourse._id,
    semesterId: semester._id,
    type: SlotType.LAB,
    batch: "Batch A",
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: "14:00",
    endTime: "16:00",
    room: "Network Lab 1",
    capacity: 30,
    facultyId: drMehta._id,
    swappable: true,
    isActive: true,
  });

  // Networks Lab Batch B (Wednesday 10:00 - 12:00)
  const networksLabBatchB = await Slot.create({
    courseId: networksLabCourse._id,
    semesterId: semester._id,
    type: SlotType.LAB,
    batch: "Batch B",
    dayOfWeek: DayOfWeek.WEDNESDAY,
    startTime: "10:00",
    endTime: "12:00",
    room: "Network Lab 2",
    capacity: 30,
    facultyId: drMehta._id,
    swappable: true,
    isActive: true,
  });

  // Web Tech Lab Batch A
  const webTechLabBatchA = await Slot.create({
    courseId: webTechLabCourse._id,
    semesterId: semester._id,
    type: SlotType.LAB,
    batch: "Batch A",
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "14:00",
    endTime: "16:00",
    room: "Web Tech Lab",
    capacity: 30,
    facultyId: drMehta._id,
    swappable: true,
    isActive: true,
  });

  // Web Tech Lab Batch B
  const webTechLabBatchB = await Slot.create({
    courseId: webTechLabCourse._id,
    semesterId: semester._id,
    type: SlotType.LAB,
    batch: "Batch B",
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "14:00",
    endTime: "16:00",
    room: "Web Tech Lab",
    capacity: 30,
    facultyId: drMehta._id,
    swappable: true,
    isActive: true,
  });

  // 8. Create Students
  const ravi = await User.create({
    fullName: "Ravi Kumar",
    email: "ravi.k@univ.edu",
    passwordHash: defaultPasswordHash,
    role: UserRole.STUDENT,
    enrollmentNumber: "STU001",
    collegeId: "STU001",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    batch: "Batch A",
    isActive: true,
    emailVerified: true,
  });

  const priya = await User.create({
    fullName: "Priya Sharma",
    email: "priya.s@univ.edu",
    passwordHash: defaultPasswordHash,
    role: UserRole.STUDENT,
    enrollmentNumber: "STU002",
    collegeId: "STU002",
    departmentId: department._id,
    programId: program._id,
    semesterId: semester._id,
    batch: "Batch B",
    isActive: true,
    emailVerified: true,
  });

  // Create additional demo students (13 more students to total 15)
  const additionalStudents: IUser[] = [];
  for (let i = 3; i <= 15; i++) {
    const num = i < 10 ? `00${i}` : `0${i}`;
    const student = await User.create({
      fullName: `Student ${i}`,
      email: `student${i}@univ.edu`,
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      enrollmentNumber: `STU${num}`,
      collegeId: `STU${num}`,
      departmentId: department._id,
      programId: program._id,
      semesterId: semester._id,
      batch: i % 2 === 0 ? "Batch A" : "Batch B",
      isActive: true,
      emailVerified: true,
    });
    additionalStudents.push(student);
  }

  // 9. Enrollments for Ravi (Student 1 - Batch A)
  await Enrollment.create([
    {
      studentId: ravi._id,
      courseId: dbmsCourse._id,
      slotId: dbmsSlot._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: ravi._id,
      courseId: networksLabCourse._id,
      slotId: networksLabBatchA._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: ravi._id,
      courseId: javaCourse._id,
      slotId: javaSlot._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: ravi._id,
      courseId: webTechLabCourse._id,
      slotId: webTechLabBatchA._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
  ]);

  // 10. Enrollments for Priya (Student 2 - Batch B)
  await Enrollment.create([
    {
      studentId: priya._id,
      courseId: dbmsCourse._id,
      slotId: dbmsSlot._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: priya._id,
      courseId: networksLabCourse._id,
      slotId: networksLabBatchB._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: priya._id,
      courseId: javaCourse._id,
      slotId: javaSlot._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
    {
      studentId: priya._id,
      courseId: webTechLabCourse._id,
      slotId: webTechLabBatchB._id,
      semesterId: semester._id,
      status: EnrollmentStatus.ACTIVE,
    },
  ]);

  // Enroll additional students in slots
  for (const s of additionalStudents) {
    const isBatchA = s.batch === "Batch A";
    await Enrollment.create([
      {
        studentId: s._id,
        courseId: dbmsCourse._id,
        slotId: dbmsSlot._id,
        semesterId: semester._id,
        status: EnrollmentStatus.ACTIVE,
      },
      {
        studentId: s._id,
        courseId: networksLabCourse._id,
        slotId: isBatchA ? networksLabBatchA._id : networksLabBatchB._id,
        semesterId: semester._id,
        status: EnrollmentStatus.ACTIVE,
      },
      {
        studentId: s._id,
        courseId: javaCourse._id,
        slotId: javaSlot._id,
        semesterId: semester._id,
        status: EnrollmentStatus.ACTIVE,
      },
    ]);
  }

  // 11. Create Default Swap Rule
  await SwapRule.create({
    programId: program._id,
    semesterId: semester._id,
    maxSwapsPerStudent: 2,
    swapWindowStart: new Date("2026-01-01"),
    swapWindowEnd: new Date("2026-12-31"),
    sameCourseOnly: true,
    sameProgramOnly: true,
    capacityCheckEnabled: true,
    clashCheckEnabled: true,
    requireFacultyApproval: true,
    isActive: true,
  });

  // 12. Create Sample Swap Requests (OPEN, PENDING_APPROVAL, APPROVED)
  const defaultRuleChecks = [
    { code: "SAME_COURSE", name: "Same Course Check", passed: true, message: "Both slots belong to Networks Lab" },
    { code: "TIME_CLASH", name: "Timetable Clash Check", passed: true, message: "No schedule conflicts detected" },
    { code: "MAX_SWAPS", name: "Swap Quota Check", passed: true, message: "Student has not exceeded annual swap limit" },
    { code: "FACULTY_REQ", name: "Faculty Approval Check", passed: true, message: "Requires faculty review" },
  ];

  // Open Swap Request created by Priya (Student 2 - Batch B wanting Batch A)
  const openSwap = await SwapRequest.create({
    requesterId: priya._id,
    courseId: networksLabCourse._id,
    currentSlotId: networksLabBatchB._id,
    desiredSlotId: networksLabBatchA._id,
    reason: "Schedule conflict with internship training on Wednesday morning",
    status: SwapRequestStatus.OPEN,
    requesterChecks: defaultRuleChecks,
  });

  // Pending Approval Swap Request (Student 3 matched with Ravi for Web Tech Lab)
  const student3 = additionalStudents[0]; // Student 3 (Batch B)
  const pendingSwap = await SwapRequest.create({
    requesterId: student3._id,
    matchedStudentId: ravi._id,
    courseId: webTechLabCourse._id,
    currentSlotId: webTechLabBatchB._id,
    desiredSlotId: webTechLabBatchA._id,
    reason: "Medical treatment appointment scheduled on Thursday afternoon",
    status: SwapRequestStatus.PENDING_APPROVAL,
    facultyId: drMehta._id,
    requesterChecks: defaultRuleChecks,
    matchedStudentChecks: defaultRuleChecks,
    matchedAt: new Date(),
  });

  // Approved Swap Request (Student 4 and Student 5)
  const student4 = additionalStudents[1];
  const student5 = additionalStudents[2];
  await SwapRequest.create({
    requesterId: student4._id,
    matchedStudentId: student5._id,
    courseId: networksLabCourse._id,
    currentSlotId: networksLabBatchA._id,
    desiredSlotId: networksLabBatchB._id,
    reason: "Transportation arrangements",
    status: SwapRequestStatus.APPROVED,
    facultyId: drMehta._id,
    facultyComment: "Approved after verifying lab capacity and timetable clearance.",
    approvedAt: new Date(Date.now() - 86400000),
    requesterChecks: defaultRuleChecks,
    matchedStudentChecks: defaultRuleChecks,
  });

  // 13. Create Sample Notifications
  await Notification.create([
    {
      userId: ravi._id,
      type: NotificationType.SWAP_MATCHED,
      title: "Swap Request Matched!",
      message: `${student3.fullName} matched your Web Technology Lab swap request. Sent to Dr. Mehta for approval.`,
      swapRequestId: pendingSwap._id,
      read: false,
    },
    {
      userId: priya._id,
      type: NotificationType.SWAP_CREATED,
      title: "Swap Request Created",
      message: "Your request for Networks Lab (Wednesday 10:00 - 12:00 -> Monday 14:00 - 16:00) is now open for matching.",
      swapRequestId: openSwap._id,
      read: false,
    },
    {
      userId: drMehta._id,
      type: NotificationType.SWAP_PENDING_APPROVAL,
      title: "New Swap Approval Pending",
      message: `${student3.fullName} and ${ravi.fullName} have requested a swap for Web Technology Lab.`,
      swapRequestId: pendingSwap._id,
      read: false,
    },
  ]);

  // 14. Create Initial Audit Logs
  await AuditLog.create([
    {
      actorId: admin._id,
      actorName: "Admin User",
      actorRole: "ADMIN",
      action: "SYSTEM_INITIALIZED",
      details: "Seeded initial academic structure, users, slots and sample swap requests",
    },
    {
      actorId: priya._id,
      actorName: "Priya Sharma",
      actorRole: "STUDENT",
      action: "SWAP_CREATED",
      details: "Created swap request for Networks Lab (Batch B -> Batch A)",
    },
    {
      actorId: student3._id,
      actorName: student3.fullName,
      actorRole: "STUDENT",
      action: "SWAP_ACCEPTED",
      details: `Accepted swap request with ${ravi.fullName} for Web Technology Lab`,
    },
  ]);

  console.log("[Seed] Database seeding completed successfully!");
  console.log("[Seed] Accounts created:");
  console.log(` - Admin:   admin@univ.edu    / Password123!`);
  console.log(` - Faculty: dr.mehta@univ.edu / Password123!`);
  console.log(
    ` - Student: ravi.k@univ.edu   / Password123! (Ravi Kumar - STU001)`,
  );
  console.log(
    ` - Student: priya.s@univ.edu  / Password123! (Priya Sharma - STU002)`,
  );
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Seed] Error seeding database:", err);
      process.exit(1);
    });
}
