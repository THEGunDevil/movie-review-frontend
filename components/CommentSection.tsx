import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, User } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { Review } from "@/models/Review";

interface CommentSectionProps {
  reviewId: string;
  comments: Review[] | [];
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
    const trimmed = text.trim();
    if (!trimmed) return;
    onCommentSubmit(reviewId, trimmed);
    setText("");
  };

  return (
    <div className="mt-5 border-t border-slate-800/60 pt-5">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
          <User className="h-4 w-4 text-slate-500" />
        </div>
        <div className="flex min-w-0 flex-1 gap-2">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Join the discussion..."
            className="min-h-10 flex-1 resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-600"
          />
          <Button size="icon" disabled={!text.trim() || submitting} onClick={handleSubmit} className="h-10 w-10 shrink-0 bg-red-600 hover:bg-red-500">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
          </div>
        ) : comments?.length ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-slate-600">No comments yet. Start the discussion.</p>
        )}
      </div>
    </div>
  );
}