import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  academicService,
  adminService,
  facultyService,
  notificationService,
  studentService,
  swapService,
} from "@/services";
import { STATUS } from "@/utils/status";

function formatSlot(raw) {
  if (!raw) return null;
  const day = raw.day || (raw.dayOfWeek ? raw.dayOfWeek.charAt(0) + raw.dayOfWeek.slice(1).toLowerCase() : "");
  const start = raw.start || raw.startTime || "";
  const end = raw.end || raw.endTime || "";
  return {
    id: raw._id || raw.id || raw.slotId,
    slotId: raw._id || raw.id || raw.slotId,
    course: raw.course || raw.courseId?.name || "",
    code: raw.code || raw.courseId?.code || "",
    type: raw.type || (raw.slotType === "LAB" || raw.type === "LAB" ? "Lab" : "Lecture"),
    day,
    dayOfWeek: raw.dayOfWeek || day.toUpperCase(),
    start,
    end,
    startTime: start,
    endTime: end,
    time: raw.time || (start && end ? `${start} - ${end}` : ""),
    batch: raw.batch || "",
    room: raw.room || "",
    faculty: raw.faculty || raw.facultyId?.fullName || "Faculty Member",
    swappable: raw.swappable !== false,
  };
}

function formatSwap(s) {
  if (!s) return null;
  const fromRaw = s.fromSlot || s.currentSlotId || s.requesterSlot;
  const toRaw = s.toSlot || s.desiredSlotId || s.targetSlot;
  const requester = s.requesterId;
  const counterpart = s.matchedStudentId;

  return {
    id: s._id || s.id || s.swapId,
    swapId: s._id || s.id || s.swapId,
    requesterId: requester?._id || requester?.id || (typeof requester === "string" ? requester : s.requesterId),
    requesterName: requester?.fullName || s.requesterName || "Student",
    counterpartId: counterpart?._id || counterpart?.id || (typeof counterpart === "string" ? counterpart : s.counterpartId),
    counterpartName: counterpart?.fullName || s.counterpartName || null,
    course: s.courseId?.name || s.course || fromRaw?.course || "",
    fromSlot: formatSlot(fromRaw),
    toSlot: formatSlot(toRaw),
    reason: s.reason || "",
    status: s.status || "OPEN",
    createdAt: s.createdAt || new Date().toISOString(),
    updatedAt: s.updatedAt || new Date().toISOString(),
    decidedBy: s.facultyId?.fullName || s.decidedBy || null,
    decisionComment: s.decisionComment || null,
  };
}

const SwapContext = createContext(null);

export function SwapProvider({ children }) {
  const { user } = useAuth();

  const [timetables, setTimetables] = useState({});
  const [swaps, setSwaps] = useState([]);
  const [slotCatalog, setSlotCatalog] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [rules, setRules] = useState([]);

  // Fetch initial data based on logged-in user role
  const refreshData = useCallback(async () => {
    if (!user) {
      setTimetables({});
      setSwaps([]);
      setNotifications([]);
      return;
    }

    try {
      if (user.role === "student") {
        // Fetch timetable
        const ttRes = await studentService.getTimetable();
        if (ttRes.ok && ttRes.data?.timetable) {
          const formattedTT = ttRes.data.timetable.map(formatSlot);
          setTimetables((prev) => ({
            ...prev,
            [user.id]: formattedTT,
          }));
        }

        // Fetch open swaps and my swaps
        const openRes = await swapService.getOpenSwaps();
        const myRes = await swapService.getMySwaps();

        const combinedSwaps = [];
        if (openRes.ok && Array.isArray(openRes.data)) {
          combinedSwaps.push(...openRes.data.map(formatSwap));
        }
        if (myRes.ok && Array.isArray(myRes.data)) {
          const formattedMy = myRes.data.map(formatSwap);
          const openIds = new Set(combinedSwaps.map((s) => s.id));
          for (const s of formattedMy) {
            if (!openIds.has(s.id)) combinedSwaps.push(s);
          }
        }
        setSwaps(combinedSwaps);

        // Fetch Notifications
        const notesRes = await notificationService.getNotifications();
        if (notesRes.ok && Array.isArray(notesRes.data)) {
          setNotifications(
            notesRes.data.map((n) => ({
              id: n._id || n.id,
              userId: n.userId?._id || n.userId,
              title: n.title,
              body: n.message,
              tone: n.type?.includes("APPROVED") ? "success" : n.type?.includes("REJECTED") ? "danger" : "info",
              at: n.createdAt,
              read: n.isRead,
            })),
          );
        }
      } else if (user.role === "faculty") {
        const pendingRes = await facultyService.getPendingSwaps();
        const historyRes = await facultyService.getSwapHistory();
        const facultySwaps = [];
        if (pendingRes.ok && Array.isArray(pendingRes.data)) {
          facultySwaps.push(...pendingRes.data.map(formatSwap));
        }
        if (historyRes.ok && Array.isArray(historyRes.data)) {
          const formattedHist = historyRes.data.map(formatSwap);
          const pIds = new Set(facultySwaps.map((s) => s.id));
          for (const s of formattedHist) {
            if (!pIds.has(s.id)) facultySwaps.push(s);
          }
        }
        setSwaps(facultySwaps);
      } else if (user.role === "admin") {
        const allSwapsRes = await adminService.getAllSwaps();
        if (allSwapsRes.ok && Array.isArray(allSwapsRes.data)) {
          setSwaps(allSwapsRes.data.map(formatSwap));
        }

        const auditRes = await adminService.getAuditLogs();
        if (auditRes.ok && Array.isArray(auditRes.data)) {
          setAuditLogs(
            auditRes.data.map((l) => ({
              id: l._id || l.id,
              at: l.createdAt,
              actor: l.actorName || (typeof l.actorId === "object" ? l.actorId?.fullName : "System"),
              action: l.action,
              detail: l.details,
            })),
          );
        }

        const rulesRes = await adminService.getSwapRules();
        if (rulesRes.ok && Array.isArray(rulesRes.data)) {
          setRules(rulesRes.data);
        }
      }

      // Catalog
      const catalogRes = await academicService.getSlots();
      if (catalogRes?.ok && Array.isArray(catalogRes.data)) {
        setSlotCatalog(catalogRes.data.map(formatSlot));
      }
    } catch (e) {
      console.error("Failed to refresh swap data:", e);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getTimetable = useCallback(
    (userId) => timetables[userId] ?? [],
    [timetables],
  );

  const getPerson = useCallback(
    () => null,
    [],
  );

  const swapsUsed = useCallback(
    (userId) =>
      swaps.filter(
        (s) =>
          s.status === STATUS.APPROVED &&
          (s.requesterId === userId || s.counterpartId === userId),
      ).length,
    [swaps],
  );

  const getSlotInfo = useCallback(
    (slot) =>
      slotCatalog.find(
        (c) => c.course === slot?.course && c.batch === slot?.batch,
      ) ?? null,
    [slotCatalog],
  );

  const evaluateSwap = useCallback(
    async ({ fromSlot, toSlot }) => {
      if (!fromSlot?.id || !toSlot?.id) return { passed: false, checks: [] };
      const res = await swapService.checkSwap(fromSlot.id, toSlot.id);
      if (res.ok && res.data) {
        return res.data;
      }
      return { passed: false, checks: [] };
    },
    [],
  );

  const createSwapRequest = useCallback(
    async ({ fromSlot, toSlot, reason }) => {
      const currentSlotId = fromSlot?.slotId || fromSlot?.id;
      const desiredSlotId = toSlot?.slotId || toSlot?.id;
      const res = await swapService.createSwapRequest({
        currentSlotId,
        desiredSlotId,
        reason,
      });
      if (res.ok) {
        await refreshData();
      }
      return res;
    },
    [refreshData],
  );

  const acceptSwap = useCallback(
    async (swapId) => {
      const res = await swapService.acceptSwap(swapId);
      if (res.ok) {
        await refreshData();
      }
      return res;
    },
    [refreshData],
  );

  const approveSwap = useCallback(
    async (swapId, _facultyName, comment) => {
      const res = await facultyService.approveSwap(swapId, comment);
      if (res.ok) {
        await refreshData();
      }
      return res;
    },
    [refreshData],
  );

  const rejectSwap = useCallback(
    async (swapId, _facultyName, comment) => {
      const res = await facultyService.rejectSwap(swapId, comment);
      if (res.ok) {
        await refreshData();
      }
      return res;
    },
    [refreshData],
  );

  const markRead = useCallback(async (id) => {
    const res = await notificationService.markAsRead(id);
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const res = await notificationService.markAllAsRead();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, []);

  const resetDemo = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const notificationsFor = useCallback(
    (userId) =>
      notifications
        .filter((n) => !userId || n.userId === userId)
        .sort((a, b) => new Date(b.at) - new Date(a.at)),
    [notifications],
  );

  const value = useMemo(
    () => ({
      swaps,
      students: Array.from({ length: 15 }),
      timetables,
      slotCatalog,
      auditLogs,
      notifications,
      rules,
      getTimetable,
      getPerson,
      getSlotInfo,
      swapsUsed,
      evaluateSwap,
      createSwapRequest,
      acceptSwap,
      approveSwap,
      rejectSwap,
      notificationsFor,
      markRead,
      markAllRead,
      resetDemo,
      refreshData,
    }),
    [
      swaps,
      timetables,
      slotCatalog,
      auditLogs,
      notifications,
      rules,
      getTimetable,
      getPerson,
      getSlotInfo,
      swapsUsed,
      evaluateSwap,
      createSwapRequest,
      acceptSwap,
      approveSwap,
      rejectSwap,
      notificationsFor,
      markRead,
      markAllRead,
      resetDemo,
      refreshData,
    ],
  );

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}

export function useSwaps() {
  const ctx = useContext(SwapContext);
  if (!ctx) throw new Error("useSwaps must be used inside SwapProvider");
  return ctx;
}
