import { createFileRoute } from "@tanstack/react-router";
import FacultyCourses from "@/pages/faculty/FacultyCourses";

export const Route = createFileRoute("/faculty/courses")({
  head: () => ({
    meta: [
      { title: "Courses · ClassSwap" },
      {
        name: "description",
        content: "Lab batch capacity and swap activity for the courses you teach.",
      },
      { property: "og:title", content: "Courses · ClassSwap" },
      {
        property: "og:description",
        content: "Seat usage and pending swap volume per course.",
      },
    ],
  }),
  component: FacultyCourses,
});
