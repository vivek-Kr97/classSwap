import { SWAP_RULES } from "@/data/rules";
import { overlaps } from "@/utils/helpers";

/**
 * Pure, UI-independent rule engine.
 * Every check receives a context object and returns
 * { key, name, passed, message }.
 *
 * Context shape:
 * {
 *   requester, fromSlot, toSlot,
 *   requesterTimetable, counterpart, counterpartTimetable,
 *   requesterSwapsUsed, counterpartSwapsUsed,
 *   targetSlotInfo: { capacity, enrolled },
 *   now: Date
 * }
 */

export function checkClash(ctx) {
  const others = (ctx.requesterTimetable || []).filter(
    (s) => s.id !== ctx.fromSlot?.id,
  );
  const clash = ctx.toSlot ? others.find((s) => overlaps(s, ctx.toSlot)) : null;
  return {
    key: "clash",
    name: "Clash Check",
    passed: !clash,
    message: clash
      ? `Clashes with ${clash.course} on ${clash.day} ${clash.start}`
      : "No timetable clash",
  };
}

export function checkSameCourse(ctx) {
  const passed =
    !SWAP_RULES.sameCourseOnly ||
    (!!ctx.fromSlot && !!ctx.toSlot && ctx.fromSlot.course === ctx.toSlot.course);
  return {
    key: "sameCourse",
    name: "Same Course",
    passed,
    message: passed
      ? "Same course"
      : "Swaps are only allowed within the same course",
  };
}

export function checkEligibility(ctx) {
  const used = ctx.requesterSwapsUsed ?? 0;
  const limit = SWAP_RULES.maxSwapsPerStudent;
  const sameProgram =
    !ctx.counterpart ||
    !SWAP_RULES.sameProgramOnly ||
    ctx.counterpart.program === ctx.requester?.program;
  const withinLimit = used < limit;
  const passed = sameProgram && withinLimit;
  return {
    key: "eligibility",
    name: "Eligibility",
    passed,
    message: !withinLimit
      ? `Swap limit reached (${used} of ${limit} used)`
      : !sameProgram
        ? "Students are not in the same program"
        : `Eligible (${used} of ${limit} swaps used)`,
  };
}

export function checkCapacity(ctx) {
  const info = ctx.targetSlotInfo;
  if (!info) {
    return {
      key: "capacity",
      name: "Capacity",
      passed: false,
      message: "Target slot capacity unknown",
    };
  }
  const passed = !SWAP_RULES.requireCapacity || info.enrolled < info.capacity;
  const batch = ctx.toSlot?.batch ? `Batch ${ctx.toSlot.batch} seats` : "Seats";
  return {
    key: "capacity",
    name: "Capacity",
    passed,
    message: passed
      ? `${batch}: ${info.enrolled} / ${info.capacity}`
      : `${batch} full: ${info.enrolled} / ${info.capacity}`,
  };
}

export function checkDeadline(ctx) {
  const now = ctx.now || new Date();
  const passed = now <= new Date(`${SWAP_RULES.swapWindowEnds}T23:59:59`);
  return {
    key: "deadline",
    name: "Deadline",
    passed,
    message: passed
      ? "Swap window open"
      : `Swap window closed on ${SWAP_RULES.swapWindowLabel}`,
  };
}

export function checkMutualEligibility(ctx) {
  if (!ctx.counterpart) {
    return {
      key: "mutual",
      name: "Mutual Check",
      passed: true,
      message: "Awaiting counterpart — requester side satisfied",
    };
  }
  const counterpartOthers = (ctx.counterpartTimetable || []).filter(
    (s) => s.id !== ctx.toSlot?.id,
  );
  const counterpartClash = ctx.fromSlot
    ? counterpartOthers.find((s) => overlaps(s, ctx.fromSlot))
    : null;
  const counterpartWithinLimit =
    (ctx.counterpartSwapsUsed ?? 0) < SWAP_RULES.maxSwapsPerStudent;
  const passed = !counterpartClash && counterpartWithinLimit;
  return {
    key: "mutual",
    name: "Mutual Check",
    passed,
    message: passed
      ? "Mutual check passed"
      : counterpartClash
        ? `${ctx.counterpart.name} has a clash with ${counterpartClash.course}`
        : `${ctx.counterpart.name} has reached the swap limit`,
  };
}

export function runAllChecks(ctx) {
  const checks = [
    checkClash(ctx),
    checkSameCourse(ctx),
    checkEligibility(ctx),
    checkCapacity(ctx),
    checkDeadline(ctx),
    checkMutualEligibility(ctx),
  ];
  return {
    passed: checks.every((c) => c.passed),
    passedCount: checks.filter((c) => c.passed).length,
    total: checks.length,
    checks,
  };
}
