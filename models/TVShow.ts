export interface TVShow {
  id: number;                     // BIGINT
  name: string;
  original_name: string;
  overview: string | null;
  original_language: string;
  origin_country: string[];       // array of country codes
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string | null;  // ISO date string
  last_air_date: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  in_production: boolean;
  number_of_seasons: number;
  number_of_episodes: number;
  genre_ids: number[];            // array of genre IDs
  status: string | null;
  type: string | null;
  created_at: string;             // ISO timestamp
  updated_at: string;
}
export interface TVSeason {
  id: number;                     // BIGINT
  tv_id: number;                  // FK to tv_shows
  season_number: number;
  name: string;
  overview: string | null;
  air_date: string | null;        // ISO date string
  poster_path: string | null;
  episode_count: number;
  vote_average: number;           // NUMERIC(3,1) – could be number or string, but number is fine
  created_at: string;
  updated_at: string;
}
export interface TVEpisode {
  id: number;                     // BIGINT
  tv_id: number;
  season_id: number;
  name: string;
  overview: string | null;
  episode_number: number;
  season_number: number;
  air_date: string | null;        // ISO date string
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;         // minutes
  created_at: string;
  updated_at: string;
}
// models/TVShow.ts
export interface PaginatedTVShowsResponse<T = TVShow> {
  page: number;
  limit: number;
  tv_shows: T[];          // ✅ Changed from `movies`
  total_pages?: number;
}