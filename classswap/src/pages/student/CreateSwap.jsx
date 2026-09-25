import { useNavigate, useSearch } from "@tanstack/react-router";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import SwapRequestForm from "@/components/swaps/SwapRequestForm";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function CreateSwap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  if (!user) return null;

  return (
    <AppLayout role="student">
      <PageHeader
        title="Create Swap Request"
        description="Five steps: current slot, desired slot, reason, rule checks, summary."
      />
      <SwapRequestForm
        user={user}
        initialSlotId={search?.slot}
        onSubmitted={() => {
          toast("Swap request created successfully", "success", "Status: OPEN");
          navigate({ to: "/student/swaps" });
        }}
      />
    </AppLayout>
  );
}
