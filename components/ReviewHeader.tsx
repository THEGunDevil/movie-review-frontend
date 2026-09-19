"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Film,
  Flag,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { ReviewWithMedia } from "@/models/Review";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";

interface ReviewHeaderProps {
  review: ReviewWithMedia;
  menuOpen: boolean;
  onMenuToggle: (reviewId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export function ReviewHeader({
  review,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onReport,
}: ReviewHeaderProps) {
  const { userID, accessToken } = useAuth();

  const isOwner =
    userID != null && String(userID) === String(review.user_id);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onMenuToggle(review.id);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen, onMenuToggle, review.id]);

  const mediaHref = `/${review.media_type === "movie" ? "movies" : "tv"}/${review.media_id}`;

  return (
    <header className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <Link href={mediaHref} className="shrink-0">
          <div className="relative h-16 w-11 overflow-hidden rounded-md bg-slate-800">
            {review.media_poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${review.media_poster_path}`}
                alt={review.media_title}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Film className="h-5 w-5 text-slate-600" />
              </div>
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={mediaHref}
            className="block truncate text-sm font-semibold text-slate-200 transition hover:text-red-400 sm:text-base"
          >
            {review.media_title}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
            <Badge
              variant="secondary"
              className="h-4 px-1.5 text-[8px] bg-slate-800 text-slate-400"
            >
              {review.media_type?.toUpperCase()}
            </Badge>

            <Link
              href={`/users/${review.user_id}`}
              className="flex items-center gap-1 hover:text-slate-300"
            >
              {review.user_profile_picture ? (
                <Image
                  src={review.user_profile_picture}
                  alt={review.user_name}
                  width={16}
                  height={16}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800">
                  <User className="h-2.5 w-2.5" />
                </span>
              )}

              <span className="max-w-24 truncate">{review.user_name}</span>
            </Link>

            <span>•</span>

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(review.created_at)}
            </span>

            {review.updated_at && (
              <span className="text-slate-600">edited</span>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200">
            {review.rating.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onMenuToggle(review.id)}
          aria-label="Review menu"
          className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {menuOpen && accessToken && (
          <div
            ref={menuRef}
            className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-1 shadow-xl"
          >
            {isOwner ? (
              <>
                <MenuButton
                  icon={<Pencil className="h-3.5 w-3.5" />}
                  label="Edit"
                  onClick={() => {
                    onEdit();
                    onMenuToggle(review.id);
                  }}
                />

                <MenuButton
                  danger
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  label="Delete"
                  onClick={() => {
                    onDelete();
                    onMenuToggle(review.id);
                  }}
                />
              </>
            ) : (
              <MenuButton
                icon={<Flag className="h-3.5 w-3.5" />}
                label="Report"
                onClick={() => {
                  onReport();
                  onMenuToggle(review.id);
                }}
              />
            )}

            <MenuButton
              icon={<Share2 className="h-3.5 w-3.5" />}
              label="Share"
              onClick={() => onMenuToggle(review.id)}
            />
          </div>
        )}
      </div>
    </header>
  );
}

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}