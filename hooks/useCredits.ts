import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { CreditsState, PaginatedCreditResponse } from "@/models/Movie";

export default function useCredits() {
  const [creditsData, setCreditsData] = useState<CreditsState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchMovieCredits = useCallback(
    async (id: number, type: string, pageNum: number = 1) => {
      setCreditsData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await axios.get<PaginatedCreditResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/movie/movie_credits/${id}`,
          {
            params: {
              type,
              limit: "20",
              page: pageNum,
            },
          },
        );
        setCreditsData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<{
          message?: string;
        }>;

        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";

        console.error("Failed to fetch credits:", err);

        setCreditsData({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    [],
  );
  const fetchTVCredits = useCallback(
    async (id: number, type: string, pageNum: number = 1) => {
      setCreditsData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await axios.get<PaginatedCreditResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/tv_shows/tv_show/credits/${id}`,
          {
            params: {
              type,
              limit: "20",
              page: pageNum,
            },
          },
        );
        setCreditsData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<{
          message?: string;
        }>;

        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Something went wrong";

        console.error("Failed to fetch credits:", err);

        setCreditsData({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    [],
  );
  return {
    creditsData,
    fetchMovieCredits,
    fetchTVCredits,
  };
}
