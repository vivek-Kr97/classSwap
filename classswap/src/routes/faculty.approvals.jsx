import { createFileRoute } from "@tanstack/react-router";
import Approvals from "@/pages/faculty/Approvals";

export const Route = createFileRoute("/faculty/approvals")({
  head: () => ({
    meta: [
      { title: "Pending Approvals · ClassSwap" },
      {
        name: "description",
        content:
          "Approve or reject matched class and lab swap requests, with an optional comment.",
      },
      { property: "og:title", content: "Pending Approvals · ClassSwap" },
      {
        property: "og:description",
        content: "Every request arrives with its six rule checks attached.",
      },
    ],
  }),
  component: Approvals,
});
