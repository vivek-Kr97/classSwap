import { Link } from "@tanstack/react-router";
import { Bell, LogOut, Menu } from "lucide-react";
import { BrandMark } from "@/components/layout/Sidebar";
import { ROLE_LABEL } from "@/components/layout/navigation";

export default function Header({ user, unread, onOpenMenu, onLogout }) {
  const initials = (user?.name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="lg:hidden">
            <BrandMark role={user?.role} />
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-foreground">
              {ROLE_LABEL[user?.role]} workspace
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Controlled class &amp; lab-slot swaps for universities
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user?.role === "student" ? (
            <Link
              to="/student/notifications"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          ) : null}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {initials}
          </span>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
