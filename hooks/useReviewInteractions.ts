"use client";

import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/models/User";
import {
  PaginatedComments,
  PaginatedReviews,
  Review,
  ReviewWithMedia,
} from "@/models/Review";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function useReviewInteractions() {
  const { accessToken, loading:authLoading } = useAuth();

  // =========================================================
  // Reviews
  // =========================================================

  const [reviewsData, setReviewsData] =
    useState<PaginatedReviews | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // Pagination
  // =========================================================

  const [page, setPage] = useState(1);

  const limit = 20;

  // =========================================================
  // Filters
  // =========================================================

  const [search, setSearchState] = useState("");
  const [mediaType, setMediaTypeState] = useState<
    "all" | "movie" | "tv"
  >("all");

  const [sort, setSortState] = useState<
    "newest" | "popular" | "discussed" | "highest_rated"
  >("newest");

  const [ratingFilter, setRatingFilterState] =
    useState<number | null>(null);

  // =========================================================
  // UI states
  // =========================================================

  const [expandedComments, setExpandedComments] =
    useState<Record<string, boolean>>({});

  const [comments, setComments] =
    useState<Record<string, Review[]>>({});

  const [commentsLoading, setCommentsLoading] =
    useState<Record<string, boolean>>({});

  const [commentSubmitting, setCommentSubmitting] =
    useState<Record<string, boolean>>({});

  const [actionLoading, setActionLoading] =
    useState<Record<string, boolean>>({});

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [editingReview, setEditingReview] =
    useState<string | null>(null);

  const [editContent, setEditContent] = useState("");

  // =========================================================
  // Helpers
  // =========================================================

  const hasFilters =
    search.trim() !== "" ||
    mediaType !== "all" ||
    sort !== "newest" ||
    ratingFilter !== null;

  // =========================================================
  // Filter setters
  //
  // Important:
  // যখন media/rating/sort change করবে,
  // page automatically 1 হয়ে যাবে।
  // =========================================================

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  const setMediaType = useCallback(
    (value: "all" | "movie" | "tv") => {
      setMediaTypeState(value);
      setPage(1);
    },
    [],
  );

  const setSort = useCallback(
    (
      value:
        | "newest"
        | "popular"
        | "discussed"
        | "highest_rated",
    ) => {
      setSortState(value);
      setPage(1);
    },
    [],
  );

  const setRatingFilter = useCallback(
    (value: number | null) => {
      setRatingFilterState(value);
      setPage(1);
    },
    [],
  );

  // =========================================================
  // Fetch reviews
  // =========================================================

  const fetchAllReviews = useCallback(
    async (pageNum: number) => {
      if (authLoading) {
        return;
      }

      if (!accessToken) {
        setReviewsData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await api.get<PaginatedReviews>("/reviews", {
            params: {
              page: pageNum,
              limit,

              search:
                search.trim() || undefined,

              media_type:
                mediaType === "all"
                  ? undefined
                  : mediaType,

              sort,

              min_rating:
                ratingFilter ?? undefined,
            },

            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

        setReviewsData(response.data);
      } catch (err) {
        const axiosError =
          err as AxiosError<ErrorResponse>;

        const message =
          axiosError.response?.data?.message ??
          axiosError.message ??
          "Failed to load reviews";

        setError(message);

        console.error(
          "Failed to fetch reviews:",
          err,
        );
      } finally {
        setLoading(false);
      }
    },
    [
      accessToken,
      authLoading,
      search,
      mediaType,
      sort,
      ratingFilter,
    ],
  );

  // =========================================================
  // Auto fetch
  // =========================================================

  useEffect(() => {
    if (authLoading || !accessToken) {
      return;
    }
  
    let cancelled = false;
  
    const loadReviews = async () => {
      if (cancelled) {
        return;
      }
  
      await fetchAllReviews(page);
    };
  
    loadReviews();
  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  
    return () => {
      cancelled = true;
    };
  }, [
    page,
    authLoading,
    accessToken,
    fetchAllReviews,
  ]);

  // =========================================================
  // Apply filters
  // =========================================================

  const applyFilters = useCallback(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    fetchAllReviews(1);
  }, [page, fetchAllReviews]);

  // =========================================================
  // Clear filters
  // =========================================================

  const clearFilters = useCallback(() => {
    setSearchState("");
    setMediaTypeState("all");
    setSortState("newest");
    setRatingFilterState(null);
    setPage(1);
  }, []);

  // =========================================================
  // Vote
  // =========================================================

  const handleVote = useCallback(
    async (
      reviewId: string,
      vote: "up" | "down",
    ) => {
      const review =
        reviewsData?.reviews.find(
          (r) => r.id === reviewId,
        );

      if (!review || !accessToken) {
        return;
      }

      const previousVote = review.user_vote;
      const sameVote = previousVote === vote;

      // --------------------------
      // Optimistic update
      // --------------------------

      setReviewsData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          reviews: prev.reviews.map((r) => {
            if (r.id !== reviewId) {
              return r;
            }

            return {
              ...r,

              user_vote: sameVote
                ? null
                : vote,

              upvotes:
                previousVote === "up"
                  ? Math.max(0, r.upvotes - 1)
                  : vote === "up"
                    ? r.upvotes + 1
                    : r.upvotes,

              downvotes:
                previousVote === "down"
                  ? Math.max(0, r.downvotes - 1)
                  : vote === "down"
                    ? r.downvotes + 1
                    : r.downvotes,
            };
          }),
        };
      });

      try {
        if (sameVote) {
          await api.delete(
            `/reviews/${reviewId}/vote`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        } else {
          await api.post(
            `/reviews/${reviewId}/vote`,
            { vote },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        }
      } catch (err) {
        // --------------------------
        // Rollback
        // --------------------------

        setReviewsData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            reviews: prev.reviews.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    user_vote: previousVote,
                    upvotes: review.upvotes,
                    downvotes: review.downvotes,
                  }
                : r,
            ),
          };
        });

        console.error(
          "Vote failed:",
          err,
        );
      }
    },
    [reviewsData, accessToken],
  );

  // =========================================================
  // Like
  // =========================================================

  const handleLike = useCallback(
    async (review: ReviewWithMedia) => {
      if (!accessToken) {
        return;
      }

      const previousLiked =
        review.user_liked;

      const previousCount =
        review.like_count;

      // Optimistic
      setReviewsData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === review.id
              ? {
                  ...r,
                  user_liked: !previousLiked,
                  like_count: previousLiked
                    ? Math.max(
                        0,
                        previousCount - 1,
                      )
                    : previousCount + 1,
                }
              : r,
          ),
        };
      });

      try {
        if (previousLiked) {
          await api.delete(
            `/reviews/${review.id}/like`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        } else {
          await api.post(
            `/reviews/${review.id}/like`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        }
      } catch (err) {
        // Rollback
        setReviewsData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            reviews: prev.reviews.map((r) =>
              r.id === review.id
                ? {
                    ...r,
                    user_liked:
                      previousLiked,
                    like_count:
                      previousCount,
                  }
                : r,
            ),
          };
        });

        console.error(
          "Like failed:",
          err,
        );
      }
    },
    [accessToken],
  );

  // =========================================================
  // Delete review
  // =========================================================

  const handleDeleteReview =
    useCallback(
      async (reviewId: string) => {
        if (!accessToken) {
          return;
        }

        if (
          !window.confirm(
            "Delete this review?",
          )
        ) {
          return;
        }

        setActionLoading((prev) => ({
          ...prev,
          [reviewId]: true,
        }));

        try {
          await api.delete(
            `/reviews/${reviewId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          setReviewsData((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              reviews: prev.reviews.filter(
                (review) =>
                  review.id !== reviewId,
              ),
              total: Math.max(
                0,
                prev.total - 1,
              ),
            };
          });
        } catch (err) {
          console.error(
            "Delete failed:",
            err,
          );
        } finally {
          setActionLoading((prev) => ({
            ...prev,
            [reviewId]: false,
          }));
        }
      },
      [accessToken],
    );

  // =========================================================
  // Edit
  // =========================================================

  const startEdit = useCallback(
    (review: ReviewWithMedia) => {
      setEditingReview(review.id);
      setEditContent(review.content);
      setOpenMenu(null);
    },
    [],
  );

  const cancelEdit = useCallback(() => {
    setEditingReview(null);
    setEditContent("");
  }, []);

  const handleSaveEdit = useCallback(
    async (reviewId: string) => {
      if (!accessToken) {
        return;
      }

      const content =
        editContent.trim();

      if (!content) {
        return;
      }

      setActionLoading((prev) => ({
        ...prev,
        [reviewId]: true,
      }));

      try {
        const response =
          await api.patch<ReviewWithMedia>(
            `/reviews/${reviewId}`,
            { content },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

        setReviewsData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            reviews: prev.reviews.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    content:
                      response.data.content,
                    updated_at:
                      response.data.updated_at,
                  }
                : r,
            ),
          };
        });

        cancelEdit();
      } catch (err) {
        console.error(
          "Edit failed:",
          err,
        );
      } finally {
        setActionLoading((prev) => ({
          ...prev,
          [reviewId]: false,
        }));
      }
    },
    [
      accessToken,
      editContent,
      cancelEdit,
    ],
  );

  // =========================================================
  // Report
  // =========================================================

  const handleReport = useCallback(
    async (reviewId: string) => {
      if (!accessToken) {
        return;
      }

      const reason =
        window.prompt(
          "Why are you reporting this review?",
        );

      if (!reason?.trim()) {
        return;
      }

      try {
        await api.post(
          `/reviews/${reviewId}/report`,
          {
            reason: reason.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setOpenMenu(null);

        window.alert(
          "Thanks. The review has been reported.",
        );
      } catch (err) {
        console.error(
          "Report failed:",
          err,
        );
      }
    },
    [accessToken],
  );

  // =========================================================
  // Comments
  // =========================================================

  const toggleComments = useCallback(
    async (reviewId: string) => {
      if (!accessToken) {
        return;
      }

      const opened =
        !expandedComments[reviewId];

      setExpandedComments((prev) => ({
        ...prev,
        [reviewId]: opened,
      }));

      if (
        !opened ||
        comments[reviewId]
      ) {
        return;
      }

      setCommentsLoading((prev) => ({
        ...prev,
        [reviewId]: true,
      }));

      try {
        const response =
          await api.get<PaginatedComments>(
            `/reviews/${reviewId}/comments`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

        setComments((prev) => ({
          ...prev,
          [reviewId]:
            response.data.comments,
        }));
      } catch (err) {
        console.error(
          "Failed to load comments:",
          err,
        );
      } finally {
        setCommentsLoading((prev) => ({
          ...prev,
          [reviewId]: false,
        }));
      }
    },
    [
      expandedComments,
      comments,
      accessToken,
    ],
  );

  // =========================================================
  // Submit comment
  // =========================================================

  const handleCommentSubmit =
    useCallback(
      async (
        reviewId: string,
        text: string,
      ) => {
        if (!accessToken) {
          return;
        }

        const content =
          text.trim();

        if (!content) {
          return;
        }

        setCommentSubmitting((prev) => ({
          ...prev,
          [reviewId]: true,
        }));

        try {
          await api.post(
            `/reviews/${reviewId}/comments`,
            { content },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const response =
            await api.get<PaginatedComments>(
              `/reviews/${reviewId}/comments`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

          setComments((prev) => ({
            ...prev,
            [reviewId]:
              response.data.comments,
          }));

          setReviewsData((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              reviews: prev.reviews.map(
                (review) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        comment_count:
                          review.comment_count +
                          1,
                      }
                    : review,
              ),
            };
          });
        } catch (err) {
          console.error(
            "Comment failed:",
            err,
          );
        } finally {
          setCommentSubmitting(
            (prev) => ({
              ...prev,
              [reviewId]: false,
            }),
          );
        }
      },
      [accessToken],
    );

  // =========================================================
  // Return
  // =========================================================

  return {
    reviewsData,
    reviews:
      reviewsData?.reviews ?? [],

    loading,
    error,

    page,
    setPage,

    total:
      reviewsData?.total ?? 0,

    totalPages:
      reviewsData?.total_pages ?? 1,

    search,
    setSearch,

    mediaType,
    setMediaType,

    sort,
    setSort,

    ratingFilter,
    setRatingFilter,

    hasFilters,

    applyFilters,
    clearFilters,
    fetchAllReviews,

    handleVote,
    handleLike,
    handleDeleteReview,

    handleSaveEdit:
      handleSaveEdit,

    handleReport,

    editingReview,
    editContent,
    setEditContent,

    startEdit,
    cancelEdit,

    expandedComments,
    toggleComments,
    handleCommentSubmit,

    comments,
    commentsLoading,
    commentSubmitting,

    openMenu,
    setOpenMenu,

    actionLoading,
  };
}