import { createFileRoute } from "@tanstack/react-router";
import CreateSwap from "@/pages/student/CreateSwap";

export const Route = createFileRoute("/student/swaps/create")({
  validateSearch: (search) => ({
    slot: typeof search.slot === "string" ? search.slot : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create Swap Request · ClassSwap" },
      {
        name: "description",
        content:
          "Create a class or lab swap request in five steps, with automatic rule checks before submission.",
      },
      { property: "og:title", content: "Create Swap Request · ClassSwap" },
      {
        property: "og:description",
        content: "Pick your slot, choose a target, run six rule checks, submit for approval.",
      },
    ],
  }),
  component: CreateSwap,
});
