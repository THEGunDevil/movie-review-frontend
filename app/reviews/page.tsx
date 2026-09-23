"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { useReviewInteractions } from "@/hooks/useReviewInteractions";
import { ErrorState } from "@/components/ErrorState";
import FilterBar from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { ReviewCard } from "@/components/ReviewCard";
import { TopReviewBanner } from "@/components/TopBannerReview";
import { ReviewCardSkeleton } from "@/components/ReviewCardSkeleton";

export default function ReviewsPage() {
  const h = useReviewInteractions();
  // Initial loading
  if (!h.reviewsData) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 animate-pulse">
            <div className="h-10 w-72 rounded-lg bg-slate-900" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-900" />
          </div>

          <div className="mb-8 h-36 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60" />

          <div className="space-y-4 xl:max-w-4xl">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <ReviewCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (h.error && !h.reviewsData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <ErrorState message={h.error} onRetry={h.applyFilters} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                  Community Reviews
                </h1>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                  {h.total} reviews
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Honest opinions from people who watched it. Discover what the
                community is watching, loving, and talking about.
              </p>
            </div>

            <Link href="/movies" className="shrink-0">
              <Button className="h-11 w-full gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 sm:w-auto">
                <Plus className="h-4 w-4" />
                Write a Review
              </Button>
            </Link>
          </div>
        </header>

        {/* Filter */}
        <div className="mb-8">
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
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Feed */}
          <section className="min-w-0">
            {h.loading && h.reviewsData && (
              <div className="mb-4 flex justify-center">
                <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                  Updating reviews...
                </div>
              </div>
            )}

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
                    editContent={
                      h.editingReview === review.id ? h.editContent : ""
                    }
                    isSaving={h.actionLoading[review.id] ?? false}
                    menuOpen={h.openMenu === review.id}
                    comments={h.comments[review.id] ?? []}
                    commentsLoading={h.commentsLoading[review.id] ?? false}
                    commentSubmitting={h.commentSubmitting[review.id] ?? false}
                    onToggleComments={() => h.toggleComments(review.id)}
                    onLike={() => h.handleLike(review)}
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
                    disabled={h.actionLoading[review.id] ?? false}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {h.totalPages > 1 && (
              <div className="mt-10 border-t border-slate-900 pt-6">
                <Pagination
                  page={h.page}
                  totalPages={h.totalPages}
                  onPageChange={h.setPage}
                />
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="hidden space-y-5 xl:block">
            <TopReviewBanner period="week" />

            <TopReviewBanner period="month" />

            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Community Stats
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Reviews</p>

                  <p className="mt-1 text-xl font-bold text-white">{h.total}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Pages</p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {h.totalPages}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
