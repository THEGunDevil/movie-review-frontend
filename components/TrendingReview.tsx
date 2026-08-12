import { Badge } from "@/components/ui/badge";

type TrendingReview = {
  media_title: string;
  content: string;
  upvotes?: number | null;
  comment_count?: number | null;
};

type TrendingReviewProps = {
  review: TrendingReview | null;
  formatCount: (value?: number | null) => string;
};

export function TrendingReview({
  review,
  formatCount,
}: TrendingReviewProps) {
  if (!review) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-500/10 bg-linear-to-r from-red-950/40 via-slate-900 to-slate-900 p-5">
      {/* Glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <span className="text-lg">🔥</span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-red-500/10 text-[9px] font-bold uppercase tracking-wider text-red-400">
              Trending
            </Badge>

            <span className="text-[10px] text-slate-600">
              Community spotlight
            </span>
          </div>

          <h3 className="mt-1 truncate text-sm font-bold text-slate-200 sm:text-base">
            {review.media_title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {review.content}
          </p>
        </div>

        {/* Stats */}
        <div className="flex shrink-0 items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-black text-slate-200">
              {formatCount(review.upvotes)}
            </p>

            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Upvotes
            </p>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          <div className="text-center">
            <p className="text-sm font-black text-slate-200">
              {formatCount(review.comment_count)}
            </p>

            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Comments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
