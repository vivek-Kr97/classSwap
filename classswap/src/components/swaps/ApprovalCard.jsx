import { useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Input";
import RuleChecks from "@/components/swaps/RuleChecks";
import { SlotPill } from "@/components/swaps/SwapSlots";
import { ArrowLeftRight } from "lucide-react";
import { formatDateTime } from "@/utils/helpers";

export default function ApprovalCard({ swap, checkResult, onApprove, onReject, busy = false }) {
  const [comment, setComment] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-card-foreground sm:text-base">
            {swap.course} swap request
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Matched {swap.matchedAt ? formatDateTime(swap.matchedAt) : formatDateTime(swap.updatedAt)}
          </p>
        </div>
        <StatusBadge status={swap.status} />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-sm font-semibold text-foreground">{swap.requesterName}</p>
          <SlotPill slot={swap.fromSlot} caption="Current slot" />
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center self-center rounded-full bg-accent text-accent-foreground">
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-sm font-semibold text-foreground">
            {swap.counterpartName || "Awaiting match"}
          </p>
          <SlotPill slot={swap.toSlot} caption="Target slot" />
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0">{swap.reason}</span>
      </p>

      <div className="mt-4 rounded-lg border border-border p-3 sm:p-4">
        <RuleChecks result={checkResult} />
      </div>

      <div className="mt-4">
        <Textarea
          label="Comment (optional)"
          placeholder="Add a note for the students…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="outlineDanger" onClick={() => setRejectOpen(true)} disabled={busy}>
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </Button>
        <Button variant="success" onClick={() => onApprove(swap, comment)} loading={busy}>
          <Check className="h-4 w-4" aria-hidden="true" />
          Approve
        </Button>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject swap request"
        description={`${swap.requesterName} ⇄ ${swap.counterpartName || "—"} · ${swap.course}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setRejectOpen(false);
                onReject(swap, rejectReason || comment);
              }}
            >
              Confirm rejection
            </Button>
          </>
        }
      >
        <Textarea
          label="Rejection reason (optional)"
          placeholder="e.g. Batch B lab is at full capacity"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </Card>
  );
}
