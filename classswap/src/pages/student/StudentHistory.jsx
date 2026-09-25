import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import ActivityList from "@/components/dashboard/ActivityList";
import { SwapPair } from "@/components/swaps/SwapSlots";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { formatDateTime } from "@/utils/helpers";
import { STATUS } from "@/utils/status";

export default function StudentHistory() {
  const { user } = useAuth();
  const { swaps, auditLogs } = useSwaps();

  if (!user) return null;

  const history = swaps.filter(
    (s) =>
      (s.requesterId === user.id || s.counterpartId === user.id) &&
      [STATUS.APPROVED, STATUS.REJECTED, STATUS.CANCELLED].includes(s.status),
  );

  const myLogs = auditLogs.filter((l) => l.actor === user.name).slice(0, 8);

  return (
    <AppLayout role="student">
      <PageHeader title="History" description="Completed swap requests and your activity trail." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {history.length ? (
            history.map((swap) => (
              <Card key={swap.id} className="p-4 sm:p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                      {swap.course}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Decided {formatDateTime(swap.updatedAt)} by {swap.decidedBy || "—"}
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
            ))
          ) : (
            <EmptyState
              title="No swap history yet"
              description="Approved and rejected swaps will be listed here."
            />
          )}
        </div>

        <Card>
          <CardHeader title="Your activity" description="Audit entries recorded for you" />
          <CardBody>
            <ActivityList entries={myLogs} emptyLabel="No activity recorded yet" />
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
