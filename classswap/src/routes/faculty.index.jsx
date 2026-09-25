import { createFileRoute } from "@tanstack/react-router";
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";

export const Route = createFileRoute("/faculty/")({
  head: () => ({
    meta: [
      { title: "Faculty Dashboard · ClassSwap" },
      {
        name: "description",
        content:
          "Pending approvals, decisions made today and swap activity across your courses.",
      },
      { property: "og:title", content: "Faculty Dashboard · ClassSwap" },
      {
        property: "og:description",
        content: "Review matched swap requests with full rule-check visibility.",
      },
    ],
  }),
  component: FacultyDashboard,
});
