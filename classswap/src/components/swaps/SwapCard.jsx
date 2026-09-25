import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, User } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import RuleChecks from "@/components/swaps/RuleChecks";
import { SwapPair } from "@/components/swaps/SwapSlots";
import { formatDateTime } from "@/utils/helpers";

export default function SwapCard({
  swap,
  checkResult,
  onAccept,
  accepting = false,
  footer,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{swap.requesterName}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {swap.course} · requested {formatDateTime(swap.createdAt)}
          </p>
        </div>
        <StatusBadge status={swap.status} />
      </div>

      <div className="mt-4">
        <SwapPair fromSlot={swap.fromSlot} toSlot={swap.toSlot} />
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0">{swap.reason}</span>
      </p>

      {swap.counterpartName ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Matched with <span className="font-medium text-foreground">{swap.counterpartName}</span>
        </p>
      ) : null}

      {swap.decisionComment ? (
        <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{swap.decidedBy}:</span>{" "}
          {swap.decisionComment}
        </p>
      ) : null}

      {checkResult ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>
              Rule Checks · {checkResult.passedCount}/{checkResult.total} passed
            </span>
            {open ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          {open ? (
            <div className="animate-in mt-3">
              <RuleChecks result={checkResult} />
            </div>
          ) : null}
        </div>
      ) : null}

      {onAccept || footer ? (
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          {footer}
          {onAccept ? (
            <Button
              onClick={() => onAccept(swap)}
              loading={accepting}
              disabled={checkResult ? !checkResult.passed : false}
            >
              Accept Swap
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
