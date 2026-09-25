import { createFileRoute } from "@tanstack/react-router";
import AdminRules from "@/pages/admin/AdminRules";

export const Route = createFileRoute("/admin/rules")({
  head: () => ({
    meta: [
      { title: "Swap Rules · ClassSwap" },
      {
        name: "description",
        content:
          "Swap window, per-student limits, course restrictions, capacity and eligibility rules.",
      },
      { property: "og:title", content: "Swap Rules · ClassSwap" },
      {
        property: "og:description",
        content: "The six rule checks executed before any swap is matched.",
      },
    ],
  }),
  component: AdminRules,
});
