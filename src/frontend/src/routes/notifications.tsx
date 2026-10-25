import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import type { AppNotification } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCheck,
  Info,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function NotificationCard({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const isWarning = notification.type === "Warning";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div
      data-ocid={`notification.card.${notification.id}`}
      className={`relative flex gap-3 p-4 rounded-2xl bg-card border border-border transition-smooth ${
        notification.isRead ? "opacity-60" : ""
      }`}
    >
      {/* Icon badge */}
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isWarning
            ? "bg-amber-500/15 text-amber-400"
            : "bg-blue-500/15 text-blue-400"
        }`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isWarning ? "text-amber-400" : "text-blue-400"
            }`}
          >
            {notification.type}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0 pr-6">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground leading-snug break-words">
          {notification.message}
        </p>
        {!notification.isRead && (
          <button
            type="button"
            data-ocid={`notification.mark_read.${notification.id}`}
            onClick={() => onMarkRead(notification.id)}
            className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
          >
            <CheckCheck size={13} />
            Mark as read
          </button>
        )}
      </div>

      {/* Close / dismiss button */}
      <button
        type="button"
        data-ocid={`notification.dismiss.${notification.id}`}
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss notification"
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
      >
        <X size={13} />
      </button>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-primary" />
      )}
    </div>
  );
}

type FilterType = "All" | "Warning" | "Information";

function NotificationsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  const [notifications, setNotifications] =
    useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const allRead = unreadCount === 0;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Warning") return n.type === "Warning";
    return n.type === "Info";
  });

  const FILTERS: FilterType[] = ["All", "Warning", "Information"];

  return (
    <div data-ocid="notifications.page" className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="notifications.back_button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200 -ml-1"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-xl font-bold font-display text-foreground">
              Notifications
            </h1>
            {!allRead && (
              <Badge
                data-ocid="notifications.unread_badge"
                className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full h-5 min-w-[1.25rem] flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          {!allRead && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="notifications.mark_all_read_button"
              onClick={markAllRead}
              className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 gap-1 h-8 px-3 rounded-xl"
            >
              <CheckCheck size={13} />
              All read
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <div
          data-ocid="notifications.filter_bar"
          className="flex gap-2 mt-3"
          role="tablist"
          aria-label="Filter notifications"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={activeFilter === f}
              data-ocid={`notifications.filter.${f.toLowerCase()}`}
              onClick={() => setActiveFilter(f)}
              className={[
                "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors duration-200",
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {f === "Information" ? (
                <span className="flex items-center gap-1">
                  <Info size={11} />
                  {f}
                </span>
              ) : f === "Warning" ? (
                <span className="flex items-center gap-1">
                  <AlertTriangle size={11} />
                  {f}
                </span>
              ) : (
                f
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 px-4 py-4">
        {filteredNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div data-ocid="notifications.list" className="flex flex-col gap-3">
            {filteredNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onDismiss={dismiss}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-ocid="notifications.empty_state"
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
        <Bell size={36} className="text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">
          No notifications yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          You're all caught up. Check back later.
        </p>
      </div>
    </div>
  );
}
