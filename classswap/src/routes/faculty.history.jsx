import { createFileRoute } from "@tanstack/react-router";
import FacultyHistory from "@/pages/faculty/FacultyHistory";

export const Route = createFileRoute("/faculty/history")({
  head: () => ({
    meta: [
      { title: "Approval History · ClassSwap" },
      {
        name: "description",
        content: "Every swap decision you have recorded, with comments and timestamps.",
      },
      { property: "og:title", content: "Approval History · ClassSwap" },
      {
        property: "og:description",
        content: "A traceable record of approvals and rejections.",
      },
    ],
  }),
  component: FacultyHistory,
});
