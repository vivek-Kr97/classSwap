import { LogOut, X } from "lucide-react";
import { BrandMark, NavList } from "@/components/layout/Sidebar";

export default function MobileNav({ open, user, onClose, onLogout }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/40"
      />
      <div className="animate-in relative z-10 flex h-full w-72 max-w-[85%] flex-col border-r border-sidebar-border bg-sidebar">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <BrandMark role={user?.role} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList role={user?.role} onNavigate={onClose} />
        </div>
        <div className="border-t border-sidebar-border px-3 py-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
