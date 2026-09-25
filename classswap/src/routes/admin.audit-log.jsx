import { createFileRoute } from "@tanstack/react-router";
import AuditLog from "@/pages/admin/AuditLog";

export const Route = createFileRoute("/admin/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log · ClassSwap" },
      {
        name: "description",
        content:
          "A chronological record of every swap action: requests, matches, approvals and timetable updates.",
      },
      { property: "og:title", content: "Audit Log · ClassSwap" },
      {
        property: "og:description",
        content: "Full traceability for every class and lab slot swap.",
      },
    ],
  }),
  component: AuditLog,
});
