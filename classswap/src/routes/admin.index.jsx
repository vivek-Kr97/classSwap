import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "System Overview · ClassSwap" },
      {
        name: "description",
        content:
          "Department-wide swap statistics, live lab capacity and the latest audit entries.",
      },
      { property: "og:title", content: "System Overview · ClassSwap" },
      {
        property: "og:description",
        content: "Monitor swap activity and rule configuration at a glance.",
      },
    ],
  }),
  component: AdminDashboard,
});
