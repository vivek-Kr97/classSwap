import { Activity } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDateTime } from "@/utils/helpers";

export default function ActivityList({ entries = [], emptyLabel = "No activity yet" }) {
  if (!entries.length) {
    return <EmptyState icon={Activity} title={emptyLabel} description="Actions will be recorded here as the swap workflow progresses." />;
  }
  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold">{entry.actor}</span> · {entry.action}
            </p>
            {entry.detail ? (
              <p className="truncate text-xs text-muted-foreground">{entry.detail}</p>
            ) : null}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDateTime(entry.at)}
          </span>
        </li>
      ))}
    </ol>
  );
}
