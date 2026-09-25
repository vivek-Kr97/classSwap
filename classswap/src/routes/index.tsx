import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClassSwap · Controlled class & lab-slot swaps" },
      {
        name: "description",
        content:
          "ClassSwap lets university students swap class and lab slots with automatic rule checks, faculty approval and a full audit trail.",
      },
      { property: "og:title", content: "ClassSwap · Controlled class & lab-slot swaps" },
      {
        property: "og:description",
        content: "Fair, controlled, traceable class swaps for universities.",
      },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
