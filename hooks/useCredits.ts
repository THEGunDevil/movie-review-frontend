import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import type { PaginatedCreditResponse } from "@/models/movie";

interface CreditsState {
  data: PaginatedCreditResponse | null;
  loading: boolean;
  error: string | null;
}

export default function useCredits() {
  const [creditsData, setCreditsData] = useState<CreditsState>({
    data: null,
    loading: false,
    error: null,
  });

  const limit = 10;

  const fetchCredits = useCallback(
    async (
      id: number,
      type: string,
      pageNum: number = 1
    ) => {
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
              limit,
              page: pageNum,
            },
          }
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
    []
  );

  const refetchCredits = useCallback(
    (
      id: number,
      type: string,
      pageNum: number = 1
    ) => {
      return fetchCredits(id, type, pageNum);
    },
    [fetchCredits]
  );

  return {
    creditsData,
    fetchCredits,
    refetchCredits,
  };
}

