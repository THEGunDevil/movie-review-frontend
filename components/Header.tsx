"use client";

import Link from "next/link";
import {
  Bell,
  Bookmark,
  Film,
  Home,
  LogIn,
  LogOut,
  Star,
  Tv,
  User,
  UserPlus,
  X,
  CheckCheck,
  Loader2,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext";
import SignOutDialog from "./SignOutDialog";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Button } from "./ui/button";
import { AppNotification } from "@/models/Notification";
import { formatDistanceToNow } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "TV Shows", icon: Tv },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/watchlist", label: "Watch List", icon: Bookmark },
];

export function Header() {
  const { accessToken, userID } = useAuth();
  const pathname = usePathname();

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const notificationsRef =
    useRef<HTMLDivElement>(null);

  const eventSourceRef =
    useRef<EventSource | null>(null);

  // =====================================================
  // INITIAL NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    console.log("🔔 Notification API effect");

    console.log(
      "🔑 accessToken:",
      accessToken ? "AVAILABLE" : "MISSING"
    );

    console.log(
      "🌐 API_URL:",
      API_URL
    );

    if (!accessToken) {
      console.log(
        "⛔ accessToken missing - skipping notifications"
      );
      return;
    }

    if (!API_URL) {
      console.error(
        "❌ NEXT_PUBLIC_API_URL is undefined"
      );
      return;
    }

    let cancelled = false;

    const loadNotifications = async () => {
      console.log(
        "📥 GET:",
        `${API_URL}/notifications`
      );

      try {
        setLoadingNotifications(true);

        const response =
          await axios.get<AppNotification[]>(
            `${API_URL}/notifications`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          );

        console.log(
          "✅ Notifications response:",
          response.status,
          response.data
        );

        if (cancelled) {
          return;
        }

        setNotifications((prev) => {
          const merged = [...prev];

          for (const notification of response.data ?? []) {
            const index = merged.findIndex(
              (item) => item.id === notification.id
            );

            if (index === -1) {
              merged.push(notification);
            } else {
              merged[index] = notification;
            }
          }

          return merged;
        });
      } catch (error) {
        console.error(
          "❌ Notifications API error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingNotifications(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  // =====================================================
  // SSE CONNECTION
  // =====================================================

  useEffect(() => {
    console.log("📡 SSE effect");

    if (!accessToken) {
      console.log(
        "⛔ accessToken missing - skipping SSE"
      );
      return;
    }

    if (!API_URL) {
      console.error(
        "❌ NEXT_PUBLIC_API_URL is undefined"
      );
      return;
    }

    let mounted = true;

    const url =
      `${API_URL}/notifications/stream?token=` +
      encodeURIComponent(accessToken);

    console.log(
      "📡 Opening SSE:",
      `${API_URL}/notifications/stream?token=...`
    );

    const eventSource =
      new EventSource(url, {
        withCredentials: true,
      });

    eventSourceRef.current =
      eventSource;

    eventSource.onopen = () => {
      console.log(
        "✅ Notification SSE connected"
      );
    };

    eventSource.addEventListener(
      "connected",
      (event) => {
        console.log(
          "✅ SSE connected event:",
          event.data
        );
      }
    );

    eventSource.addEventListener(
      "notification",
      (event) => {
        if (!mounted) {
          return;
        }

        console.log(
          "🔔 SSE notification:",
          event.data
        );

        try {
          const notification =
            JSON.parse(
              event.data
            ) as AppNotification;

          setNotifications((prev) => {
            const exists =
              prev.some(
                (item) =>
                  item.id ===
                  notification.id
              );

            if (exists) {
              return prev.map(
                (item) =>
                  item.id ===
                    notification.id
                    ? notification
                    : item
              );
            }

            return [
              notification,
              ...prev,
            ];
          });
        } catch (error) {
          console.error(
            "❌ Invalid SSE notification:",
            error
          );
        }
      }
    );

    eventSource.onerror = (error) => {
      console.error(
        "❌ SSE error:",
        error
      );

      console.log(
        "SSE readyState:",
        eventSource.readyState
      );
    };

    return () => {
      mounted = false;

      console.log(
        "🧹 Closing SSE connection"
      );

      eventSource.close();

      if (
        eventSourceRef.current ===
        eventSource
      ) {
        eventSourceRef.current = null;
      }
    };
  }, [accessToken]);

  // =====================================================
  // CLICK OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(
          event.target as Node
        )
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    if (!accessToken || !API_URL) {
      return;
    }

    const hasUnread =
      notifications.some(
        (notification) =>
          !notification.read
      );

    if (!hasUnread) {
      return;
    }

    const previousNotifications =
      notifications;

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    try {
      await axios.post(
        `${API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(
        "❌ Failed to mark all as read:",
        error
      );

      setNotifications(
        previousNotifications
      );
    }
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <>
      <header className="sticky top-0 z-60 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <Film className="h-6 w-6 text-red-600" />

            <span className="text-2xl text-slate-100 font-bold tracking-tighter">
              Cine
              <span className="text-amber-400">
                Critic
              </span>
            </span>
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex text-slate-100">
            {navItems.map(
              ({
                href,
                label,
              }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(
                        href
                      );

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "transition-colors hover:text-red-600",
                      isActive
                        ? "text-red-600"
                        : "text-slate-300"
                    )}
                  >
                    {label}
                  </Link>
                );
              }
            )}
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-5">

            {accessToken ? (
              <div className="flex items-center gap-4">

                {/* Notification */}

                <div
                  ref={notificationsRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsNotificationsOpen(
                        (open) => !open
                      )
                    }
                    className="relative flex cursor-pointer items-center"
                    aria-label="Notifications"
                    aria-expanded={
                      isNotificationsOpen
                    }
                  >
                    <Bell className="h-5 w-5 text-slate-100 hover:text-red-600" />

                    {unreadCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl shadow-black/40 sm:w-80">

                      <div className="flex items-center justify-between border-b border-slate-800 p-3">

                        <h2 className="text-sm font-semibold text-slate-100">
                          Notifications
                        </h2>

                        <div className="flex items-center gap-2">

                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={
                                markAllAsRead
                              }
                              className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-200"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              Mark all read
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setIsNotificationsOpen(
                                false
                              )
                            }
                            className="text-slate-400 hover:text-slate-200"
                          >
                            <X className="h-4 w-4" />
                          </button>

                        </div>
                      </div>

                      <div className="max-h-72 overflow-y-auto">

                        {loadingNotifications ? (
                          <div className="flex justify-center p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                          </div>
                        ) : notifications.length === 0 ? (
                          <p className="p-4 text-center text-sm text-slate-400">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map(
                            (notif) => (
                              <div
                                key={notif.id}
                                className={cn(
                                  "border-b border-slate-800/50 p-3 transition-colors last:border-0 hover:bg-slate-800/30",
                                  !notif.read &&
                                    "bg-slate-800/20"
                                )}
                              >
                                <div className="flex items-start justify-between gap-2">

                                  <p className="text-sm font-medium text-slate-100">
                                    {notif.title}
                                  </p>

                                  {!notif.read && (
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                  )}

                                </div>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  {notif.message}
                                </p>

                                <p className="mt-1 text-[11px] text-slate-500">
                                  {formatDistanceToNow(
                                    new Date(
                                      notif.created_at
                                    ),
                                    {
                                      addSuffix:
                                        true,
                                    }
                                  )}
                                </p>
                              </div>
                            )
                          )
                        )}

                      </div>

                      {notifications.length > 0 && (
                        <div className="border-t border-slate-800 p-2">
                          <Link
                            href="/notifications"
                            className="block w-full py-1 text-center text-xs text-slate-400 transition-colors hover:text-slate-200"
                            onClick={() =>
                              setIsNotificationsOpen(
                                false
                              )
                            }
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {/* Sign out */}

                <div className="hidden rounded border border-red-500 bg-rose-400/30 px-1.5 py-0.5 text-[8px] font-mono font-semibold md:flex sm:text-[10px]">
                  <SignOutDialog
                    trigger={
                      <div className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 sm:text-sm">
                        <LogOut className="w-4 sm:mr-2" />
                        Sign Out
                      </div>
                    }
                  />
                </div>

              </div>
            ) : (
              <>
                {pathname ===
                "/authentication/signin" ? (
                  <Link
                    href="/authentication/signup"
                    className="rounded font-mono text-[8px] font-semibold md:border md:border-cyan-400/30 md:bg-cyan-400/10 md:px-1.5 md:py-0.5 md:text-[10px]"
                  >
                    <div className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 sm:text-sm">
                      <UserPlus className="mr-1 h-4 w-4 sm:mr-2" />
                      Sign Up
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/authentication/signin"
                    className="rounded font-mono text-[8px] font-semibold md:border md:border-cyan-400/30 md:bg-cyan-400/10 md:px-1.5 md:py-0.5 md:text-[10px]"
                  >
                    <div className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 sm:text-sm">
                      <LogIn className="mr-1 h-4 w-4 sm:mr-2" />
                      Sign In
                    </div>
                  </Link>
                )}
              </>
            )}

            <Link href={`/profile/${userID}`}>
              <Button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-100 hover:bg-red-700">
                <User className="h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>
      </header>

      {/* Mobile Navigation */}

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-cyan-500/20 bg-[#0d131d]/95 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((link) => {
            const Icon = link.icon;

            const isActive =
              pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "bg-linear-to-r from-red-400 to-pink-500 bg-clip-text text-transparent"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-pink-400"
                      : ""
                  }`}
                />

                <span className="text-[11px] font-semibold tracking-wider">
                  {link.label}
                </span>

                {isActive && (
                  <span className="absolute top-0 h-0.5 w-8 bg-linear-to-r from-red-400 to-pink-500" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
