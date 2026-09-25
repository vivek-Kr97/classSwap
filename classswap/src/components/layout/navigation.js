import {
  ArrowLeftRight,
  BookOpen,
  Bell,
  CalendarDays,
  ClipboardCheck,
  History,
  LayoutDashboard,
  PlusCircle,
  ScrollText,
  Shield,
} from "lucide-react";

export const NAV_BY_ROLE = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/student/timetable", label: "My Timetable", icon: CalendarDays },
    { to: "/student/swaps", label: "Swap Requests", icon: ArrowLeftRight, exact: true },
    { to: "/student/swaps/create", label: "Create Request", icon: PlusCircle },
    { to: "/student/history", label: "History", icon: History },
    { to: "/student/notifications", label: "Notifications", icon: Bell },
  ],
  faculty: [
    { to: "/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/faculty/approvals", label: "Pending Approvals", icon: ClipboardCheck },
    { to: "/faculty/courses", label: "Courses", icon: BookOpen },
    { to: "/faculty/history", label: "History", icon: History },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/rules", label: "Rules", icon: Shield },
    { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
  ],
};

export const ROLE_LABEL = {
  student: "Student",
  faculty: "Faculty",
  admin: "Admin",
};

export const homeFor = (role) => `/${role}`;
