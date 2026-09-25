import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { SwapPair } from "@/components/swaps/SwapSlots";
import { useSwaps } from "@/context/SwapContext";
import { formatDateTime } from "@/utils/helpers";
import { STATUS } from "@/utils/status";

export default function FacultyHistory() {
  const { swaps } = useSwaps();
  const decided = swaps.filter((s) =>
    [STATUS.APPROVED, STATUS.REJECTED].includes(s.status),
  );

  return (
    <AppLayout role="faculty">
      <PageHeader title="Approval History" description="Every decision you have recorded." />
      {decided.length ? (
        <div className="grid gap-3">
          {decided.map((swap) => (
            <Card key={swap.id} className="p-4 sm:p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    {swap.requesterName} ⇄ {swap.counterpartName || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {swap.course} · {formatDateTime(swap.updatedAt)} · {swap.decidedBy}
                  </p>
                </div>
                <StatusBadge status={swap.status} />
              </div>
              <div className="mt-4">
                <SwapPair fromSlot={swap.fromSlot} toSlot={swap.toSlot} />
              </div>
              {swap.decisionComment ? (
                <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {swap.decisionComment}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No approval history yet"
          description="Approved and rejected swaps will be listed here."
        />
      )}
    </AppLayout>
  );
}
