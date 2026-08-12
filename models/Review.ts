export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  content: string;
  contains_spoilers: boolean;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  profile_picture: string;
}
export interface PaginatedReviewResponse<R = Review> {
  page: number;
  limit: number;
  total_pages: number;
  total_reviews: number;
  reviews: R[];
}
export type MediaType = "movie" | "tv";
export type VoteType = "up" | "down" | null;
export type SortType = "newest" | "popular" | "discussed" | "highest_rated";

export interface ReviewWithMedia {
  id: string;
  rating: number;
  content: string;
  contains_spoilers: boolean;
  created_at: string;
  updated_at?: string;
  user_id: string;
  user_name: string;
  user_profile_picture: string | null;
  media_id: number;
  media_title: string;
  media_type: MediaType;
  media_poster_path: string | null;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  like_count: number;
  view_count: number;
  user_vote: VoteType;
  user_liked: boolean;
  user_saved: boolean;
}

export interface PaginatedReviews {
  page: number;
  limit: number;
  reviews: ReviewWithMedia[];
  total_pages: number;
  total: number;
}
export interface PaginatedComments {
  comments: Review[];
  total: number;
}
