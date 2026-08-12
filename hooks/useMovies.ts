"use client";

import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  Genre,
  Movie,
  PaginatedMovieResponse,
} from "@/models/movie";
import { ErrorResponse } from "@/models/user";
import { GoToPage } from "@/lib/helpers";
export function useMovies() {
  const [movieData, setMovieData] = useState<{
    data: PaginatedMovieResponse<Movie> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const [genreData, setGenreData] = useState<{
    data: Genre[];
    loading: boolean;
    error: string | null;
  }>({
    data: [],
    loading: false,
    error: null,
  });
  const [singleMovieData, setSingleMovieData] = useState<{
    data: Movie | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  const [genreMoviesData, setGenreMoviesData] = useState<{
    data: PaginatedMovieResponse<Movie> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  const [searchData, setSearchData] = useState<{
    data: PaginatedMovieResponse<Movie> | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  const {page} = GoToPage()
  const limit = 30;
  const fetchSearchResults = useCallback(
    async (query: string, pageNum?: number) => {
      const currentPage = pageNum ?? 1;
      setSearchData({ data: null, loading: true, error: null });
      try {
        const response = await axios.get<PaginatedMovieResponse<Movie>>(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/search`,
          { params: { q: query, page: currentPage, limit } },
        );
        setSearchData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        setSearchData({
          data: null,
          loading: false,
          error: axiosErr.response?.data?.message ?? axiosErr.message,
        });
      }
    },
    [],
  );
  const fetchMovies = useCallback(
    async (pageNum?: number) => {
      const currentPage = pageNum ?? page;
      setMovieData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      try {
        const response = await axios.get<PaginatedMovieResponse<Movie>>(
          `${process.env.NEXT_PUBLIC_API_URL}/movies`,
          {
            params: {
              page: currentPage,
              limit,
            },
          },
        );
        setMovieData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";

        setMovieData({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    [page, limit],
  );

  const fetchGenres = useCallback(async () => {
    setGenreData((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.get<Genre[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/genre`,
      );
      setGenreData((prev) => ({
        ...prev,
        data: response.data,
      }));
    } catch (err) {
      const axiosErr = err as AxiosError<ErrorResponse>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        "Something went wrong";
      setGenreData((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setGenreData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);
  const fetchSingleMovie = useCallback(async (id: string) => {
    setSingleMovieData((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.get<Movie | null>(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/movie/${id}`,
      );
      setSingleMovieData((prev) => ({
        ...prev,
        data: response.data,
      }));
    } catch (err) {
      const axiosErr = err as AxiosError<ErrorResponse>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        "Something went wrong";
      setSingleMovieData((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setSingleMovieData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);
  const fetchGenreMovies = useCallback(
    async (pageNum: number, query: string | number) => {
      const currentPage = pageNum ?? page;
      setGenreMoviesData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      try {
        const response = await axios.get<PaginatedMovieResponse<Movie>>(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/genre/${query}`,
          {
            params: {
              page: currentPage,
              limit,
            },
          },
        );
        setGenreMoviesData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";

        setGenreMoviesData({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    [limit],
  );
  const refetchMovies = useCallback(() => {
    fetchMovies(page);
  }, [fetchMovies, page]);

  const refetchGenreMovies = useCallback(
    (genreId: string | number) => {
      fetchGenreMovies(page, genreId);
    },
    [fetchGenreMovies, page],
  );

  const refetchGenre = useCallback(() => {
    fetchGenres();
  }, [fetchGenres]);
  const refetchSingleMovieData = useCallback(
    (movieID: string) => {
      fetchSingleMovie(movieID);
    },
    [fetchSingleMovie],
  );

  return {
    movieData,
    genreData,
    singleMovieData,
    genreMoviesData,
    page,
    limit,
    searchData,
    fetchSearchResults,
    fetchGenres,
    fetchMovies,
    fetchSingleMovie,
    fetchGenreMovies,
    refetchMovies,
    refetchGenreMovies,
    refetchGenre,
    refetchSingleMovieData,
  };
}
