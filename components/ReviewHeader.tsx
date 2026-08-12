import Link from "next/link";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { ReviewWithMedia } from "@/models/Review";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";

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
  const isOwner = userID != null && String(userID) === String(review.user_id);
  const menuRef = useRef<HTMLDivElement>(null);

  // বাইরে ক্লিক করলে মেনু বন্ধ
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onMenuToggle(review.id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, onMenuToggle, review.id]);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      {/* পোস্টার + টাইটেল */}
      <div className="flex gap-3 sm:gap-4 min-w-0">
        <Link
          href={`/${review.media_type === "movie" ? "movies" : "tv"}/${review.media_id}`}
          className="shrink-0"
        >
          <div className="relative h-16 w-12 sm:h-20 sm:w-14 overflow-hidden rounded-lg bg-slate-800 shadow-md">
            {review.media_poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${review.media_poster_path}`}
                alt={review.media_title}
                fill
                sizes="56px"
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
            href={`/${review.media_type === "movie" ? "movies" : "tv"}/${review.media_id}`}
            className="block truncate text-sm sm:text-base font-bold text-slate-200 hover:text-red-400"
          >
            {review.media_title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <Badge variant="secondary" className="bg-slate-800 text-[9px] text-slate-400">
              {review.media_type.toUpperCase()}
            </Badge>
            <span className="hidden sm:inline">•</span>
            <Link
              href={`/users/${review.user_id}`}
              className="flex items-center gap-1.5 hover:text-slate-300"
            >
              {review.user_profile_picture ? (
                <Image
                  src={review.user_profile_picture}
                  alt={review.user_name}
                  width={18}
                  height={18}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800">
                  <User className="h-2.5 w-2.5" />
                </span>
              )}
              <span className="font-medium">{review.user_name}</span>
            </Link>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(review.created_at)}
            </span>
            {review.updated_at && (
              <span className="text-slate-700">edited</span>
            )}
          </div>
        </div>
      </div>

      {/* রেটিং + মেনু */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-1 sm:px-2.5 sm:py-1.5">
          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            {review.rating.toFixed(1)}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => onMenuToggle(review.id)}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-800 hover:text-slate-300"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {menuOpen && accessToken && (
            <div
              ref={menuRef}
              className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl"
            >
              {isOwner ? (
                <>
                  <button
                    onClick={() => { onEdit(); onMenuToggle(review.id); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); onMenuToggle(review.id); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onReport(); onMenuToggle(review.id); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  <Flag className="h-3.5 w-3.5" /> Report
                </button>
              )}
              <button
                onClick={() => onMenuToggle(review.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}