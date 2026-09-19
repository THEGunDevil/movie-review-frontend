"use client";

import { useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";

import { PaginatedWatchlistResponse, WatchlistItem } from "@/models/Watchlist";
import { ErrorResponse } from "@/models/User";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface WatchlistState {
  data: WatchlistItem[];
  loading: boolean;
  error: string | null;
}

function useWatchList() {
  const [watchList, setWatchList] = useState<WatchlistState>({
    data: [],
    loading: false,
    error: null,
  });
  const { accessToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    return instance;
  }, [accessToken]);
  // =========================================================
  // Add movie to watchlist
  // =========================================================
  const addMovieToWatchlist = useCallback(async (movieId: number) => {
    if (!accessToken) {
      toast.warning(
        "Please sign in to add to movies or TV shows to your watch list.",
        { position: "top-center" },
      );
      return;
    }
    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.post<WatchlistItem>(
        "/watchlist",
        {
          movie_id: movieId,
        }
      );

      setWatchList((prev) => ({
        ...prev,
        data: [...prev.data, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Failed to add movie to watchlist";

      setWatchList((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      toast.error(message, { position: "bottom-center" });
      throw error;
    }
  }, [accessToken, api]);

  // =========================================================
  // Add TV show to watchlist
  // =========================================================
  const addTVToWatchlist = useCallback(async (tvId: number) => {
    if (!accessToken) {
      toast.warning(
        "Please sign in to add to movies or TV shows to your watch list.",
        { position: "top-center" },
      );
      return;
    }
    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.post<WatchlistItem>(
        "/watchlist",
        {
          tv_id: tvId,
        }
      );

      setWatchList((prev) => ({
        ...prev,
        data: [...prev.data, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Failed to add TV show to watchlist";

      setWatchList((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      toast.error(message, { position: "bottom-center" });

      throw error;
    }
  }, [accessToken, api]);
  const fetchMyWatchlist = useCallback(async () => {
    if (!accessToken) {
      setWatchList({
        data: [],
        loading: false,
        error: null,
      });

      return;
    }

    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await api.get<PaginatedWatchlistResponse>("/watchlist");

      setWatchList({
        data: response.data.watchlist,
        loading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Failed to load watchlist.";

      setWatchList((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));

      toast.error(message, {
        position: "bottom-center",
      });

      throw error;
    }
  }, [accessToken, api]);
  // =========================================================
  // Remove movie
  // =========================================================
  const removeMovieFromWatchlist = useCallback(async (movieId: number) => {
    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      await api.delete(`/watchlist/movie/${movieId}`);

      setWatchList((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item.media_id !== movieId),
        loading: false,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Failed to remove movie";

      setWatchList((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, [accessToken, api]);

  // =========================================================
  // Remove TV show
  // =========================================================
  const removeTVFromWatchlist = useCallback(async (tvId: number) => {
    setWatchList((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      await api.delete(`/watchlist/tv/${tvId}`);

      setWatchList((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item.media_id !== tvId),
        loading: false,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Failed to remove TV show";

      setWatchList((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, [accessToken, api]);

  // =========================================================
  // Check movie
  // =========================================================
  const isMovieInWatchlist = useCallback(
    async (movieId: number) => {
      if (!accessToken) {
        return false;
      }

      try {
        const response = await api.get<{
          in_watchlist: boolean;
        }>(`/watchlist/movie/${movieId}`);

        return response.data.in_watchlist;
      } catch (error) {
        console.error("Failed to check movie watchlist:", error);
        return false;
      }
    },
    [accessToken, api],
  );

  // =========================================================
  // Check TV
  // =========================================================
  const isTVInWatchlist = useCallback(
    async (tvId: number) => {
      if (!accessToken) {
        return false;
      }

      try {
        const response = await api.get<{
          in_watchlist: boolean;
        }>(`/watchlist/tv/${tvId}`);

        return response.data.in_watchlist;
      } catch (error) {
        console.error("Failed to check TV watchlist:", error);
        return false;
      }
    },
    [accessToken, api],
  );

  // =========================================================
  // Clear error
  // =========================================================
  const clearError = useCallback(() => {
    setWatchList((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    watchList: watchList.data,
    loading: watchList.loading,
    error: watchList.error,
    fetchMyWatchlist,

    addMovieToWatchlist,
    addTVToWatchlist,

    removeMovieFromWatchlist,
    removeTVFromWatchlist,

    isMovieInWatchlist,
    isTVInWatchlist,

    clearError,
  };
}

export default useWatchList;
