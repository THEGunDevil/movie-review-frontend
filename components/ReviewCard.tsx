"use client";

import { ReviewHeader } from "./ReviewHeader";
import { ReviewContent } from "./ReviewContent";
import { ReviewActions } from "./ReviewActions";
import { CommentSection } from "./CommentSection";
import { VoteControls } from "./VoteControl";
import { Review, ReviewWithMedia } from "@/models/Review";
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
  const { userID } = useAuth();
  const isOwner = String(userID) === String(review.user_id);

  return (
    <article
      className={`overflow-hidden rounded-xl border shadow-lg transition-colors ${
        isOwner
          ? "border-pink-800/80 bg-slate-900/60"
          : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60"
      }`}
    >
      <div className="flex flex-row">
        <div className="border-b border-slate-800/70 sm:border-b-0 sm:border-r">
          <VoteControls
            review={review}
            onVote={onVote}
            disabled={disabled}
          />
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
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
            mediaType = {review.media_type}
            mediaId= {review.media_id}
            commentCount={review.comment_count}
            likeCount={review.like_count}
            userLiked={review.user_liked}
            onCommentsToggle={onToggleComments}
            onLike={onLike}
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