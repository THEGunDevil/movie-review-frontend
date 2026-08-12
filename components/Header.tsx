"use client";

import Link from "next/link";
import { Bell, Film, LogIn, LogOut, UserPlus, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import SignOutDialog from "./SignOutDialog";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AppNotification } from "@/models/notification";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/reviews", label: "Reviews" },
];

export function Header() {
  const { accessToken } = useAuth();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get<AppNotification[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
      );
      setNotifications(data ?? []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [accessToken, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Film className="h-6 w-6 text-red-600" />
          <span className="text-2xl text-slate-100 font-bold tracking-tighter">
            Cine<span className="text-amber-400">Critic</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex text-slate-100">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition-colors hover:text-red-600",
                  isActive ? "text-red-600" : "text-slate-300",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell with Dropdown */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative cursor-pointer flex items-center"
                  aria-label="Notifications"
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell className="h-5 w-5 text-slate-100 hover:text-red-600" />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg border border-slate-700 bg-slate-900 shadow-xl shadow-black/40 backdrop-blur-md z-50">
                    <div className="flex items-center justify-between p-3 border-b border-slate-800">
                      <h2 className="text-sm font-semibold text-slate-100">
                        Notifications
                      </h2>
                      <button
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                          >
                            <p className="text-sm font-medium text-slate-100">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notif.created_at}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-slate-800">
                        <button className="w-full text-xs text-center text-slate-400 hover:text-slate-200 py-1 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop sign out */}
              <div className="hidden md:flex bg-rose-400/30 border border-red-500 rounded px-1.5 py-0.5 text-[8px] sm:text-[10px] font-mono font-semibold">
                <SignOutDialog
                  trigger={
                    <div className="flex items-center px-2 py-1.5 text-xs sm:text-sm text-rose-400 hover:text-rose-300 cursor-pointer rounded-sm">
                      <LogOut className="w-4 h-4 sm:mr-2" />
                      Sign Out
                    </div>
                  }
                />
              </div>

              {/* Mobile sign out */}
              <SignOutDialog
                trigger={
                  <div className="md:hidden border-l px-2 block text-rose-400 hover:text-rose-300 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                  </div>
                }
              />
            </div>
          ) : (
            <>
              {pathname === "/authentication/signup" ? (
                <Link
                  href="/authentication/signin"
                  className="md:bg-cyan-400/10 md:border md:border-cyan-400/30 rounded md:px-1.5 md:py-0.5 text-[8px] md:text-[10px] font-mono font-semibold"
                >
                  <div className="flex items-center md:px-2 md:py-1.5 text-xs sm:text-sm text-rose-400 hover:text-rose-300 cursor-pointer rounded-sm">
                    <LogIn className="w-4 h-4 sm:mr-2 mr-1" /> Sign In
                  </div>
                </Link>
              ) : (
                <Link
                  href="/authentication/signup"
                  className="md:bg-cyan-400/10 md:border md:border-cyan-400/30 rounded md:px-1.5 md:py-0.5 text-[8px] md:text-[10px] font-mono font-semibold"
                >
                  <div className="flex items-center px-2 py-1.5 text-xs sm:text-sm text-rose-400 hover:text-rose-300 cursor-pointer rounded-sm">
                    <UserPlus className="w-4 h-4 sm:mr-2 mr-1" /> Sign Up
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
