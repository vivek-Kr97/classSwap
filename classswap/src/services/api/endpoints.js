export const API_ENDPOINTS = {
  auth: {
    registerStudent: "/auth/register/student",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },

  academic: {
    departments: "/departments",
    programs: "/programs",
    semesters: "/semesters",
    courses: "/courses",
    course: (id) => `/courses/${id}`,
    courseSlots: (id) => `/courses/${id}/slots`,
  },

  student: {
    profile: "/students/me",
    timetable: "/students/me/timetable",
  },

  swaps: {
    check: "/swaps/check",
    create: "/swaps",
    open: "/swaps/open",
    mine: "/swaps/me",
    history: "/swaps/history",
    detail: (id) => `/swaps/${id}`,
    accept: (id) => `/swaps/${id}/accept`,
    cancel: (id) => `/swaps/${id}/cancel`,
  },

  faculty: {
    pending: "/faculty/swaps/pending",
    history: "/faculty/swaps/history",
    detail: (id) => `/faculty/swaps/${id}`,
    approve: (id) => `/faculty/swaps/${id}/approve`,
    reject: (id) => `/faculty/swaps/${id}/reject`,
  },

  admin: {
    dashboard: "/admin/dashboard",
    swaps: "/admin/swaps",
    auditLogs: "/admin/audit-logs",
    swapRules: "/admin/swap-rules",

    departments: "/admin/departments",
    programs: "/admin/programs",
    semesters: "/admin/semesters",
    courses: "/admin/courses",
    slots: "/admin/slots",
    faculty: "/admin/faculty",
    enrollments: "/admin/enrollments",

    studentTimetable: (id) => `/admin/students/${id}/timetable`,
    checkStudentSlot: (id) => `/admin/students/${id}/check-slot`,
  },

  notifications: {
    list: "/notifications",
    read: (id) => `/notifications/${id}/read`,
    readAll: "/notifications/read-all",
  },
};
