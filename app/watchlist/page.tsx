"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  ChevronRight,
  Film,
  Play,
  Search,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import useWatchList from "@/hooks/useWatchList";
import { WatchlistItem } from "@/models/Watchlist";

export default function WatchList() {
  const [activeFilter, setActiveFilter] = useState<"all" | "movie" | "tv">(
    "all",
  );

  const [search, setSearch] = useState("");
  const {
    watchList = [],
    loading,
    fetchMyWatchlist,
    removeMovieFromWatchlist,
    removeTVFromWatchlist,
  } = useWatchList();

  // =========================================================
  // Load watchlist
  // =========================================================

  useEffect(() => {
    fetchMyWatchlist();
  }, [fetchMyWatchlist]);

  const filteredItems = useMemo(() => {
    const list = Array.isArray(watchList) ? watchList : [];
    const query = search.trim().toLowerCase();

    return list.filter((item) => {
      const matchesType =
        activeFilter === "all" || item.media_type === activeFilter;

      const matchesSearch =
        !query || item.media_title?.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [watchList, activeFilter, search]);

  // =========================================================
  // Remove item
  // =========================================================

  const handleRemove = async (item: WatchlistItem) => {
    try {
      if (item.media_type === "movie") {
        await removeMovieFromWatchlist(item.media_id);
      } else {
        await removeTVFromWatchlist(item.media_id);
      }

      toast.success("Removed from your watch list.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Failed to remove watchlist item:", error);
    }
  };
  const savedCount = (watchList ?? []).length;
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            Header
        ====================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                <Bookmark className="h-3.5 w-3.5" />
                Your Collection
              </div>

              <h1 className="bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                Watchlist
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep track of movies and shows you want to watch next.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Bookmark className="h-4 w-4" />
              <span>
                {savedCount} {savedCount === 1 ? "saved" : "saved"}
              </span>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 shadow-xl backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your watchlist..."
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-10 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters */}

            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "all" as const,
                  label: "All",
                },
                {
                  value: "movie" as const,
                  label: "Movies",
                },
                {
                  value: "tv" as const,
                  label: "TV Shows",
                },
              ].map((filter) => {
                const active = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            Loading
        ====================================================== */}

        {loading ? (
          <WatchlistSkeleton />
        ) : filteredItems.length === 0 ? (
          <EmptyWatchlist
            hasFilters={Boolean(search.trim()) || activeFilter !== "all"}
            onClear={() => {
              setSearch("");
              setActiveFilter("all");
            }}
          />
        ) : (
          <section>
            {/* Section heading */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Saved for later
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredItems.length} title
                  {filteredItems.length !== 1 ? "s" : ""} in your list
                </p>
              </div>

              <div className="hidden items-center gap-1 text-xs font-medium text-slate-500 sm:flex">
                Recently added
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Grid */}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {filteredItems.map((item) => (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            Bottom CTA
        ====================================================== */}

        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-800/70 bg-linear-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Keep exploring
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Looking for something new?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Discover movies and shows to add to your watchlist.
              </p>
            </div>

            <Link
              href="/movies"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Explore Movies
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// =========================================================
// Watchlist Card
// =========================================================

function WatchlistCard({
  item,
  onRemove,
}: {
  item: WatchlistItem;
  onRemove: (item: WatchlistItem) => void;
}) {
  const detailsPath =
    item.media_type === "movie"
      ? `/movies/${item.media_id}`
      : `/tv/${item.media_id}`;

  const posterSrc = item.media_poster_path
    ? item.media_poster_path.startsWith("http")
      ? item.media_poster_path
      : `https://image.tmdb.org/t/p/w500${item.media_poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
      {/* Poster */}

      <Link
        href={detailsPath}
        className="relative block aspect-2/3 overflow-hidden bg-slate-900"
      >
        <Image
          src={posterSrc}
          alt={item.media_title}
          fill
          loading={"eager"}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Type */}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {item.media_type === "movie" ? (
            <Film className="h-3 w-3" />
          ) : (
            <Tv className="h-3 w-3" />
          )}

          {item.media_type === "movie" ? "Movie" : "TV"}
        </span>

        {/* Play */}

        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </div>
      </Link>

      {/* Info */}

      <div className="p-3.5">
        <Link
          href={detailsPath}
          className="block truncate text-sm font-bold text-white transition hover:text-indigo-300"
          title={item.media_title}
        >
          {item.media_title}
        </Link>

        <div className="mt-1.5 text-[11px] text-slate-500">
          Added {new Date(item.added_at).toLocaleDateString()}
        </div>

        <button
          type="button"
          onClick={() => onRemove(item)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 py-2 text-[11px] font-semibold text-slate-500 transition hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
        >
          <X className="h-3 w-3" />
          Remove
        </button>
      </div>
    </article>
  );
}

// =========================================================
// Empty
// =========================================================

function EmptyWatchlist({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/40 px-6 py-20 text-center shadow-xl backdrop-blur">
      <div className="relative z-10 mx-auto max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
          <Bookmark className="h-7 w-7" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          {hasFilters ? "Nothing found" : "Your watchlist is empty"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {hasFilters
            ? "Try changing your search or filter to find something else."
            : "Save movies and TV shows here so you always know what to watch next."}
        </p>

        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        ) : (
          <Link
            href="/movies"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Film className="h-4 w-4" />
            Browse Movies
          </Link>
        )}
      </div>

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
    </div>
  );
}

// =========================================================
// Skeleton
// =========================================================

function WatchlistSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50"
        >
          <div className="aspect-2/3 animate-pulse bg-slate-800" />

          <div className="space-y-3 p-3.5">
            <div className="h-4 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
            <div className="h-8 animate-pulse rounded-lg bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
