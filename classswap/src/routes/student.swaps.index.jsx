import { createFileRoute } from "@tanstack/react-router";
import SwapRequests from "@/pages/student/SwapRequests";

export const Route = createFileRoute("/student/swaps/")({
  head: () => ({
    meta: [
      { title: "Swap Requests · ClassSwap" },
      {
        name: "description",
        content:
          "Browse open swap opportunities from classmates and track the status of your own swap requests.",
      },
      { property: "og:title", content: "Swap Requests · ClassSwap" },
      {
        property: "og:description",
        content: "Accept a swap opportunity or follow your request to approval.",
      },
    ],
  }),
  component: SwapRequests,
});
