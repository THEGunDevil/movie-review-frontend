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
  commentCount,
  likeCount,
  userLiked,
  onCommentsToggle,
  onLike,
  onSave,
  commentsExpanded,
}: ReviewActionsProps) {
  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString());

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5 border-t border-slate-800/60 pt-4">
      <button
        onClick={onCommentsToggle}
        className={cn("flex items-center gap-1.5 text-xs font-medium transition", commentsExpanded ? "text-red-400" : "text-slate-500 hover:text-slate-300")}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">{commentCount} {commentCount === 1 ? "Comment" : "Comments"}</span>
        <span className="sm:hidden">{commentCount}</span>
      </button>
      <button onClick={onLike} className={cn("flex items-center gap-1.5 text-xs font-medium transition", userLiked ? "text-red-400" : "text-slate-500 hover:text-red-400")}>
        <Heart className={cn("h-4 w-4", userLiked && "fill-current")} />
        <span>{formatCount(likeCount)}</span>
      </button>
      <button className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-300" onClick={onSave}>
        <Bookmark className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </button>
    </div>
  );
}