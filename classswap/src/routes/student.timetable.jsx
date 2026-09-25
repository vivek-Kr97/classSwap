import { createFileRoute } from "@tanstack/react-router";
import StudentTimetable from "@/pages/student/StudentTimetable";

export const Route = createFileRoute("/student/timetable")({
  head: () => ({
    meta: [
      { title: "My Timetable · ClassSwap" },
      {
        name: "description",
        content:
          "Your weekly lecture and lab timetable with swappable slots highlighted.",
      },
      { property: "og:title", content: "My Timetable · ClassSwap" },
      {
        property: "og:description",
        content: "See every lecture and lab slot, and start a swap in one click.",
      },
    ],
  }),
  component: StudentTimetable,
});
