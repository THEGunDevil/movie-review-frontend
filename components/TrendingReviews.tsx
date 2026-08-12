import Link from "next/link";
import Image from "next/image";
import { Flame, Star, MessageCircle, Film } from "lucide-react";

interface TrendingReview {
  id: string;
  media_id: number;
  media_title: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  user_name: string;
  rating: number;
  like_count: number;
  comment_count: number;
}

// Replace with actual API data
const trending: TrendingReview[] = [
  {
    id: "r1",
    media_id: 123,
    media_title: "Oppenheimer",
    media_type: "movie",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    user_name: "HistoryBuff",
    rating: 4.7,
    like_count: 120,
    comment_count: 34,
  },
  // ... more
];

export function TrendingReviews() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
        <Flame className="h-4 w-4 text-red-400" />
        Hot This Week
      </div>
      <div className="space-y-4">
        {trending.map((rev) => (
          <Link
            key={rev.id}
            href={`/reviews/${rev.id}`}
            className="flex gap-3 group items-start"
          >
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-slate-800">
              {rev.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${rev.poster_path}`}
                  alt={rev.media_title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Film className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate group-hover:text-red-400">
                {rev.media_title}
              </p>
              <p className="text-xs text-slate-500">by {rev.user_name}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {rev.rating}
                </span>
                <span>{rev.like_count} likes</span>
                <span>{rev.comment_count} comments</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}