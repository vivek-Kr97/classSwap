import { useId } from "react";
import { cn } from "@/utils/helpers";

const baseField =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

export default function Input({ label, hint, className, id, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <input id={fieldId} className={cn(baseField, "h-10", className)} {...props} />
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Textarea({ label, hint, className, id, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <textarea id={fieldId} className={cn(baseField, "min-h-24 resize-y", className)} {...props} />
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
