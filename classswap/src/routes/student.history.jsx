import { createFileRoute } from "@tanstack/react-router";
import StudentHistory from "@/pages/student/StudentHistory";

export const Route = createFileRoute("/student/history")({
  head: () => ({
    meta: [
      { title: "Swap History · ClassSwap" },
      {
        name: "description",
        content: "Approved and rejected swap requests, plus your personal audit trail.",
      },
      { property: "og:title", content: "Swap History · ClassSwap" },
      {
        property: "og:description",
        content: "A complete record of your past class and lab slot swaps.",
      },
    ],
  }),
  component: StudentHistory,
});
