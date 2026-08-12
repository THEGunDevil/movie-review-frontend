"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp, CalendarDays, User, Film } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
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

export function TopReviewBanner({ period }: TopReviewBannerProps) {
  const [data, setData] = useState<TopReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await axios.get<{ data: TopReviewData | null }>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/top-review?period=${period}`
        );
        if (res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch top review", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, [period]);

  if (loading) {
    return (
      <div className="mb-10 animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="h-48 w-32 sm:h-52 sm:w-36 rounded-xl bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-20 rounded bg-slate-800" />
            <div className="h-6 w-56 rounded bg-slate-800" />
            <div className="h-4 w-48 rounded bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-slate-800" />
              <div className="h-6 w-16 rounded-full bg-slate-800" />
            </div>
            <div className="h-4 w-36 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const genreBadges = data.genres?.slice(0, 3) ?? [];
  const label =
    period === "month" ? "Top Rated This Month" : "Top Rated This Week";

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900/95 to-slate-950 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="relative h-48 w-32 sm:h-52 sm:w-36 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-slate-700">
          <Image
            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
            alt={data.media_title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 128px, 144px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
              <TrendingUp className="h-3 w-3" />
              {label}
            </span>
            <Badge className="bg-slate-800 text-[10px] text-slate-400">
              {data.media_type === "movie" ? "MOVIE" : "TV"}
            </Badge>
            {genreBadges.map((genre) => (
              <Badge key={genre} className="bg-slate-800 text-[10px] text-slate-500">
                {genre}
              </Badge>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white truncate">
            <Link
              href={`/${data.media_type}/${data.media_id}`}
              className="hover:text-red-400 transition"
            >
              {data.media_title}
            </Link>
          </h2>

          <blockquote className="mt-2 border-l-2 border-red-500/50 pl-3 text-sm italic text-slate-400 line-clamp-3">
            “{data.top_review}”
          </blockquote>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{data.avg_rating.toFixed(1)}</span>
              <span className="text-slate-500">/5</span>
            </div>
            <span>
              {data.review_count} review{data.review_count !== 1 ? "s" : ""} this{" "}
              {period === "month" ? "month" : "week"}
            </span>
            <Link
              href={`/users/${data.user_id}`}
              className="flex items-center gap-1 hover:text-slate-300"
            >
              <User className="h-3 w-3" /> {data.user_name}
            </Link>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> {formatDate(data.created_at)}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/${data.media_type}/${data.media_id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition"
            >
              <Film className="h-4 w-4" /> View Details
            </Link>
            <Link
              href={`/reviews?media=${data.media_id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Read All Reviews
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
    </section>
  );
}