import { createFileRoute } from "@tanstack/react-router";
import StudentDashboard from "@/pages/student/StudentDashboard";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard · ClassSwap" },
      {
        name: "description",
        content:
          "Today's classes, your active swap request, swap limit usage and recent activity.",
      },
      { property: "og:title", content: "Student Dashboard · ClassSwap" },
      {
        property: "og:description",
        content: "Track class swaps, rule checks and approvals in one place.",
      },
    ],
  }),
  component: StudentDashboard,
});
