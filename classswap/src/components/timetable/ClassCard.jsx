import { FlaskConical, GraduationCap, MapPin, Repeat } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function ClassCard({ slot, onSelect, highlighted = false, compact = false }) {
  const Icon = slot.type === "Lab" ? FlaskConical : GraduationCap;
  const interactive = Boolean(onSelect) && slot.swappable;
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      {...(interactive
        ? {
            type: "button",
            onClick: () => onSelect(slot),
            "aria-label": `Request a swap for ${slot.course} on ${slot.day} ${slot.start}`,
          }
        : {})}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all",
        highlighted
          ? "border-primary/40 bg-accent ring-1 ring-primary/30"
          : "border-border bg-card",
        interactive &&
          "hover:border-primary/40 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-card-foreground">{slot.course}</p>
          <p className="text-xs text-muted-foreground">
            {slot.start} - {slot.end}
          </p>
          {!compact ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span>{slot.type}</span>
              {slot.batch ? <span>· Batch {slot.batch}</span> : null}
              {slot.room ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {slot.room}
                </span>
              ) : null}
            </p>
          ) : null}
          {slot.swappable ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <Repeat className="h-3 w-3" aria-hidden="true" />
              Swappable
            </span>
          ) : null}
        </div>
      </div>
    </Tag>
  );
}
