import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, PlusCircle } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import SwapCard from "@/components/swaps/SwapCard";
import SwapStatus from "@/components/swaps/SwapStatus";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/helpers";
import { STATUS } from "@/utils/status";

const TABS = [
  { key: "opportunities", label: "Swap Opportunities" },
  { key: "mine", label: "My Requests" },
];

export default function SwapRequests() {
  const { user } = useAuth();
  const { swaps, evaluateSwap, acceptSwap } = useSwaps();
  const { toast } = useToast();
  const [tab, setTab] = useState("opportunities");
  const [accepting, setAccepting] = useState(null);

  const opportunities = useMemo(
    () => swaps.filter((s) => s.status === STATUS.OPEN && s.requesterId !== user?.id),
    [swaps, user],
  );
  const mine = useMemo(
    () => swaps.filter((s) => s.requesterId === user?.id || s.counterpartId === user?.id),
    [swaps, user],
  );

  if (!user) return null;

  const handleAccept = async (swap) => {
    setAccepting(swap.id);
    const res = await acceptSwap(swap.id, user);
    setAccepting(null);
    if (!res.ok) {
      toast("Unable to accept swap", "error", res.error);
      return;
    }
    toast("Swap accepted", "success", "Status: PENDING APPROVAL");
    setTab("mine");
  };

  return (
    <AppLayout role="student">
      <PageHeader
        title="Swap Requests"
        description="Accept an open request from a classmate or track your own."
        action={
          <Link to="/student/swaps/create">
            <Button>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create Request
            </Button>
          </Link>
        }
      />

      <div
        className="mb-4 inline-flex rounded-lg border border-border bg-card p-1"
        role="tablist"
        aria-label="Swap request views"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "opportunities" ? (
        opportunities.length ? (
          <div className="grid gap-3">
            {opportunities.map((swap) => (
              <SwapCard
                key={swap.id}
                swap={swap}
                checkResult={evaluateSwap({
                  requesterId: swap.requesterId,
                  fromSlot: swap.fromSlot,
                  toSlot: swap.toSlot,
                  counterpartId: user.id,
                })}
                accepting={accepting === swap.id}
                onAccept={handleAccept}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ArrowLeftRight}
            title="No swap opportunities right now"
            description="When classmates post open requests, they appear here."
          />
        )
      ) : mine.length ? (
        <div className="grid gap-3">
          {mine.map((swap) => (
            <Card key={swap.id}>
              <CardHeader
                title={`${swap.course} · ${swap.id}`}
                description={swap.reason}
              />
              <CardBody className="space-y-4">
                <SwapStatus status={swap.status} />
                <SwapCard swap={swap} />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No swap requests yet"
          description="Create a request from your timetable to get started."
          action={
            <Link to="/student/swaps/create">
              <Button size="sm">Create Request</Button>
            </Link>
          }
        />
      )}
    </AppLayout>
  );
}
