import ClassCard from "@/components/timetable/ClassCard";

export default function TimetableRow({ day, slots, onSelect, highlightSlotId, isToday }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">{day}</h3>
        {isToday ? (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            Today
          </span>
        ) : null}
      </div>
      {slots.length ? (
        <div className="space-y-2">
          {slots.map((slot) => (
            <ClassCard
              key={slot.id}
              slot={slot}
              onSelect={onSelect}
              highlighted={slot.id === highlightSlotId}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No classes scheduled.</p>
      )}
    </section>
  );
}
