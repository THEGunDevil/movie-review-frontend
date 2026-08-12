import { MovieVideo, PaginatedVideoResponse, VideoType } from "@/models/movie";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";

interface VideoState {
  data: PaginatedVideoResponse | null;
  loading: boolean;
  error: string | null;
}

export default function useVideos() {
  const [videoData, setVideoData] = useState<VideoState>({
    data: null,
    loading: false,
    error: null,
  });
  const fetchVideos = useCallback(
    async (id: number, type: VideoType, pageNum: number = 1) => {
      setVideoData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await axios.get<PaginatedVideoResponse<MovieVideo>>(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/movie/movie_videos/${id}`,
          {
            params: {
              type,
              limit: 5,
              page: pageNum,
            },
          },
        );

        setVideoData({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const axiosErr = err as AxiosError<{
          message?: string;
        }>;

        setVideoData({
          data: null,
          loading: false,
          error:
            axiosErr.response?.data?.message ??
            axiosErr.message ??
            "Something went wrong",
        });
      }
    },
    [],
  );

  return {
    videoData,
    fetchVideos,
  };
}
