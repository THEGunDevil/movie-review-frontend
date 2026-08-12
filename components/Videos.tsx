
"use client";

import { formatDate } from "@/lib/format";
import { MovieVideo, VideoType } from "@/models/movie";
import { Film, Play, Sparkles } from "lucide-react";
import Pagination from "./pagination";

interface VideosProps {
  videoList: MovieVideo[];
  activeVideo: MovieVideo | null;
  setActiveVideoId: (id: string) => void;

  videoType: VideoType;
  setVideoType: (type: VideoType) => void;

  totalPages: number;
  totalVideos: number;

  page: number;
  onPageChange: (page: number) => void;
}

function Videos({
  videoList,
  activeVideo,
  setActiveVideoId,
  videoType,
  totalPages,
  totalVideos,
  page,
  onPageChange,
  setVideoType,
}: VideosProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/20">
      {/* Header */}
      <div className="border-b border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Film className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Trailers & Teasers
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  Select any video to play it above.
                </p>
              </div>
            </div>

            {/* Total videos */}
            <div className="hidden shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-400 sm:block">
              {totalVideos}{" "}
              {totalVideos === 1 ? "video" : "videos"}
            </div>
          </div>

          {/* Mobile count */}
          <div className="text-xs font-medium text-slate-500 sm:hidden">
            {totalVideos} {totalVideos === 1 ? "video" : "videos"}
          </div>

          {/* Type tabs */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            {(["Trailer", "Teaser"] as VideoType[]).map((type) => {
              const active = videoType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setVideoType(type);
                    onPageChange(1);
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                    active
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  {type === "Trailer" ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}

                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video list */}
      <div className="p-5 sm:p-6">
        {videoList.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {videoList.map((video) => {
                const isActive = video.id === activeVideo?.id;

                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    aria-label={`Play ${video.name}`}
                    className={`group overflow-hidden rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      isActive
                        ? "border-red-500 bg-red-950/30 shadow-lg shadow-red-950/30"
                        : "border-slate-800 bg-slate-950/40 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800/70"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500" />
                      )}

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                            isActive
                              ? "scale-105 bg-red-500 text-white shadow-lg shadow-red-500/30"
                              : "bg-slate-950/80 text-slate-200 backdrop-blur-sm group-hover:scale-105 group-hover:bg-red-500 group-hover:text-white"
                          }`}
                        >
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="rounded-md border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-100 backdrop-blur-sm">
                          {video.type}
                        </span>

                        {video.official && (
                          <span className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            Official
                          </span>
                        )}
                      </div>

                      {/* Quality */}
                      {video.size && (
                        <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-sm">
                          {video.size}p
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white">
                        {video.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500">
                          {formatDate(video.published_at)}
                        </p>

                        {isActive && (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-400">
                            Playing
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 border-t border-slate-800 pt-5">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Page{" "}
                    <span className="font-semibold text-slate-300">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-300">
                      {totalPages}
                    </span>
                  </span>

                  <span>
                    {totalVideos} total{" "}
                    {totalVideos === 1 ? "video" : "videos"}
                  </span>
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/70">
              {videoType === "Trailer" ? (
                <Play className="h-6 w-6 text-slate-500" />
              ) : (
                <Sparkles className="h-6 w-6 text-slate-500" />
              )}
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-300">
              No {videoType}s available
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
              There are no {videoType}s available for this movie right now.
              Try switching to the other video type.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Videos;
