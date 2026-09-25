import { cn } from "@/utils/helpers";

const TONES = {
  primary: "bg-accent text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export default function StatCard({ label, value, hint, icon: Icon, tone = "primary" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", TONES[tone])}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
