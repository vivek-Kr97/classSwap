import { ArrowLeftRight } from "lucide-react";
import { slotLabel, slotTime } from "@/utils/helpers";

export function SlotPill({ slot, caption }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/50 p-3">
      {caption ? (
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {caption}
        </p>
      ) : null}
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{slotLabel(slot)}</p>
      <p className="text-xs text-muted-foreground">{slotTime(slot)}</p>
    </div>
  );
}

export function SwapPair({ fromSlot, toSlot, fromCaption = "From", toCaption = "To" }) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <SlotPill slot={fromSlot} caption={fromCaption} />
      <span className="grid h-8 w-8 shrink-0 place-items-center self-center rounded-full bg-accent text-accent-foreground">
        <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
      </span>
      <SlotPill slot={toSlot} caption={toCaption} />
    </div>
  );
}
