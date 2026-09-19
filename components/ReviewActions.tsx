"use client";

import {
  Bookmark,
  Heart,
  MessageSquare,
} from "lucide-react";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import useWatchList from "@/hooks/useWatchList";

interface ReviewActionsProps {
  mediaType: string;
  mediaId: number;
  commentCount: number;
  likeCount: number;
  userLiked: boolean;
  onCommentsToggle: () => void;
  onLike: () => void;
  commentsExpanded: boolean;
}

export function ReviewActions({
  mediaId,
  mediaType,
  commentCount,
  likeCount,
  userLiked,
  onCommentsToggle,
  onLike,
  commentsExpanded,
}: ReviewActionsProps) {
  // =========================================================
  // State
  // =========================================================
  const [saved, setSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // Watchlist hooks
  // =========================================================
  const {
    addMovieToWatchlist,
    addTVToWatchlist,

    removeMovieFromWatchlist,
    removeTVFromWatchlist,

    isMovieInWatchlist,
    isTVInWatchlist,
  } = useWatchList();

  // =========================================================
  // Format count
  // =========================================================
  const formatCount = (count: number) => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    }

    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}K`;
    }

    return String(count);
  };

  // =========================================================
  // Check whether current movie/TV is already saved
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const checkSavedState = async () => {
      setCheckingSaved(true);

      try {
        let result = false;

        if (mediaType === "movie") {
          result = await isMovieInWatchlist(mediaId);
        } else if (mediaType === "tv") {
          result = await isTVInWatchlist(mediaId);
        }

        if (!cancelled) {
          setSaved(result);
        }
      } catch (error) {
        console.error(
          "Failed to load watchlist state:",
          error,
        );

        if (!cancelled) {
          setSaved(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingSaved(false);
        }
      }
    };

    checkSavedState();

    return () => {
      cancelled = true;
    };
  }, [
    mediaId,
    mediaType,
    isMovieInWatchlist,
    isTVInWatchlist,
  ]);

  // =========================================================
  // Save / Remove toggle
  // =========================================================
  const handleSave = async () => {
    // Prevent double click
    if (saving || checkingSaved) {
      return;
    }

    setSaving(true);

    try {
      // =====================================================
      // Currently saved -> REMOVE
      // =====================================================
      if (saved) {
        if (mediaType === "movie") {
          await removeMovieFromWatchlist(mediaId);
        } else if (mediaType === "tv") {
          await removeTVFromWatchlist(mediaId);
        }

        setSaved(false);

        toast.success("Removed from watch list.", {
          position: "top-center",
        });

        return;
      }

      // =====================================================
      // Currently not saved -> ADD
      // =====================================================
      if (mediaType === "movie") {
        const result = await addMovieToWatchlist(mediaId);

        if (result) {
          setSaved(true);

          toast.success("Added to watch list!", {
            position: "top-center",
          });
        }
      } else if (mediaType === "tv") {
        const result = await addTVToWatchlist(mediaId);

        if (result) {
          setSaved(true);

          toast.success("Added to watch list!", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.error(
        "There was an error while updating watchlist:",
        error,
      );

      // =====================================================
      // Backend returned 409
      // =====================================================
      const axiosError = error as {
        response?: {
          status?: number;
        };
      };

      if (axiosError.response?.status === 409) {
        setSaved(true);

        toast.info("Already in your watch list.", {
          position: "top-center",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-4 border-t border-slate-800/60 pt-3">
      {/* =====================================================
          Comments
      ====================================================== */}
      <ActionButton
        active={commentsExpanded}
        onClick={onCommentsToggle}
        aria-label="Comments"
      >
        <MessageSquare className="h-4 w-4" />

        <span className="hidden sm:inline">
          {commentCount}{" "}
          {commentCount === 1
            ? "Comment"
            : "Comments"}
        </span>

        <span className="sm:hidden">
          {commentCount}
        </span>
      </ActionButton>

      {/* =====================================================
          Like
      ====================================================== */}
      <ActionButton
        active={userLiked}
        onClick={onLike}
        aria-label="Like"
      >
        <Heart
          className="h-4 w-4"
          fill={userLiked ? "currentColor" : "none"}
        />

        <span>{formatCount(likeCount)}</span>
      </ActionButton>

      {/* =====================================================
          Save
      ====================================================== */}
      <ActionButton
        onClick={(e) => {
          e.stopPropagation();
          handleSave();
        }}
        className="ml-auto"
        active={saved}
        disabled={saving || checkingSaved}
        aria-label={
          saved
            ? "Remove from watchlist"
            : "Save to watchlist"
        }
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-all",
            saving && "animate-pulse",
          )}
          fill={saved ? "currentColor" : "none"}
        />

        <span className="hidden sm:inline">
          {checkingSaved
            ? "Checking..."
            : saving
              ? saved
                ? "Removing..."
                : "Saving..."
              : saved
                ? "Saved"
                : "Save"}
        </span>
      </ActionButton>
    </div>
  );
}

// =========================================================
// Action Button
// =========================================================

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  "aria-label": string;
}

function ActionButton({
  children,
  onClick,
  active,
  className,
  disabled = false,
  "aria-label": ariaLabel,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium transition-colors",
        active
          ? "text-red-400"
          : "text-slate-500 hover:text-slate-300",
        disabled &&
          "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}