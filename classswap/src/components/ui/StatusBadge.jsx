import { CheckCircle2, Clock, Link2, Radio, XCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { statusLabel, statusTone, STATUS } from "@/utils/status";

const ICONS = {
  [STATUS.OPEN]: Radio,
  [STATUS.MATCHED]: Link2,
  [STATUS.PENDING_APPROVAL]: Clock,
  [STATUS.APPROVED]: CheckCircle2,
  [STATUS.REJECTED]: XCircle,
  [STATUS.CANCELLED]: XCircle,
};

export default function StatusBadge({ status, className }) {
  return (
    <Badge tone={statusTone(status)} icon={ICONS[status]} className={className}>
      {statusLabel(status)}
    </Badge>
  );
}
