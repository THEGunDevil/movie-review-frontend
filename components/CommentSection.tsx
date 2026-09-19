"use client";

import { useState } from "react";
import { Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import { Review } from "@/models/Review";

interface CommentSectionProps {
  reviewId: string;
  comments: Review[];
  loading: boolean;
  onCommentSubmit: (reviewId: string, text: string) => void;
  submitting: boolean;
}

export function CommentSection({
  reviewId,
  comments,
  loading,
  onCommentSubmit,
  submitting,
}: CommentSectionProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const value = text.trim();
    if (!value || submitting) return;

    onCommentSubmit(reviewId, value);
    setText("");
  };

  return (
    <div className="mt-4 border-t border-slate-800/60 pt-4">
      <div className="flex gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
          <User className="h-4 w-4 text-slate-500" />
        </div>

        <div className="flex min-w-0 flex-1 gap-2">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Join the discussion..."
            className="min-h-9 flex-1 resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-600"
          />

          <Button
            size="icon"
            disabled={!text.trim() || submitting}
            onClick={handleSubmit}
            className="h-9 w-9 shrink-0 bg-red-600 hover:bg-red-500"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="py-3 text-center text-xs text-slate-600">
            No comments yet. Start the discussion.
          </p>
        )}
      </div>
    </div>
  );
}