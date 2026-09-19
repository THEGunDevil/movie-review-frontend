"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface VoteControlsProps {
  review: {
    id: string;
    upvotes?: number;
    downvotes?: number;
    user_vote: "up" | "down" | null;
    user_id: string;
  };
  onVote: (id: string, vote: "up" | "down") => void;
  disabled?: boolean;
}

export function VoteControls({
  review,
  onVote,
  disabled,
}: VoteControlsProps) {
  const { userID } = useAuth();

  const upvotes = Number(review.upvotes ?? 0);
  const downvotes = Number(review.downvotes ?? 0);
  const score = upvotes - downvotes;

  const isDisabled = disabled || String(review.user_id) === String(userID);

  return (
    <div className="flex items-center justify-center gap-1 px-3 py-2 w-10 flex-col sm:px-2 sm:py-4">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onVote(review.id, "up")}
        aria-label="Upvote"
        className={`rounded-md p-1 transition ${
          review.user_vote === "up"
            ? "bg-green-400/10 text-green-400"
            : "text-slate-500 hover:bg-slate-800 hover:text-green-400"
        } disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <span className="min-w-7 text-center text-xs font-semibold text-slate-400">
        {score}
      </span>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onVote(review.id, "down")}
        aria-label="Downvote"
        className={`rounded-md p-1 transition ${
          review.user_vote === "down"
            ? "bg-red-400/10 text-red-400"
            : "text-slate-500 hover:bg-slate-800 hover:text-red-400"
        } disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}