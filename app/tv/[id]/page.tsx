"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2, Film } from "lucide-react";

import TVShowInfo from "@/components/TVShowsInfo";
import Videos from "@/components/Videos";
import Credits from "@/components/Credits";
import Reviews from "@/components/Reviews";
import AddReviewCom from "@/components/AddReviewCom";
import { ReviewProvider, useReviews } from "@/context/ReviewContext";

import type { CreditType, VideoType } from "@/models/movie";
import { TVShow } from "@/models/TVShow";

function getDisplayVideos(videos: any[]) {
  return videos
    .filter(
      (v) =>
        v.site === "YouTube" &&
        v.key &&
        (v.type === "Trailer" || v.type === "Teaser"),
    )
    .sort((a, b) => {
      const rank = (v: any) => (v.type === "Trailer" ? 0 : 1);
      return (
        rank(a) - rank(b) ||
        (a.official === b.official ? 0 : a.official ? -1 : 1)
      );
    });
}

function TVDetailContent() {
  const { id } = useParams<{ id: string }>();

  // ── TV Show state ──
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [loadingShow, setLoadingShow] = useState(true);
  const [showError, setShowError] = useState<string | null>(null);

  // ── Credits ──
  const [creditsState, setCreditsState] = useState({
    data: [] as any[],
    type: "cast" as CreditType,
    page: 1,
    totalPages: 1,
  });

  // ── Videos ──
  const [videosState, setVideosState] = useState({
    data: [] as any[],
    type: "Trailer" as VideoType,
    page: 1,
    totalPages: 1,
    activeVideoId: null as string | null,
  });

  // ── Reviews ── (now powered by context)
  const { reviewData, fetchReviews, handleAddReview } = useReviews();
  const [reviewPage, setReviewPage] = useState(1);

  // Automatically fetch reviews from context when page or ID changes
  useEffect(() => {
    if (!id) return;
    fetchReviews(id, reviewPage, "tv");
  }, [id, reviewPage, fetchReviews]);

  // Custom add handler that also resets to page 1 after submitting
  const onAddReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call context to add the review – pass page 1 so the latest review appears
    handleAddReview(e, id!, 1, "tv");
    setReviewPage(1);
  };

  // ---------- Fetch TV show ----------
  useEffect(() => {
    if (!id) return;
    setLoadingShow(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tv_shows/tv_show/${id}`)
      .then((res) => setTVShow(res.data))
      .catch((err) =>
        setShowError(err.response?.data?.error || "Failed to load TV show"),
      )
      .finally(() => setLoadingShow(false));
  }, [id]);

  // ---------- Fetch credits ----------
  useEffect(() => {
    if (!id) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/tv_shows/tv_show/credits/${id}`,
        {
          params: {
            type: creditsState.type,
            page: creditsState.page,
            limit: 20,
          },
        },
      )
      .then((res) =>
        setCreditsState((prev) => ({
          ...prev,
          data: res.data.credits ?? [],
          totalPages: res.data.total_pages ?? 1,
        })),
      )
      .catch(console.error);
  }, [id, creditsState.type, creditsState.page]);

  // ---------- Fetch videos ----------
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tv_shows/tv_show/videos/${id}`, {
        params: { type: videosState.type, page: videosState.page, limit: 10 },
      })
      .then((res) =>
        setVideosState((prev) => ({
          ...prev,
          data: res.data.videos ?? [],
          totalPages: res.data.total_pages ?? 1,
        })),
      )
      .catch(console.error);
  }, [id, videosState.type, videosState.page]);

  const displayedVideos = useMemo(
    () => getDisplayVideos(videosState.data),
    [videosState.data],
  );

  const activeVideo = useMemo(() => {
    if (videosState.activeVideoId)
      return (
        displayedVideos.find((v) => v.id === videosState.activeVideoId) ?? null
      );
    const trailer = displayedVideos.find(
      (v) => v.type === "Trailer" && v.official,
    );
    return trailer ?? displayedVideos[0] ?? null;
  }, [displayedVideos, videosState.activeVideoId]);

  // ---------- Loading / Error ----------
  if (loadingShow) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    );
  }

  if (showError || !tvShow) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        {showError || "TV show not found."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          {/* Left column: video player + reviews */}
          <div className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-black/40">
              <div className="aspect-video w-full">
                {activeVideo ? (
                  <iframe
                    className="h-full w-full border-0"
                    src={`https://www.youtube.com/embed/${activeVideo.key}?rel=0`}
                    title={activeVideo.name || `${tvShow.name} trailer`}
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
                </div>
              )}
            </div>

            <AddReviewCom
              mediaID={id!}
              mediaType="tv"
              onAddReview={onAddReview}
            />
          </div>

          {/* Right column: TV show info, credits, videos list */}
          <aside className="space-y-6">
            <TVShowInfo genresIDs={tvShow?.genre_ids} tvShow={tvShow} />

            {/* Reviews */}
            <Reviews
              reviews={reviewData?.data?.reviews ?? []}
              page={reviewPage}
              onPageChange={setReviewPage}
              totalPages={reviewData?.data?.total_pages ?? 1}
            />

            {/* Credits */}
            <Credits
              creditType={creditsState.type}
              setCreditType={(type) =>
                setCreditsState((prev) => ({ ...prev, type, page: 1 }))
              }
              credits={creditsState.data}
              totalPages={creditsState.totalPages}
              page={creditsState.page}
              onPageChange={(p) =>
                setCreditsState((prev) => ({ ...prev, page: p }))
              }
            />

            {/* Video selector (thumbnails) */}
            {displayedVideos.length > 1 && (
              <Videos
                videoList={displayedVideos}
                activeVideo={activeVideo}
                setActiveVideoId={(id) =>
                  setVideosState((prev) => ({ ...prev, activeVideoId: id }))
                }
                videoType={videosState.type}
                setVideoType={(type) =>
                  setVideosState((prev) => ({ ...prev, type, page: 1 }))
                }
                page={videosState.page}
                totalPages={videosState.totalPages}
                totalVideos={videosState.data.length}
                onPageChange={(p) =>
                  setVideosState((prev) => ({ ...prev, page: p }))
                }
              />
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function TVDetailPage() {
  return (
    <ReviewProvider>
      <TVDetailContent />
    </ReviewProvider>
  );
}