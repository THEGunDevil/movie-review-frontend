import { useReviews } from "@/context/ReviewContext";
import GoToPage from "@/lib/helpers";
import { MessageSquare } from "lucide-react";
import React from "react";

interface AddReviewComProps {
  mediaID: string; // movie ID or TV ID
  mediaType?: "movie" | "tv";
  onAddReview: (event: React.SubmitEvent<HTMLFormElement>) => void; // <-- new prop
}
function AddReviewCom({ mediaID, mediaType = "movie", onAddReview }: AddReviewComProps) {

   const { newRating, setNewRating, newComment, setNewComment } = useReviews();
  return (
    <section className="space-y-6">
      <div>
        <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
          <MessageSquare className="h-6 w-6 text-red-400" />
          Reviews & Comments
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Share a quick rating and keep the conversation going.
        </p>
      </div>

      <form
        onSubmit={onAddReview}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-white">
            Leave your review
          </h3>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-300">
            Rating
            <select
              value={newRating}
              onChange={(event) => setNewRating(Number(event.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value={5}>5 - Masterpiece</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Bad</option>
            </select>
          </label>
        </div>

        <textarea
          rows={3}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="What did you think of the movie?"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <button
          type="submit"
          className="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-950/30 transition-colors hover:bg-red-600"
        >
          Post Review
        </button>
      </form>
    </section>
  );
}

export default AddReviewCom;
