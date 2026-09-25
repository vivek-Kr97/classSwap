import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function RuleChecks({ result, compact = false }) {
  if (!result || typeof result.then === "function") return null;
  const checks = Array.isArray(result.checks) ? result.checks : [];
  if (!checks.length) return null;

  const total = result.total || checks.length;
  const passedCount = result.passedCount ?? checks.filter((c) => c.passed).length;
  const passed = result.passed ?? (total > 0 && passedCount === total);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Rule Checks</p>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            passed
              ? "border-success/20 bg-success/10 text-success"
              : "border-destructive/20 bg-destructive/10 text-destructive",
          )}
        >
          {passedCount}/{total} checks passed
        </span>
      </div>
      <ul className={cn("grid gap-2", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        {checks.map((check, index) => {
          const isPassed = check.passed !== false;
          const Icon = isPassed ? CheckCircle2 : XCircle;
          return (
            <li
              key={check.code || check.key || index}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-3",
                isPassed
                  ? "border-success/20 bg-success/5"
                  : "border-destructive/20 bg-destructive/5",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  isPassed ? "text-success" : "text-destructive",
                )}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{check.name || check.code}</p>
                <p className="text-xs text-muted-foreground">{check.message}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
