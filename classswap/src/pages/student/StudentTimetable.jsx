import { useNavigate } from "@tanstack/react-router";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Timetable from "@/components/timetable/Timetable";
import { ErrorState } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";

export default function StudentTimetable() {
  const { user } = useAuth();
  const { getTimetable } = useSwaps();
  const navigate = useNavigate();

  if (!user) return null;

  const slots = getTimetable(user.id);
  const highlight = slots.find((s) => s.swappable)?.id;

  const openSwap = (slot) => {
    navigate({ to: "/student/swaps/create", search: { slot: slot.id } });
  };

  return (
    <AppLayout role="student">
      <PageHeader
        title="My Timetable"
        description="Swappable slots are highlighted — select one to start a swap request."
      />
      <Card>
        <CardHeader
          title={`Week view · ${user.program} Semester ${user.semester}`}
          description={`Batch ${user.batch}`}
        />
        <CardBody>
          {slots.length ? (
            <Timetable slots={slots} onSelect={openSwap} highlightSlotId={highlight} />
          ) : (
            <ErrorState
              title="Unable to load timetable"
              description="No timetable data is available for this account."
            />
          )}
        </CardBody>
      </Card>
    </AppLayout>
  );
}
