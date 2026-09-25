import { Bell, CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { cn, formatDateTime } from "@/utils/helpers";

const TONES = {
  success: { icon: CheckCircle2, className: "bg-success/10 text-success" },
  warning: { icon: TriangleAlert, className: "bg-warning/15 text-warning-foreground" },
  danger: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
  info: { icon: Info, className: "bg-info/10 text-info" },
};

export default function NotificationCard({ notification, onRead }) {
  const tone = TONES[notification.tone] ?? { icon: Bell, className: "bg-muted text-muted-foreground" };
  const Icon = tone.icon;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 transition-colors",
        notification.read ? "border-border bg-card" : "border-primary/20 bg-accent/40",
      )}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", tone.className)}>
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">{notification.title}</p>
          <span className="text-xs text-muted-foreground">{formatDateTime(notification.at)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
        {!notification.read && onRead ? (
          <button
            type="button"
            onClick={() => onRead(notification.id)}
            className="mt-2 text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Mark as read
          </button>
        ) : null}
      </div>
    </div>
  );
}
