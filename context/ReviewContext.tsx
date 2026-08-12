// context/ReviewContext.tsx
"use client";

import { useState, useCallback, useContext, createContext } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/models/user";
import { PaginatedReviewResponse, Review } from "@/models/Review";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

function useReviewsInternal() {
  const [reviewData, setReviewData] = useState<{
    data: PaginatedReviewResponse<Review> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const [edit, setEdit] = useState<{
    editComment: string;
    editRating: number;
    editingId: string | null;
  }>({
    editComment: "",
    editRating: 5,
    editingId: null,
  });

  // Store the current media type and ID for refetching after edit
  const [currentMedia, setCurrentMedia] = useState<{
    id: string;
    type: "movie" | "tv";
  }>({ id: "", type: "movie" });

  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const { accessToken } = useAuth();

  // Fetch reviews for a movie or TV show
  const fetchReviews = useCallback(
    async (
      mediaID: string,
      pageNum: number,
      mediaType: "movie" | "tv" = "movie",
    ) => {
      if (!mediaID) {
        toast.error("Invalid media ID");
        return;
      }

      setCurrentMedia({ id: mediaID, type: mediaType });
      setReviewData((prev) => ({ ...prev, loading: true }));

      const base = `${process.env.NEXT_PUBLIC_API_URL}/`;
      const endpoint =
        mediaType === "movie"
          ? `movies/movie/${mediaID}/reviews`
          : `tv_shows/tv_show/${mediaID}/reviews`;

      try {
        const response = await axios.get<PaginatedReviewResponse<Review>>(
          `${base}${endpoint}`,
          { params: { page: pageNum, limit: 30 } },
        );
        setReviewData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        setReviewData((prev) => ({
          ...prev,
          error:
            error.response?.data?.message ??
            error.message ??
            "Something went wrong",
        }));
        setReviewData((prev) => ({ ...prev, loading: false }));
      }
    },
    [accessToken],
  );

  // Add a review (movie or TV)
  const handleAddReview = useCallback(
    async (
      event: React.FormEvent,
      mediaID: string,
      pageNum: number,
      mediaType: "movie" | "tv",
    ) => {
      event.preventDefault();
      if (!newComment.trim()) return;

      const base = `${process.env.NEXT_PUBLIC_API_URL}/`;
      const endpoint =
        mediaType === "movie"
          ? `movies/movie/${mediaID}/reviews`
          : `tv_shows/tv_show/${mediaID}/reviews`;

      try {
        await axios.post(
          `${base}${endpoint}`,
          {
            rating: newRating,
            content: newComment.trim(),
            contains_spoilers: false,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        setNewComment("");
        setNewRating(5);
        await fetchReviews(mediaID, pageNum, mediaType);
        toast.success("Review added successfully!");
      } catch (error) {
        console.error("Failed to add review:", error);
        toast.error("Failed to add review. Please try again.");
      }
    },
    [newComment, newRating, accessToken, fetchReviews],
  );

  // Delete a review (works for both, ID is unique)
  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        setReviewData((prev) => {
          if (!prev?.data) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              reviews: prev.data.reviews.filter(
                (review) => review.id !== reviewId,
              ),
            },
          };
        });
        await fetchReviews(currentMedia.id, 1, currentMedia.type);
        toast.success("Review deleted.");
      } catch (err) {
        console.error("Failed to delete review:", err);
        toast.error("Failed to delete review.");
      }
    },
    [accessToken],
  );

  // Update a review
  const handleSaveEdit = useCallback(
    async (reviewId: string, newRating: number, newContent: string) => {
      if (!newContent.trim()) return;

      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
          {
            rating: newRating,
            content: newContent.trim(),
            contains_spoilers: false,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        // Refetch the current page of the correct media type
        await fetchReviews(currentMedia.id, 1, currentMedia.type); // you may want to keep the page number instead of resetting
        toast.success("Review updated!");
      } catch (err) {
        console.error("Failed to update review:", err);
        toast.error("Could not update review. Please try again.");
      }
    },
    [accessToken, fetchReviews, currentMedia],
  );

  const refetchReviews = useCallback(
    (id: string, pageNum: number, mediaType: "movie" | "tv") => {
      fetchReviews(id, pageNum, mediaType);
    },
    [fetchReviews],
  );

  return {
    reviewData,
    fetchReviews,
    refetchReviews,
    handleAddReview,
    handleDeleteReview,
    handleSaveEdit,
    newComment,
    newRating,
    setNewComment,
    setNewRating,
    edit,
    setEdit,
    // expose currentMedia if needed
  };
}

const ReviewContext = createContext<ReturnType<
  typeof useReviewsInternal
> | null>(null);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const reviewState = useReviewsInternal();
  return (
    <ReviewContext.Provider value={reviewState}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context)
    throw new Error("useReviews must be used within a ReviewProvider");
  return context;
}
