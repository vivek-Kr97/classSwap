import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Bell,
  CalendarDays,
  PlusCircle,
  Repeat,
} from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import ActivityList from "@/components/dashboard/ActivityList";
import ClassCard from "@/components/timetable/ClassCard";
import SwapStatus from "@/components/swaps/SwapStatus";
import { SwapPair } from "@/components/swaps/SwapSlots";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { greeting, todayName, toMinutes } from "@/utils/helpers";
import { isActiveStatus } from "@/utils/status";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getTimetable, swaps, swapsUsed, rules, auditLogs, notificationsFor } = useSwaps();

  if (!user) return null;

  const today = todayName();
  const todaysClasses = getTimetable(user.id)
    .filter((s) => s.day === today)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  const upcoming = getTimetable(user.id).slice(0, 3);
  const mine = swaps.filter((s) => s.requesterId === user.id || s.counterpartId === user.id);
  const activeSwap = mine.find((s) => isActiveStatus(s.status));
  const opportunities = swaps.filter(
    (s) => s.status === "OPEN" && s.requesterId !== user.id,
  );
  const used = swapsUsed(user.id);
  const unread = notificationsFor(user.id).filter((n) => !n.read).length;

  return (
    <AppLayout role="student">
      <PageHeader
        title={`${greeting()}, ${user.name.split(" ")[0]}`}
        description={`${user.program} · Semester ${user.semester} · Batch ${user.batch}`}
        action={
          <Link to="/student/swaps/create">
            <Button>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create Request
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Classes"
          value={todaysClasses.length}
          hint={today}
          icon={CalendarDays}
        />
        <StatCard
          label="Active Swap"
          value={activeSwap ? 1 : 0}
          hint={activeSwap ? activeSwap.course : "No active swap request"}
          icon={ArrowLeftRight}
          tone="info"
        />
        <StatCard
          label="Swaps Used"
          value={`${used} / ${rules.maxSwapsPerStudent}`}
          hint={`Window ${rules.swapWindowLabel}`}
          icon={Repeat}
          tone="warning"
        />
        <StatCard
          label="Notifications"
          value={unread}
          hint={unread ? "Unread updates" : "You're all caught up"}
          icon={Bell}
          tone={unread ? "danger" : "success"}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Active Swap Request"
              description="Track your request through the approval flow"
              action={
                <Link to="/student/swaps">
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              }
            />
            <CardBody>
              {activeSwap ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{activeSwap.course}</p>
                    <StatusBadge status={activeSwap.status} />
                  </div>
                  <SwapPair fromSlot={activeSwap.fromSlot} toSlot={activeSwap.toSlot} />
                  <SwapStatus status={activeSwap.status} />
                </div>
              ) : (
                <EmptyState
                  icon={ArrowLeftRight}
                  title="No active swap request"
                  description="Pick a swappable slot from your timetable to start a request."
                  action={
                    <Link to="/student/swaps/create">
                      <Button size="sm">Create Request</Button>
                    </Link>
                  }
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Swap Opportunities"
              description="Open requests from classmates"
              action={
                <Link to="/student/swaps">
                  <Button variant="ghost" size="sm">
                    Browse
                  </Button>
                </Link>
              }
            />
            <CardBody>
              {opportunities.length ? (
                <ul className="space-y-3">
                  {opportunities.slice(0, 3).map((swap) => (
                    <li key={swap.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold text-foreground">
                        {swap.requesterName} · {swap.course}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {swap.fromSlot ? `${swap.fromSlot.day} ${swap.fromSlot.start || swap.fromSlot.startTime}` : ""} ⇄{" "}
                        {swap.toSlot ? `${swap.toSlot.day} ${swap.toSlot.start || swap.toSlot.startTime}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No open swap opportunities"
                  description="New requests from classmates will appear here."
                />
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Upcoming Classes" description="Next slots in your timetable" />
            <CardBody className="space-y-2">
              {upcoming.map((slot) => (
                <ClassCard key={slot.id} slot={slot} compact />
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Activity" description="Latest swap actions" />
            <CardBody>
              <ActivityList entries={auditLogs.slice(0, 5)} />
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
