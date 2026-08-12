import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewActionsProps {
  reviewId: string;
  commentCount: number;
  likeCount: number;
  userLiked: boolean;
  onCommentsToggle: () => void;
  onLike: () => void;
  onSave?: () => void;
  commentsExpanded: boolean;
}

export function ReviewActions({
  reviewId,
  commentCount,
  likeCount,
  userLiked,
  onCommentsToggle,
  onLike,
  onSave,
  commentsExpanded,
}: ReviewActionsProps) {
  const formatCount = (count: number) =>
    count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-800/60 pt-4 sm:gap-x-5">
      <button
        type="button"
        onClick={onCommentsToggle}
        aria-expanded={commentsExpanded}
        aria-controls={`comments-${reviewId}`}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium transition",
          commentsExpanded
            ? "text-red-400"
            : "text-slate-500 hover:text-slate-300",
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </span>
        <span className="sm:hidden">{commentCount}</span>
      </button>

      <button
        type="button"
        onClick={onLike}
        aria-pressed={userLiked}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium transition",
          userLiked ? "text-red-400" : "text-slate-500 hover:text-red-400",
        )}
      >
        <Heart className="h-4 w-4" fill={userLiked ? "currentColor" : "none"} />
        <span>{formatCount(likeCount)}</span>
      </button>

      {onSave && (
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-300"
          onClick={onSave}
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
      )}
    </div>
  );
}
