"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Heart,
  Loader2,
  MessageCircle,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "mention"
  | "review"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  avatar?: string;
  link?: string;
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const common = "h-4 w-4";
  switch (type) {
    case "like":
      return <Heart className={cn(common, "fill-current")} />;
    case "comment":
      return <MessageCircle className={common} />;
    case "follow":
      return <Bell className={common} />;
    case "mention":
      return <Bell className={common} />;
    case "review":
      return <Star className={common} />;
    default:
      return <Bell className={common} />;
  }
}

function getIconColor(type: NotificationType) {
  switch (type) {
    case "like":
      return "text-pink-400 bg-pink-400/10";
    case "comment":
      return "text-cyan-400 bg-cyan-400/10";
    case "follow":
      return "text-indigo-400 bg-indigo-400/10";
    case "mention":
      return "text-violet-400 bg-violet-400/10";
    case "review":
      return "text-amber-400 bg-amber-400/10";
    default:
      return "text-slate-400 bg-slate-800";
  }
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const timeAgo = formatDistanceToNow(
    new Date(notification.created_at),
    { addSuffix: true }
  );

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group flex gap-3 px-4 py-3.5 transition-colors",
        "hover:bg-slate-900/70",
        "cursor-pointer",
        !notification.read && "bg-slate-900/40"
      )}
    >
      {notification.avatar ? (
        <div className="relative shrink-0">
          <img
            src={notification.avatar}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
          <div
            className={cn(
              "absolute bottom-3 -right-2 flex h-5 w-5 items-center justify-center rounded-full",
              getIconColor(notification.type)
            )}
          >
            <NotificationIcon type={notification.type} />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            getIconColor(notification.type)
          )}
        >
          <NotificationIcon type={notification.type} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "flex-1 text-sm leading-5",
              notification.read
                ? "text-slate-300"
                : "font-semibold text-white"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-600">{timeAgo}</span>
          {notification.read && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-600 hover:text-red-400"
              aria-label="Delete notification"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(() => {
    if (!accessToken) return null;

    setLoading(true);
    setError(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Initial fetch (existing notifications) using axios with Authorization header
    axios
      .get<Notification[]>(`${baseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
      .then((res) => {
        setNotifications(res.data ?? []);
      })
      .catch((err) => {
        console.error("Failed to fetch initial notifications", err);
        setError("Failed to load notifications");
      })
      .finally(() => {
        setLoading(false);
      });

    // SSE connection with token in query parameter
    const eventSource = new EventSource(
      `${baseUrl}/notifications/stream?token=${encodeURIComponent(accessToken)}`,
      { withCredentials: true }
    );

    eventSource.onopen = () => {
      console.log("SSE connected");
      setLoading(false);
    };

    eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        setNotifications((prev) => {
          const exists = prev.some((item) => item.id === notification.id);
          if (exists) {
            return prev.map((item) =>
              item.id === notification.id ? notification : item
            );
          }
          return [notification, ...prev];
        });
      } catch (error) {
        console.error("Invalid SSE notification:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE error occurred. Reconnecting...");
      // Browser will auto-reconnect
    };

    return eventSource;
  }, [accessToken]);

  useEffect(() => {
    const eventSource = fetchNotifications();
    return () => {
      eventSource?.close();
    };
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    // Optional API call
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      )
      .catch((err) => console.error("Failed to mark as read", err));
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      )
      .then(() => toast.success("All notifications marked as read"))
      .catch((err) => {
        console.error("Failed to mark all as read", err);
        toast.error("Failed to mark all as read");
      });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
      .then(() => toast.success("Notification deleted"))
      .catch((err) => {
        console.error("Failed to delete notification", err);
        toast.error("Failed to delete notification");
      });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </main>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center">
        <div>
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => fetchNotifications()}
            className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <header className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-900 hover:text-slate-300"
            aria-label="Notification settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </header>

        {unreadCount > 0 && (
          <div className="flex justify-end px-4 pb-2">
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-slate-600">
            <Bell className="h-8 w-8" />
            <p className="mt-3 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-900">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}