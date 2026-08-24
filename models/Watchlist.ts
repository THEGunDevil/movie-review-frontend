export interface WatchlistItem {
  id: string;                  // UUID
  media_id: number;
  media_type: "movie" | "tv";
  media_title: string;         // backend থেকে আসছে media_title
  media_poster_path: string | null;
  added_at: string;
}
export interface PaginatedWatchlistResponse<W = WatchlistItem> {
  page: number;
  limit: number;
  total_pages: number;
  total_reviews: number;
  watchlist: W[];
}