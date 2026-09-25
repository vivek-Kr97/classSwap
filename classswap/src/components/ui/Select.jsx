import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function Select({ label, hint, className, id, children, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
