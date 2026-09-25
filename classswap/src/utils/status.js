export const STATUS = {
  OPEN: "OPEN",
  MATCHED: "MATCHED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

export const STATUS_META = {
  OPEN: { label: "Open", tone: "info" },
  MATCHED: { label: "Matched", tone: "primary" },
  PENDING_APPROVAL: { label: "Pending Approval", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const statusLabel = (status) => STATUS_META[status]?.label ?? status;
export const statusTone = (status) => STATUS_META[status]?.tone ?? "neutral";

export const isActiveStatus = (status) =>
  [STATUS.OPEN, STATUS.MATCHED, STATUS.PENDING_APPROVAL].includes(status);
