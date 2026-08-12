export interface Genre {
	id: number;
	name: string;
	created_at?: string;
	updated_at?: string;
}

export interface MovieVideo {
	id: string;
	movie_id: number;
	iso_639_1: string | null;
	iso_3166_1: string | null;
	name: string;
	key: string;
	site: string;
	size: number | null;
	type: string;
	official: boolean;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface Movie {
	id: number;
	title: string;
	original_language: string;
	original_title: string;
	overview: string | null;
	release_date: string | null;
	popularity: number;
	vote_average: number;
	vote_count: number;
	poster_path: string | null;
	backdrop_path: string | null;
	adult: boolean;
	genre_ids: number[];
	genres?: Genre[];
	softcore: boolean;
	video: boolean;
	movie_trailers?: MovieVideo[] | null;
	created_at: string;
	updated_at: string;
}

export interface SingleMovieResponse {
	movies: Movie | null;
}

export interface MovieVideosResponse {
	videos: MovieVideo[];
}

export interface PaginatedMovieResponse<T = Movie> {
	page: number;
	limit: number;
	movies: T[];
	total_pages?: number;
}
export interface PaginatedCreditResponse<T = MovieCredit> {
	page: number;
	limit: number;
	credits: T[];
	total_pages?: number;
}
export interface PaginatedVideoResponse<T = MovieVideo> {
	page: number;
	limit: number;
	videos: T[];
	total_pages?: number;
	total_videos?: number;
}

export type CreditType = "cast" | "crew";
export type VideoType = "Trailer" | "Teaser";

export interface MovieCredit {
	id: number;
	movie_id: number;
	person_id: number;
	role: string;
	type: CreditType;
	order: number;
	department?: string | null;
	person_name: string;
	person_profile_path: string | null;
}

export interface Person {
	id: number;
	name: string;
	profile_path?: string | null;
	popularity?: number | null;
	known_for_department?: string | null;
	created_at?: string;
	updated_at?: string;
}
