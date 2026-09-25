export const SWAP_RULES = {
  swapWindowEnds: "2026-09-30",
  swapWindowLabel: "Until 30 Sep",
  maxSwapsPerStudent: 2,
  sameCourseOnly: true,
  requireCapacity: true,
  sameProgramOnly: true,
};

export const RULE_DEFINITIONS = [
  {
    key: "clash",
    name: "Clash Check",
    description: "No overlap with other classes in either timetable.",
  },
  {
    key: "sameCourse",
    name: "Same Course",
    description: "A swap must stay within the same course or lab.",
  },
  {
    key: "eligibility",
    name: "Eligibility",
    description: "Same program, and the swap limit must not be exceeded.",
  },
  {
    key: "capacity",
    name: "Capacity",
    description: "The target slot must have available seats.",
  },
  {
    key: "deadline",
    name: "Deadline",
    description: "The swap window must still be open.",
  },
  {
    key: "mutual",
    name: "Mutual Check",
    description: "Both students must satisfy the requirements.",
  },
];
