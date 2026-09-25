import ClassCard from "@/components/timetable/ClassCard";
import TimetableRow from "@/components/timetable/TimetableRow";
import { DAYS } from "@/data/timetable";
import { todayName, toMinutes } from "@/utils/helpers";

export default function Timetable({ slots = [], onSelect, highlightSlotId }) {
  const today = todayName();
  const byDay = DAYS.map((day) => ({
    day,
    slots: slots
      .filter((s) => s.day === day)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start)),
  }));

  return (
    <>
      {/* Desktop / tablet: weekday columns */}
      <div className="hidden grid-cols-5 gap-3 md:grid">
        {byDay.map(({ day, slots: daySlots }) => (
          <div key={day} className="flex flex-col">
            <div className="mb-2 flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
                {day.slice(0, 3)}
              </span>
              {day === today ? (
                <span className="text-[10px] font-semibold text-primary">Today</span>
              ) : null}
            </div>
            <div className="flex-1 space-y-2">
              {daySlots.length ? (
                daySlots.map((slot) => (
                  <ClassCard
                    key={slot.id}
                    slot={slot}
                    onSelect={onSelect}
                    highlighted={slot.id === highlightSlotId}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Free
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked day cards */}
      <div className="space-y-3 md:hidden">
        {byDay.map(({ day, slots: daySlots }) => (
          <TimetableRow
            key={day}
            day={day}
            slots={daySlots}
            onSelect={onSelect}
            highlightSlotId={highlightSlotId}
            isToday={day === today}
          />
        ))}
      </div>
    </>
  );
}
