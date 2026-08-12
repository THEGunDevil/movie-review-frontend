"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Film } from "lucide-react";
import useCredits from "@/hooks/useCredits";
import { useMovies } from "@/hooks/useMovies";
import useVideos from "@/hooks/useVideos";
import type {
  CreditType,
  Genre,
  Movie,
  MovieVideo,
  PaginatedVideoResponse,
  SingleMovieResponse,
  VideoType,
} from "@/models/movie";
import Videos from "@/components/Videos";
import { formatDate } from "@/lib/format";
import Credits from "@/components/Credits";
import ReviewCom from "@/components/AddReviewCom";
import Reviews from "@/components/Reviews";
import MovieInfo from "@/components/MovieInfo";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";
import AddReviewCom from "@/components/AddReviewCom";
import { GoToPage } from "@/lib/helpers";

type MoviePayload = Movie | SingleMovieResponse;
type VideoPayload = PaginatedVideoResponse<MovieVideo>;

function getMovie(payload: MoviePayload): Movie | null {
  if (!payload) return null;
  if ("movies" in payload) return payload.movies ?? null;
  return payload;
}

function getVideos(
  payload: VideoPayload | null,
  movie: Movie | null,
): MovieVideo[] {
  return payload?.videos ?? movie?.movie_trailers ?? [];
}

function getGenres(movie: Movie | null): Genre[] {
  if (!movie) return [];
  if (movie.genres?.length) return movie.genres;
  return (movie.genre_ids ?? []).map((id) => ({
    id,
    name:`Genre ${id}`,
  }));
}

function getDisplayVideos(videos: MovieVideo[]): MovieVideo[] {
  return videos
    .filter((video) => {
      const type = video.type.toLowerCase();
      return (
        video.site.toLowerCase() === "youtube" &&
        Boolean(video.key) &&
        (type === "trailer" || type === "teaser")
      );
    })
    .sort((a, b) => {
      const typeRank = (v: MovieVideo) =>
        v.type.toLowerCase() === "trailer" ? 0 : 1;
      const officialRank = (v: MovieVideo) => (v.official ? 0 : 1);
      const dateRank = (v: MovieVideo) => Date.parse(v.published_at ?? "") || 0;

      return (
        typeRank(a) - typeRank(b) ||
        officialRank(a) - officialRank(b) ||
        dateRank(b) - dateRank(a)
      );
    });
}

function getDefaultVideo(videos: MovieVideo[]): MovieVideo | null {
  return (
    videos.find((v) => v.type.toLowerCase() === "trailer" && v.official) ??
    videos.find((v) => v.type.toLowerCase() === "trailer") ??
    videos[0] ??
    null
  );
}

// 1. মূল Export-এ Provider দিয়ে Wrapping নিশ্চিত করুন
export default function MovieDetailsPage() {
  return (
    <ReviewProvider>
      <MovieDetailsContent />
    </ReviewProvider>
  );
}

// 2. আসল পেজের লজিক চাইল্ড কম্পোনেন্টে নিয়ে আসুন
function MovieDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { fetchSingleMovie, singleMovieData } = useMovies();
  const { fetchVideos, videoData } = useVideos();
  const { fetchReviews, reviewData, handleAddReview } = useReviews(); // ✅ এখন এটি Provider-এর ভেতরে সুরক্ষিত

  const [creditType, setCreditType] = useState<CreditType>("cast");
  const [videoType, setVideoType] = useState<VideoType>("Trailer");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const movie = getMovie(singleMovieData?.data as MoviePayload);
  const rawVideos = useMemo(
    () => getVideos(videoData?.data, movie),
    [movie, videoData?.data],
  );
  const videoList = useMemo(() => getDisplayVideos(rawVideos), [rawVideos]);
  const defaultVideo = useMemo(() => getDefaultVideo(videoList), [videoList]);
  const activeVideo = useMemo(
    () => videoList.find((v) => v.id === activeVideoId) ?? defaultVideo ?? null,
    [activeVideoId, defaultVideo, videoList],
  );
  const { creditsData, fetchCredits } = useCredits();
  const genres = useMemo(() => getGenres(movie), [movie]);
  const { page, goToPage } = GoToPage();
  const { page: videoPage, goToPage: goToVideoPage } = GoToPage();
  const { page: reviewPage } = GoToPage();
  const { goToPage: goToReviewPage } = GoToPage();

  useEffect(() => {
    if (!id) return;
    const movieID = Number(id);
    if (Number.isNaN(movieID)) return;
    fetchSingleMovie(id);
  }, [id, fetchSingleMovie]);

  useEffect(() => {
    const movieID = Number(id);
    if (!id || Number.isNaN(movieID)) return;
    fetchVideos(movieID, videoType, videoPage);
  }, [id, videoType, videoPage, fetchVideos]);

  useEffect(() => {
    if (!id) return;
    const movieID = Number(id);
    if (Number.isNaN(movieID)) return;
    fetchCredits(movieID, creditType, page);
  }, [id, creditType, page, fetchCredits]);

  useEffect(() => {
    if (!id) return;
    fetchReviews(id, reviewPage, "movie");
  }, [id, reviewPage, fetchReviews]);

  const totalCreditPages = creditsData?.data?.total_pages;
  const isLoading =
    singleMovieData?.loading ||
    creditsData?.loading ||
    videoData?.loading ||
    reviewData?.loading;
  const error =
    singleMovieData?.error ||
    creditsData?.error ||
    videoData?.error ||
    reviewData?.error;

  useEffect(() => {
    if (!videoList.length) {
      setActiveVideoId(null);
      return;
    }
    const currentVideoExists = videoList.some((v) => v.id === activeVideoId);
    if (!currentVideoExists) {
      setActiveVideoId(defaultVideo?.id ?? videoList[0].id);
    }
  }, [activeVideoId, defaultVideo?.id, videoList]);
  const addReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the context's handleAddReview directly (it already prevents default internally,
    // but we need to call it with the correct parameters)
    handleAddReview(e, id, reviewPage, "movie");
    goToReviewPage(1); // reset to page 1
  };
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 text-slate-100">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-center text-red-200">
          <h2 className="text-lg font-bold text-white">Error loading movie</h2>
          <p className="mt-1 text-sm text-red-200/80">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-red-500" />
          <p className="text-sm font-medium text-slate-400">
            Loading movie experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <div className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-black/40">
              <div className="aspect-video w-full">
                {activeVideo ? (
                  <iframe
                    className="h-full w-full border-0"
                    src={`https://www.youtube.com/embed/${activeVideo.key}?rel=0`}
                    title={activeVideo.name || `${movie.title} video`}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-950 text-slate-500">
                    <Film className="h-10 w-10" />
                    <p className="text-sm font-medium">Trailer Not Available</p>
                  </div>
                )}
              </div>
              {activeVideo && (
                <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-950/95 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                        {activeVideo.type}
                      </span>
                      {activeVideo.official && (
                        <span className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300">
                          Official
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-white">
                      {activeVideo.name}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    {formatDate(activeVideo.published_at)}
                  </p>
                </div>
              )}
            </div>
            <AddReviewCom
              mediaID={id}
              mediaType="movie"
              onAddReview={addReview}
            />
            {videoList.length > 1 && (
              <Videos
                videoList={videoList}
                activeVideo={activeVideo}
                setActiveVideoId={setActiveVideoId}
                videoType={videoType}
                setVideoType={setVideoType}
                page={videoData?.data?.page ?? 1}
                totalPages={videoData?.data?.total_pages ?? 1}
                totalVideos={videoData?.data?.total_videos ?? 0}
                onPageChange={goToVideoPage}
              />
            )}
          </div>

          <aside className="space-y-6">
            <MovieInfo genres={genres} movie={movie} />
            <Reviews
              reviews={reviewData?.data?.reviews ?? []}
              page={reviewPage}
              onPageChange={goToReviewPage}
              totalPages={reviewData?.data?.total_pages ?? 1}
            />{" "}
            <Credits
              creditType={creditType}
              setCreditType={setCreditType}
              credits={creditsData?.data?.credits ?? []}
              totalPages={totalCreditPages ?? 1}
              page={page}
              onPageChange={goToPage}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}
