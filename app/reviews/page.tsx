"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { useReviewInteractions } from "@/hooks/useReviewInteractions";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import FilterBar from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { ReviewCard } from "@/components/ReviewCard";
import { TopReviewBanner } from "@/components/TopBannerReview";
import { ReviewCardSkeleton } from "@/components/ReviewCardSkeleton";

export default function ReviewsPage() {
  const h = useReviewInteractions();

  if (h.loading && !h.reviewsData) return <LoadingState />;
  if (h.error && !h.reviewsData)
    return <ErrorState message={h.error} onRetry={() => h.applyFilters()} />;
  if (h.loading && !h.reviewsData) {
    return (
      <div className="space-y-4 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <main className="min-h-screen grid md:grid-cols-2 grid-cols-1 gap-3 mx-auto bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <aside>
        <TopReviewBanner period="week" />
        <TopReviewBanner period="month" />{" "}
      </aside>
      <div className="mx-auto max-w-4xl">
        {/* হেডার */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
              Community Reviews
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Honest opinions from people who watched it.
            </p>
          </div>
          <Link href="/movies">
            <Button className="w-full gap-2 bg-red-600 font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 sm:w-auto">
              <Plus className="h-4 w-4" /> Write a Review
            </Button>
          </Link>
        </div>

        {/* ফিল্টার */}
        <FilterBar
          search={h.search}
          onSearchChange={h.setSearch}
          onSearchSubmit={h.applyFilters}
          mediaType={h.mediaType}
          onMediaTypeChange={h.setMediaType}
          ratingFilter={h.ratingFilter}
          onRatingFilterChange={h.setRatingFilter}
          sort={h.sort}
          onSortChange={h.setSort}
          onClearFilters={h.clearFilters}
          hasFilters={h.hasFilters}
        />

        {/* রিভিউ লিস্ট */}
        {h.reviews.length === 0 ? (
          <EmptyState onClearFilters={h.clearFilters} />
        ) : (
          <div className="space-y-4">
            {h.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isExpanded={h.expandedComments[review.id] ?? false}
                isEditing={h.editingReview === review.id}
                editContent={h.editingReview === review.id ? h.editContent : ""}
                isSaving={h.actionLoading[review.id]}
                menuOpen={h.openMenu === review.id}
                comments={h.comments[review.id]}
                commentsLoading={h.commentsLoading[review.id] ?? false}
                commentSubmitting={h.commentSubmitting[review.id] ?? false}
                onToggleComments={() => h.toggleComments(review.id)}
                onLike={() => h.handleLike(review)}
                onSave={() => {}}
                onVote={h.handleVote}
                onMenuToggle={(id) =>
                  h.setOpenMenu(h.openMenu === id ? null : id)
                }
                onEdit={() => h.startEdit(review)}
                onDelete={() => h.handleDeleteReview(review.id)}
                onReport={() => h.handleReport(review.id)}
                onEditChange={h.setEditContent}
                onCancelEdit={h.cancelEdit}
                onSaveEdit={() => h.handleSaveEdit(review.id)}
                onCommentSubmit={h.handleCommentSubmit}
                disabled={h.actionLoading[review.id]}
              />
            ))}
          </div>
        )}

        {h.totalPages > 1 && (
          <div className="mb-8 mt-10">
            <Pagination
              page={h.page}
              totalPages={h.totalPages}
              onPageChange={h.setPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
