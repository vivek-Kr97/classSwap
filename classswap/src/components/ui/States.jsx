import { Loader2, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div
      className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-sm text-muted-foreground"
      role="status"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <TriangleAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
