import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock, PlusCircle, ScrollText, Users } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import StatCard from "@/components/dashboard/StatCard";
import ActivityList from "@/components/dashboard/ActivityList";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { useSwaps } from "@/context/SwapContext";
import { useToast } from "@/context/ToastContext";
import { adminService } from "@/services";
import { shortSlotTime, slotLabel } from "@/utils/helpers";
import { STATUS, isActiveStatus } from "@/utils/status";

export default function AdminDashboard() {
  const { swaps, auditLogs, students, slotCatalog, rules, refreshData } = useSwaps();
  const { toast } = useToast();

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Form states for Course
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(4);
  const [isLab, setIsLab] = useState(false);

  // Form states for Slot
  const [slotCourseId, setSlotCourseId] = useState("");
  const [slotType, setSlotType] = useState("LAB");
  const [slotBatch, setSlotBatch] = useState("Batch A");
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [room, setRoom] = useState("Lab 201");
  const [capacity, setCapacity] = useState(30);

  const active = swaps.filter((s) => isActiveStatus(s.status));
  const pending = swaps.filter((s) => s.status === STATUS.PENDING_APPROVAL);
  const approved = swaps.filter((s) => s.status === STATUS.APPROVED);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) {
      toast("Course creation failed", "error", "Please fill in course code and name");
      return;
    }
    setBusy(true);
    const res = await adminService.createCourse({
      code: courseCode.trim(),
      name: courseName.trim(),
      credits: Number(credits),
      hasLecture: !isLab,
      hasLab: isLab,
    });
    setBusy(false);
    if (!res.ok) {
      toast("Failed to create course", "error", res.error);
      return;
    }
    toast("Course created successfully", "success", `${courseCode} · ${courseName}`);
    setCourseModalOpen(false);
    setCourseCode("");
    setCourseName("");
    refreshData();
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotCourseId) {
      toast("Slot creation failed", "error", "Please select a course for this slot");
      return;
    }
    setBusy(true);
    const res = await adminService.createSlot({
      courseId: slotCourseId,
      type: slotType,
      batch: slotType === "LAB" ? slotBatch : undefined,
      dayOfWeek,
      startTime,
      endTime,
      room,
      capacity: Number(capacity),
      swappable: true,
    });
    setBusy(false);
    if (!res.ok) {
      toast("Failed to create slot", "error", res.error);
      return;
    }
    toast("Slot created successfully", "success", `${dayOfWeek} ${startTime}-${endTime} · ${room}`);
    setSlotModalOpen(false);
    refreshData();
  };

  return (
    <AppLayout role="admin">
      <PageHeader
        title="System Overview"
        description="Swap activity, rules and audit trail across the department."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setCourseModalOpen(true)}>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              + Course
            </Button>
            <Button variant="primary" onClick={() => setSlotModalOpen(true)}>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              + Slot
            </Button>
            <Link to="/admin/audit-log">
              <Button variant="ghost">
                <ScrollText className="h-4 w-4" aria-hidden="true" />
                Audit Log
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={students.length} hint="MCA · Semester 3" icon={Users} />
        <StatCard
          label="Active Requests"
          value={active.length}
          hint="Open, matched or pending"
          icon={Clock}
          tone="info"
        />
        <StatCard
          label="Pending Approvals"
          value={pending.length}
          hint="Awaiting faculty"
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Approved Swaps"
          value={approved.length}
          hint="Timetables updated"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Swap Activity"
            description="All swap requests in the current window"
            action={
              <Link to="/admin/rules">
                <Button variant="ghost" size="sm">
                  Rules
                </Button>
              </Link>
            }
          />
          <CardBody>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                    <th scope="col" className="py-2 pr-3 font-medium">Requester</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Course</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Swap</th>
                    <th scope="col" className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {swaps.map((swap) => (
                    <tr key={swap.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-3 font-medium text-foreground">
                        {swap.requesterName}
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground">{swap.course}</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">
                        {shortSlotTime(swap.fromSlot)} ⇄ {shortSlotTime(swap.toSlot)}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={swap.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-2 md:hidden">
              {swaps.map((swap) => (
                <li key={swap.id} className="rounded-lg border border-border p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {swap.requesterName}
                    </p>
                    <StatusBadge status={swap.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {slotLabel(swap.fromSlot)} ⇄ {slotLabel(swap.toSlot)}
                  </p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Active Rules"
              description={`Swap window ${rules.swapWindowLabel || "Semester 3"}`}
            />
            <CardBody className="flex flex-wrap gap-2">
              <Badge tone="primary">Max {rules.maxSwapsPerStudent || 2} swaps / student</Badge>
              <Badge tone="primary">Same course only</Badge>
              <Badge tone="primary">Same program</Badge>
              <Badge tone="primary">Capacity enforced</Badge>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Lab Capacity" description="Live seat usage" />
            <CardBody className="space-y-2">
              {slotCatalog.map((slot) => (
                <div key={slot.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="truncate text-sm text-foreground">
                    {slot.course} {slot.batch ? `· Batch ${slot.batch}` : ""}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {slot.room} · {slot.day} {slot.start}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Audit Entries" />
            <CardBody>
              <ActivityList entries={auditLogs.slice(0, 5)} />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal: Create Course */}
      <Modal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title="Create New Course"
        description="Add a new academic course to the system"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCourse} loading={busy}>
              Create Course
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCourse} className="space-y-3">
          <Input
            label="Course Code"
            placeholder="e.g. CS305"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
          <Input
            label="Course Name"
            placeholder="e.g. Artificial Intelligence Lab"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
          <Input
            label="Credits"
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            required
          />
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isLab"
              checked={isLab}
              onChange={(e) => setIsLab(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="isLab" className="text-sm font-medium text-foreground">
              This is a Lab course (has batches)
            </label>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Slot */}
      <Modal
        open={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        title="Create New Slot"
        description="Define a class or lab slot schedule"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSlotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSlot} loading={busy}>
              Create Slot
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSlot} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Course</label>
            <select
              value={slotCourseId}
              onChange={(e) => setSlotCourseId(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              required
            >
              <option value="">-- Select Course --</option>
              {slotCatalog.map((s) => (
                <option key={s.id} value={s.id || s.courseId}>
                  {s.course} ({s.code || s.type})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="LAB">Lab</option>
                <option value="LECTURE">Lecture</option>
              </select>
            </div>
            {slotType === "LAB" ? (
              <Input
                label="Batch"
                placeholder="e.g. Batch C"
                value={slotBatch}
                onChange={(e) => setSlotBatch(e.target.value)}
              />
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Day</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
              </select>
            </div>
            <Input
              label="Start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Room"
              placeholder="e.g. Lab 203"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
            <Input
              label="Capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
