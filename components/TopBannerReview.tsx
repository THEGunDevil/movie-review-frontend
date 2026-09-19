"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  TrendingUp,
  CalendarDays,
  User,
} from "lucide-react";
import axios from "axios";
import { formatDate } from "@/lib/format";

interface TopReviewData {
  media_id: string;
  media_title: string;
  media_type: "movie" | "tv";
  poster_path: string;
  avg_rating: number;
  review_count: number;
  top_review: string;
  user_name: string;
  user_id: string;
  created_at: string;
  genres?: string[];
}

interface TopReviewBannerProps {
  period: "week" | "month";
}

export function TopReviewBanner({
  period,
}: TopReviewBannerProps) {
  const [data, setData] = useState<TopReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await axios.get<{
          data: TopReviewData | null;
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/top-review?period=${period}`,
        );

        setData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch top review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, [period]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
        <div className="flex gap-4">
          <div className="h-28 w-20 shrink-0 rounded-lg bg-slate-800" />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-3 w-24 rounded bg-slate-800" />
            <div className="h-5 w-3/4 rounded bg-slate-800" />
            <div className="h-10 w-full rounded bg-slate-800" />
            <div className="h-3 w-32 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const label =
    period === "month"
      ? "Top This Month"
      : "Top This Week";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-lg shadow-black/10 backdrop-blur transition hover:border-slate-700">
      <div className="relative z-10 flex gap-4">
        {/* Poster */}
        <Link
          href={`/${data.media_type}/${data.media_id}`}
          className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/5"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
            alt={data.media_title}
            fill
            sizes="80px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Label */}
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            <TrendingUp className="h-3 w-3" />
            {label}
          </div>

          {/* Title */}
          <Link
            href={`/${data.media_type}/${data.media_id}`}
            className="block truncate text-base font-bold text-white transition hover:text-indigo-300"
          >
            {data.media_title}
          </Link>

          {/* Review */}
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            “{data.top_review}”
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <strong className="text-slate-200">
                {data.avg_rating.toFixed(1)}
              </strong>
            </span>

            <span>
              {data.review_count} reviews
            </span>

            <span className="flex items-center gap-1 truncate">
              <User className="h-3 w-3" />
              {data.user_name}
            </span>
          </div>

          {/* Date */}
          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-600">
            <CalendarDays className="h-3 w-3" />
            {formatDate(data.created_at)}
          </div>
        </div>
      </div>

      {/* Accent glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl transition group-hover:bg-indigo-500/15" />
    </article>
  );
}