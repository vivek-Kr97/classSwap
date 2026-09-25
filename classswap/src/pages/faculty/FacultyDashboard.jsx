import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ClipboardCheck, XCircle } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import ActivityList from "@/components/dashboard/ActivityList";
import ApprovalCard from "@/components/swaps/ApprovalCard";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { useToast } from "@/context/ToastContext";
import { greeting } from "@/utils/helpers";
import { STATUS } from "@/utils/status";
import { useState } from "react";

const isToday = (iso) =>
  iso ? new Date(iso).toDateString() === new Date().toDateString() : false;

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { swaps, auditLogs, evaluateSwap, approveSwap, rejectSwap } = useSwaps();
  const { toast } = useToast();
  const [busy, setBusy] = useState(null);

  if (!user) return null;

  const pending = swaps.filter((s) => s.status === STATUS.PENDING_APPROVAL);
  const approvedToday = swaps.filter(
    (s) => s.status === STATUS.APPROVED && isToday(s.decidedAt),
  ).length;
  const rejectedToday = swaps.filter(
    (s) => s.status === STATUS.REJECTED && isToday(s.decidedAt),
  ).length;

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
    if (approved) {
      toast("Swap approved successfully", "success", "Timetables updated");
    } else {
      toast("Swap rejected", "warning", comment || undefined);
    }
  };

  return (
    <AppLayout role="faculty">
      <PageHeader
        title={`${greeting()}, ${user.name}`}
        description={`${user.facultyId || user.employeeId || "FAC001"} · ${(user.courses || []).length || 4} active courses`}
        action={
          <Link to="/faculty/approvals">
            <Button>
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Pending Approvals
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending Approvals"
          value={pending.length}
          hint="Awaiting your review"
          icon={ClipboardCheck}
          tone="warning"
        />
        <StatCard
          label="Approved Today"
          value={approvedToday}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard label="Rejected Today" value={rejectedToday} icon={XCircle} tone="danger" />
        <StatCard
          label="Active Courses"
          value={user.courses.length}
          hint={user.courses.join(", ")}
          icon={BookOpen}
          tone="primary"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Requests awaiting approval</h2>
          {pending.length ? (
            pending.map((swap) => (
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
            ))
          ) : (
            <EmptyState
              icon={ClipboardCheck}
              title="No pending approvals"
              description="Matched swap requests for your courses will appear here."
            />
          )}
        </div>

        <Card>
          <CardHeader title="Recent Activity" description="Audit entries across your courses" />
          <CardBody>
            <ActivityList entries={auditLogs.slice(0, 6)} />
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
