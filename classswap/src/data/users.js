export const USERS = {
  student1: {
    id: "u-stu-001",
    name: "Ravi Kumar",
    role: "student",
    studentId: "STU001",
    program: "MCA",
    semester: 3,
    batch: "A",
    email: "ravi.kumar@university.edu",
  },
  student2: {
    id: "u-stu-002",
    name: "Priya Sharma",
    role: "student",
    studentId: "STU002",
    program: "MCA",
    semester: 3,
    batch: "B",
    email: "priya.sharma@university.edu",
  },
  faculty: {
    id: "u-fac-001",
    name: "Dr. Mehta",
    role: "faculty",
    facultyId: "FAC001",
    courses: ["DBMS", "Networks", "Java", "Web Technology"],
    email: "mehta@university.edu",
  },
  admin: {
    id: "u-adm-001",
    name: "Admin User",
    role: "admin",
    adminId: "ADM001",
    email: "admin@university.edu",
  },
};

export const USER_LIST = Object.values(USERS);

export const findUserById = (id) => USER_LIST.find((u) => u.id === id) || null;
