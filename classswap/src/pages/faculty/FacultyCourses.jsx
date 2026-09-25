import { BookOpen, Users } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { STATUS } from "@/utils/status";

export default function FacultyCourses() {
  const { user } = useAuth();
  const { slotCatalog, swaps } = useSwaps();

  if (!user) return null;

  return (
    <AppLayout role="faculty">
      <PageHeader
        title="Courses"
        description="Lab capacity and swap activity across the courses you teach."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {user.courses.map((course) => {
          const slots = slotCatalog.filter((c) => c.course.startsWith(course));
          const courseSwaps = swaps.filter((s) => s.course.startsWith(course));
          const pending = courseSwaps.filter((s) => s.status === STATUS.PENDING_APPROVAL).length;
          return (
            <Card key={course}>
              <CardHeader
                title={course}
                description={`${courseSwaps.length} swap request${courseSwaps.length === 1 ? "" : "s"} this semester`}
                action={
                  pending ? (
                    <Badge tone="warning">{pending} pending</Badge>
                  ) : (
                    <Badge tone="success">Up to date</Badge>
                  )
                }
              />
              <CardBody className="space-y-2">
                {slots.length ? (
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {slot.course} · Batch {slot.batch}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.day} {slot.start} - {slot.end} · {slot.room}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {slot.enrolled} / {slot.capacity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Lecture-only course — no batch slots to swap.
                  </p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
