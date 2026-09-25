import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { LoadingState } from "@/components/ui/States";

/** Protected shell: checks the mock user's role before rendering a page. */
export default function AppLayout({ role, children }) {
  const { user, ready, logout } = useAuth();
  const { notificationsFor } = useSwaps();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
    } else if (user.role !== role) {
      navigate({ to: `/${user.role}`, replace: true });
    }
  }, [ready, user, role, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login", replace: true });
  };

  if (!ready || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <LoadingState label="Checking access…" />
      </div>
    );
  }

  const unread = notificationsFor(user.id).filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <MobileNav
        open={menuOpen}
        user={user}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          unread={unread}
          onOpenMenu={() => setMenuOpen(true)}
          onLogout={handleLogout}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : <span />}
    </div>
  );
}
