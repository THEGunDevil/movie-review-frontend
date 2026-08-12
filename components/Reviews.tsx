"use client";

import { useState } from "react";
import { useReviews } from "@/context/ReviewContext";
import { Review } from "@/models/Review";
import { CalendarDays, Pencil, Star, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface ReviewsProps {
  reviews: Review[] | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Reviews({
  reviews = [],
  page,
  totalPages = 1,
  onPageChange,
}: ReviewsProps) {
  const { handleDeleteReview, handleSaveEdit } = useReviews();

  const [edit, setEdit] = useState<{
    editComment: string;
    editRating: number;
    editingId: string | null;
  }>({
    editComment: "",
    editRating: 5,
    editingId: null,
  });

  const handleStartEdit = (review: Review) => {
    setEdit({
      editComment: review.content,
      editRating: review.rating,
      editingId: review.id,
    });
  };

  const onSave = (reviewId: string) => {
    handleSaveEdit(reviewId, edit.editRating, edit.editComment);
  };

  const reviewList = reviews ?? [];
  const loading = false; // loading is now controlled by the parent – you could pass a `loading` prop as well

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-red-400" />
        <span className="ml-2 text-sm text-slate-400">Loading reviews…</span>
      </div>
    );
  }

  // ── Empty state ──
  if (!reviewList.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-8 text-center">
        <p className="text-sm text-slate-500">
          No reviews yet. Be the first to share your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Review list ── */}
      <div className="max-h-105 rounded-lg border border-slate-800 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {reviewList.map((review) => {
          const isEditing = edit.editingId === review.id;

          return (
            <div
              key={review.id}
              className="rounded-lg border-b border-slate-800/50 bg-slate-900/40 px-3 py-2.5 transition-colors hover:bg-slate-900/60"
            >
              {isEditing ? (
                // ── Editing mode ──
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800">
                      {review.profile_picture ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${review.profile_picture}`}
                          alt={review.user_name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                          {review.user_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {review.user_name}
                    </span>
                    <Select
                      value={String(edit.editRating)}
                      onValueChange={(value) =>
                        setEdit((prev) => ({
                          ...prev,
                          editRating: Number(value),
                        }))
                      }
                    >
                      <SelectTrigger className="ml-auto w-27.5 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-xs">
                        {[5, 4, 3, 2, 1].map((r) => (
                          <SelectItem key={r} value={String(r)}>
                            {r} / 5
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    rows={3}
                    value={edit.editComment}
                    onChange={(e) =>
                      setEdit((prev) => ({
                        ...prev,
                        editComment: e.target.value,
                      }))
                    }
                    className="bg-slate-950 border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-red-500"
                    placeholder="Edit your review…"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEdit((prev) => ({ ...prev, editingId: null }))
                      }
                      className="h-7 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onSave(review.id)}
                      disabled={!edit.editComment.trim()}
                      className="h-7 bg-red-600 hover:bg-red-500 text-xs text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-xs font-semibold text-slate-200">
                        {review.user_name}
                      </span>
                      <span className="text-slate-700">•</span>
                      <span className="flex shrink-0 items-center gap-1 text-[10px] text-slate-500">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-300">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    {review.content}
                  </p>
                  <div className="mt-1.5 flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(review)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-slate-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}