export const cn = (...parts) => parts.filter(Boolean).join(" ");

export const toMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = String(time).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const slotLabel = (slot) =>
  slot ? `${slot.course || ""}${slot.batch ? ` · Batch ${slot.batch}` : ""}` : "";

export const slotTime = (slot) => {
  if (!slot) return "";
  const start = slot.start || slot.startTime || "";
  const end = slot.end || slot.endTime || "";
  return `${slot.day || ""} ${start} - ${end}`.trim();
};

export const shortSlotTime = (slot) => {
  if (!slot) return "";
  const day = slot.day ? slot.day.slice(0, 3) : "";
  const start = slot.start || slot.startTime || "";
  return `${day} ${start}`.trim();
};

export const overlaps = (a, b) => {
  if (!a || !b) return false;
  const aStart = toMinutes(a.start || a.startTime);
  const aEnd = toMinutes(a.end || a.endTime);
  const bStart = toMinutes(b.start || b.startTime);
  const bEnd = toMinutes(b.end || b.endTime);
  return a.day === b.day && aStart < bEnd && bStart < aEnd;
};

export const greeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString([], {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export const todayName = (date = new Date()) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    date.getDay()
  ];

export const uid = (prefix = "id") =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
