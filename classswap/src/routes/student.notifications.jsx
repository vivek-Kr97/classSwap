import { createFileRoute } from "@tanstack/react-router";
import Notifications from "@/pages/student/Notifications";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · ClassSwap" },
      {
        name: "description",
        content: "Swap status updates, approval outcomes and swap window reminders.",
      },
      { property: "og:title", content: "Notifications · ClassSwap" },
      {
        property: "og:description",
        content: "Stay on top of every change to your swap requests.",
      },
    ],
  }),
  component: Notifications,
});
