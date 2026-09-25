import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · ClassSwap" },
      {
        name: "description",
        content:
          "Sign in to ClassSwap as a student, faculty member or admin to manage class and lab slot swaps.",
      },
      { property: "og:title", content: "Sign in · ClassSwap" },
      {
        property: "og:description",
        content: "Fair, controlled, traceable class swaps for universities.",
      },
    ],
  }),
  component: Login,
});
