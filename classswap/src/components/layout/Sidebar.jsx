import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeftRight, LogOut } from "lucide-react";
import { NAV_BY_ROLE, ROLE_LABEL } from "@/components/layout/navigation";
import { cn } from "@/utils/helpers";

export function NavList({ role, onNavigate, className }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV_BY_ROLE[role] ?? [];

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Main navigation">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BrandMark({ role }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <ArrowLeftRight className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold tracking-tight text-foreground">
          ClassSwap
        </span>
        {role ? (
          <span className="block text-xs text-muted-foreground">{ROLE_LABEL[role]}</span>
        ) : null}
      </span>
    </div>
  );
}

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="border-b border-sidebar-border px-4 py-4">
        <BrandMark role={user?.role} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavList role={user?.role} />
      </div>
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="mb-2 rounded-lg bg-muted px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.studentId || user?.facultyId || user?.adminId}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
