"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/models/user";
import {
  PaginatedComments,
  PaginatedReviews,
  Review,
  ReviewWithMedia,
} from "@/models/Review";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Create the Axios instance once – outside the hook
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 2. We'll attach the interceptor only once, using a ref to always get the current token
let interceptorId: number | null = null;

export function useReviewInteractions() {
  const { accessToken } = useAuth();

  // Keep the token in a ref so the interceptor always reads the latest value
  const tokenRef = useRef(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  // 3. Attach the interceptor once (the first time the hook runs)
  if (interceptorId === null) {
    interceptorId = api.interceptors.request.use((config) => {
      const token = tokenRef.current;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Clean up when the hook unmounts (optional, but good practice)
  useEffect(() => {
    return () => {
      if (interceptorId !== null) {
        api.interceptors.request.eject(interceptorId);
        interceptorId = null; // allow re-attachment if hook re-mounts
      }
    };
  }, []);

  // ── core reviews data ──
  const [reviewsData, setReviewsData] = useState<PaginatedReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── pagination ──
  const [page, setPage] = useState(1);
  const limit = 20;

  // ── filters ──
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");
  const [sort, setSort] = useState<
    "newest" | "popular" | "discussed" | "highest_rated"
  >("newest");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // ── UI states ──
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [comments, setComments] = useState<Record<string, Review[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<
    Record<string, boolean>
  >({});
  const [commentSubmitting, setCommentSubmitting] = useState<
    Record<string, boolean>
  >({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // ── helpers ──
  const hasFilters =
    Boolean(search) ||
    mediaType !== "all" ||
    sort !== "newest" ||
    ratingFilter !== null;

  // ── fetch reviews ──
  const fetchAllReviews = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<PaginatedReviews>("/reviews", {
          params: {
            page: pageNum,
            limit,
            search: search.trim() || undefined,
            media_type: mediaType === "all" ? undefined : mediaType,
            sort,
            min_rating: ratingFilter ?? undefined,
          },
        });
        setReviewsData(response.data);
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        setError(
          axiosErr.response?.data?.message ??
            axiosErr.message ??
            "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    },
    // api is now stable (module‑level), no need to depend on it
    [search, mediaType, sort, ratingFilter, limit],
  );

  // refetch when page or filters change
  useEffect(() => {
    fetchAllReviews(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, fetchAllReviews]);

  // ── filter actions ──
  const applyFilters = () => {
    if (page !== 1) setPage(1);
    else fetchAllReviews(1);
  };
  const clearFilters = () => {
    setSearch("");
    setMediaType("all");
    setSort("newest");
    setRatingFilter(null);
    setPage(1);
  };

  // ── voting ──
  const handleVote = async (reviewId: string, vote: "up" | "down") => {
    const review = reviewsData?.reviews.find((r) => r.id === reviewId);
    if (!review) return;
    const prevVote = review.user_vote; // null, "up", or "down"
    const isSame = prevVote === vote;

    // ---- optimistic state update ----
    setReviewsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                user_vote: isSame ? null : vote,
                upvotes:
                  prevVote === "up"
                    ? r.upvotes - 1
                    : vote === "up"
                      ? r.upvotes + 1
                      : r.upvotes,
                downvotes:
                  prevVote === "down"
                    ? r.downvotes - 1
                    : vote === "down"
                      ? r.downvotes + 1
                      : r.downvotes,
              }
            : r,
        ),
      };
    });

    // ---- API call ----
    try {
      if (isSame) {
        await api.delete(`/reviews/${reviewId}/vote`);
      } else {
        await api.post(`/reviews/${reviewId}/vote`, { vote });
      }
    } catch (err) {
      // revert on error
      setReviewsData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  user_vote: prevVote,
                  upvotes: review.upvotes, // revert to original
                  downvotes: review.downvotes,
                }
              : r,
          ),
        };
      });
      console.error("Vote failed:", err);
    }
  };
  // ── like ──
const handleLike = async (review: ReviewWithMedia) => {
  const prevLiked = review.user_liked;
  const prevLikeCount = review.like_count;

  // Optimistic UI update
  setReviewsData((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      reviews: prev.reviews.map((r) =>
        r.id === review.id
          ? {
              ...r,
              user_liked: !prevLiked,
              like_count: prevLiked ? prevLikeCount - 1 : prevLikeCount + 1,
            }
          : r
      ),
    };
  });

  try {
    if (prevLiked) {
      await api.delete(`/reviews/${review.id}/like`);
    } else {
      await api.post(`/reviews/${review.id}/like`);
    }
    // Do NOT call fetchAllReviews here – optimistic state is enough
  } catch (err) {
    // Revert on error
    setReviewsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === review.id
            ? {
                ...r,
                user_liked: prevLiked,
                like_count: prevLikeCount,
              }
            : r
        ),
      };
    });
    console.error("Like failed:", err);
  }
};
  // ── delete ──
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Delete this review?")) return;
    setActionLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviewsData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reviews: prev.reviews.filter((r) => r.id !== reviewId),
        };
      });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // ── edit / startEdit / saveEdit / cancelEdit ──
  const startEdit = (review: ReviewWithMedia) => {
    setEditingReview(review.id);
    setEditContent(review.content);
    setOpenMenu(null);
  };
  const cancelEdit = () => {
    setEditingReview(null);
    setEditContent("");
  };
  const handleSaveEdit = async (reviewId: string) => {
    if (!editContent.trim()) return;
    setActionLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await api.patch<ReviewWithMedia>(
        `/reviews/${reviewId}`,
        { content: editContent.trim() },
      );
      setReviewsData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  content: response.data.content,
                  updated_at: response.data.updated_at,
                }
              : r,
          ),
        };
      });
      cancelEdit();
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // ── report ──
  const handleReport = async (reviewId: string) => {
    const reason = window.prompt("Why are you reporting this review?");
    if (!reason?.trim()) return;
    try {
      await api.post(`/reviews/${reviewId}/report`, {
        reason: reason.trim(),
      });
      setOpenMenu(null);
      alert("Thanks. The review has been reported.");
    } catch (err) {
      console.error("Report failed:", err);
    }
  };

  // ── comments: toggle, fetch, submit ──
  const toggleComments = async (reviewId: string) => {
    const opened = !expandedComments[reviewId];
    setExpandedComments((prev) => ({ ...prev, [reviewId]: opened }));
    if (opened && !comments[reviewId]) {
      setCommentsLoading((prev) => ({ ...prev, [reviewId]: true }));
      try {
        const res = await api.get<PaginatedComments>(
          `/reviews/${reviewId}/comments`,
        );
        setComments((prev) => ({
          ...prev,
          [reviewId]: res.data.comments,
        }));
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setCommentsLoading((prev) => ({ ...prev, [reviewId]: false }));
      }
    }
  };
const handleCommentSubmit = async (reviewId: string, text: string) => {
  if (!text.trim()) return;
  setCommentSubmitting((prev) => ({ ...prev, [reviewId]: true }));
  try {
    // 1. Post the comment
    await api.post(`/reviews/${reviewId}/comments`, {
      content: text.trim(),
    });

    // 2. Fetch the updated comment list (with user details)
    const res = await api.get<PaginatedComments>(
      `/reviews/${reviewId}/comments`
    );
    setComments((prev) => ({
      ...prev,
      [reviewId]: res.data.comments,
    }));

    // 3. Update the comment count on the review card
    setReviewsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId
            ? { ...r, comment_count: r.comment_count + 1 }
            : r
        ),
      };
    });
  } catch (err) {
    console.error("Comment failed:", err);
  } finally {
    setCommentSubmitting((prev) => ({ ...prev, [reviewId]: false }));
  }
};

  return {
    // data
    reviewsData,
    loading,
    error,
    page,
    totalPages: reviewsData?.total_pages ?? 1,
    reviews: reviewsData?.reviews ?? [],
    // filters
    search,
    setSearch,
    mediaType,
    setMediaType,
    sort,
    setSort,
    ratingFilter,
    setRatingFilter,
    applyFilters,
    clearFilters,
    hasFilters,
    // page
    setPage,
    // actions
    handleVote,
    handleLike,
    handleDeleteReview,
    handleSaveEdit,
    handleReport,
    // edit
    editingReview,
    editContent,
    setEditContent,
    startEdit,
    cancelEdit,
    // comments
    expandedComments,
    toggleComments,
    handleCommentSubmit,
    comments,
    commentsLoading,
    commentSubmitting,
    // UI
    openMenu,
    setOpenMenu,
    actionLoading,
  };
}
