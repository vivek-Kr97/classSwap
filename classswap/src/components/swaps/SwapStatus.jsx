import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/helpers";
import { STATUS } from "@/utils/status";

const FLOW = [
  { key: STATUS.OPEN, label: "Open" },
  { key: STATUS.MATCHED, label: "Matched" },
  { key: STATUS.PENDING_APPROVAL, label: "Pending Approval" },
  { key: "FINAL", label: "Decision" },
];

export default function SwapStatus({ status }) {
  const index =
    status === STATUS.APPROVED || status === STATUS.REJECTED
      ? 3
      : FLOW.findIndex((s) => s.key === status);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      {FLOW.map((step, i) => {
        const done = i <= index;
        const label =
          step.key === "FINAL" && (status === STATUS.APPROVED || status === STATUS.REJECTED)
            ? status === STATUS.APPROVED
              ? "Approved"
              : "Rejected"
            : step.label;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                done
                  ? status === STATUS.REJECTED && i === 3
                    ? "bg-destructive/10 text-destructive"
                    : "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < FLOW.length - 1 ? (
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
