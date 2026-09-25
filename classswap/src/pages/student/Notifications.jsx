import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import NotificationCard from "@/components/dashboard/NotificationCard";
import { useAuth } from "@/context/AuthContext";
import { useSwaps } from "@/context/SwapContext";
import { useToast } from "@/context/ToastContext";

export default function Notifications() {
  const { user } = useAuth();
  const { notificationsFor, markRead, markAllRead } = useSwaps();
  const { toast } = useToast();

  if (!user) return null;

  const items = notificationsFor(user.id);
  const unread = items.filter((n) => !n.read).length;

  return (
    <AppLayout role="student">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread update${unread > 1 ? "s" : ""}` : "You're all caught up"}
        action={
          unread ? (
            <Button
              variant="secondary"
              onClick={() => {
                markAllRead(user.id);
                toast("All notifications marked as read", "info");
              }}
            >
              Mark all as read
            </Button>
          ) : null
        }
      />
      {items.length ? (
        <div className="grid gap-3">
          {items.map((n) => (
            <NotificationCard key={n.id} notification={n} onRead={markRead} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications"
          description="Swap updates and reminders will show up here."
        />
      )}
    </AppLayout>
  );
}
