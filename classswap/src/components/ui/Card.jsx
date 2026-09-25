import { cn } from "@/utils/helpers";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-card-foreground sm:text-base">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : <span />}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("p-4 sm:p-5", className)}>{children}</div>;
}
