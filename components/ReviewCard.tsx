"use client";

import { ReviewHeader } from "./ReviewHeader";
import { ReviewContent } from "./ReviewContent";
import { ReviewActions } from "./ReviewActions";
import { CommentSection } from "./CommentSection";
import { Review, ReviewWithMedia } from "@/models/Review";
import { VoteControls } from "./VoteControl";
import { useAuth } from "@/context/AuthContext";

interface ReviewCardProps {
  review: ReviewWithMedia;
  isExpanded: boolean;
  isEditing: boolean;
  editContent: string;
  isSaving: boolean;
  menuOpen: boolean;
  comments?: Review[];
  commentsLoading: boolean;
  commentSubmitting: boolean;
  onToggleComments: () => void;
  onLike: () => void;
  onSave: () => void;
  onVote: (id: string, vote: "up" | "down") => void;
  onMenuToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  onEditChange: (content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onCommentSubmit: (reviewId: string, text: string) => void;
  disabled?: boolean;
}

export function ReviewCard({
  review,
  isExpanded,
  isEditing,
  editContent,
  isSaving,
  menuOpen,
  comments,
  commentsLoading,
  commentSubmitting,
  onToggleComments,
  onLike,
  onSave,
  onVote,
  onMenuToggle,
  onEdit,
  onDelete,
  onReport,
  onEditChange,
  onCancelEdit,
  onSaveEdit,
  onCommentSubmit,
  disabled,
}: ReviewCardProps) {
  const {userID} = useAuth()
  return (
    <article className={`group overflow-hidden rounded-2xl border ${userID === review.user_id ? "border-emerald-800 border-2" : "bg-slate-900/40"}  bg-slate-900/40 shadow-lg transition hover:border-slate-700 hover:bg-slate-900/60`}>
      <div className="flex flex-col sm:flex-row">
        {/* ভোট কন্ট্রোল – মোবাইলে উপরে, ডেস্কটপে পাশে */}
        <div className="sm:border-r border-slate-800/70">
          <VoteControls review={review} onVote={onVote} disabled={disabled} />
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <ReviewHeader
            review={review}
            menuOpen={menuOpen}
            onMenuToggle={onMenuToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
          />

          <ReviewContent
            content={review.content}
            containsSpoilers={review.contains_spoilers}
            isEditing={isEditing}
            editContent={editContent}
            onEditChange={onEditChange}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            isSaving={isSaving}
          />

          <ReviewActions
            reviewId={review.id}
            commentCount={review.comment_count}
            likeCount={review.like_count}
            userLiked={review.user_liked}
            onCommentsToggle={onToggleComments}
            onLike={onLike}
            onSave={onSave}
            commentsExpanded={isExpanded}
          />

          {isExpanded && (
            <CommentSection
              reviewId={review.id}
              comments={comments ?? []}
              loading={commentsLoading}
              onCommentSubmit={onCommentSubmit}
              submitting={commentSubmitting}
            />
          )}
        </div>
      </div>
    </article>
  );
}