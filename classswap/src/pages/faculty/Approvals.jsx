import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import EmptyState from "@/components/ui/EmptyState";
import ApprovalCard from "@/components/swaps/ApprovalCard";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { useToast } from "@/context/ToastContext";
import { STATUS } from "@/utils/status";

export default function Approvals() {
  const { user } = useAuth();
  const { swaps, evaluateSwap, approveSwap, rejectSwap } = useSwaps();
  const { toast } = useToast();
  const [busy, setBusy] = useState(null);

  if (!user) return null;

  const pending = swaps.filter((s) => s.status === STATUS.PENDING_APPROVAL);

  const decide = async (swap, comment, approved) => {
    setBusy(swap.id);
    const res = approved
      ? await approveSwap(swap.id, user.name, comment)
      : await rejectSwap(swap.id, user.name, comment);
    setBusy(null);
    if (!res.ok) {
      toast("Action failed", "error", res.error);
      return;
    }
    toast(
      approved ? "Swap approved successfully" : "Swap rejected",
      approved ? "success" : "warning",
      approved ? "Timetables updated" : comment || undefined,
    );
  };

  return (
    <AppLayout role="faculty">
      <PageHeader
        title="Pending Approvals"
        description="Review rule checks, then approve or reject each matched swap."
      />
      {pending.length ? (
        <div className="grid gap-3">
          {pending.map((swap) => (
            <ApprovalCard
              key={swap.id}
              swap={swap}
              busy={busy === swap.id}
              checkResult={evaluateSwap({
                requesterId: swap.requesterId,
                fromSlot: swap.fromSlot,
                toSlot: swap.toSlot,
                counterpartId: swap.counterpartId,
              })}
              onApprove={(s, comment) => decide(s, comment, true)}
              onReject={(s, comment) => decide(s, comment, false)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title="No pending approvals"
          description="You're all caught up. Matched swaps will land here for review."
        />
      )}
    </AppLayout>
  );
}
