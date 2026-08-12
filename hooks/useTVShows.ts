"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/models/user";
import { PaginatedTVShowsResponse, TVShow } from "@/models/TVShow";
import { GoToPage } from "@/lib/helpers";

export function useTVShows() {
  const [tvShowsData, setTVShowsData] = useState<{
    data: PaginatedTVShowsResponse<TVShow> | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const [singleTVShowData, setSingleTVShowData] = useState<{
    data: TVShow | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const [genreTVShowsData, setGenreTVShowsData] = useState<{
    data: PaginatedTVShowsResponse<TVShow> | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const [searchData, setSearchData] = useState<{
    data: PaginatedTVShowsResponse<TVShow> | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: false, error: null });

  const { page } = GoToPage();
  const limit = 30;

  // ✅ Search TV shows
  const fetchSearchResults = useCallback(
    async (query: string, pageNum?: number) => {
      const currentPage = pageNum ?? 1;
      setSearchData({ data: null, loading: true, error: null });
      try {
        const response = await axios.get<PaginatedTVShowsResponse<TVShow>>(
          `${process.env.NEXT_PUBLIC_API_URL}/tv_shows/search`,
          { params: { q: query, page: currentPage, limit } }
        );
        setSearchData({ data: response.data, loading: false, error: null });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        setSearchData({
          data: null,
          loading: false,
          error: axiosErr.response?.data?.message ?? axiosErr.message,
        });
      }
    },
    []
  );

  // ✅ Fetch all TV shows
  const fetchTVShows = useCallback(
    async (pageNum?: number) => {
      const currentPage = pageNum ?? page;
      setTVShowsData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await axios.get<PaginatedTVShowsResponse<TVShow>>(
          `${process.env.NEXT_PUBLIC_API_URL}/tv_shows`,
          { params: { page: currentPage, limit } }
        );
        setTVShowsData({ data: response.data, loading: false, error: null });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ?? axiosErr.message ?? "Something went wrong";
        setTVShowsData({ data: null, loading: false, error: message });
      }
    },
    [page, limit]
  );

  // ✅ Fetch single TV show
  const fetchSingleTVShow = useCallback(async (id: string) => {
    setSingleTVShowData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get<TVShow>(
        `${process.env.NEXT_PUBLIC_API_URL}/tv_shows/tv_show/${id}`
      );
      setSingleTVShowData((prev) => ({ ...prev, data: response.data }));
    } catch (err) {
      const axiosErr = err as AxiosError<ErrorResponse>;
      const message =
        axiosErr.response?.data?.message ?? axiosErr.message ?? "Something went wrong";
      setSingleTVShowData((prev) => ({ ...prev, error: message }));
    } finally {
      setSingleTVShowData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // ✅ Fetch TV shows by genre
  const fetchGenreTVShows = useCallback(
    async (pageNum: number, genreId: string | number) => {
      const currentPage = pageNum ?? page;
      setGenreTVShowsData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await axios.get<PaginatedTVShowsResponse<TVShow>>(
          `${process.env.NEXT_PUBLIC_API_URL}/tv_shows/genre/${genreId}`,
          { params: { page: currentPage, limit } }
        );
        setGenreTVShowsData({ data: response.data, loading: false, error: null });
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const message =
          axiosErr.response?.data?.message ?? axiosErr.message ?? "Something went wrong";
        setGenreTVShowsData({ data: null, loading: false, error: message });
      }
    },
    [limit]
  );

  return {
    tvShowsData,
    genreTVShowsData,
    singleTVShowData,
    searchData,
    page,
    limit,
    fetchSearchResults,
    fetchTVShows,
    fetchSingleTVShow,
    fetchGenreTVShows,
  };
}