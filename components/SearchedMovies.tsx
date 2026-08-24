"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Film, Loader2, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Movie } from "@/models/Movie";
import { useMovies } from "@/hooks/useMovies";

export function SearchedMovies({ searchQuery }: { searchQuery: string }) {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]); // এখন এখানে ডেটা জমা হবে
  const [hasMore, setHasMore] = useState(true);
  const { fetchSearchResults, searchData } = useMovies();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loading = searchData?.loading ?? false;
  const error = searchData?.error ?? null;

  // যখন searchQuery পরিবর্তন হয়, রিসেট করুন
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // প্রথম লোড বা query পরিবর্তন হলে fetch করুন
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults(searchQuery, 1);
    }
  }, [searchQuery, fetchSearchResults]);

  // যখন searchData আপডেট হয়, movies state-এ সেট করুন
  useEffect(() => {
    if (searchData?.data) {
      const newMovies = searchData.data.movies ?? [];
      // প্রথম পেজ হলে replace, পরের পেজ হলে append
      if (page === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }
      setHasMore(searchData.data.page < searchData?.data?.total_pages);
    }
  }, [searchData, page]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchSearchResults(searchQuery, nextPage);
        }
      },
      { rootMargin: "100px" },
    );

    observerRef.current.observe(currentSentinel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, page, fetchSearchResults, searchQuery]);

  // --- Rendering conditions ---

  if (loading && movies.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="py-20 text-center">
        <SearchX className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-500">{error}</p>
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return (
      <div className="py-20 text-center">
        <SearchX className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-500">Start typing to search movies</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-20 text-center">
        <SearchX className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-500">
          No movies found for &quot;{searchQuery}&quot;
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition hover:border-slate-600 hover:bg-slate-900/80"
          >
            <div className="relative aspect-2/3 overflow-hidden bg-slate-800">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Film className="h-10 w-10 text-slate-600" />
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <Badge className="flex items-center gap-1 bg-black/70 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              </div>
            </div>
            <div className="p-2">
              <h3 className="line-clamp-1 text-sm font-medium text-slate-200 group-hover:text-red-400">
                {movie.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "TBA"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-10" />

      {loading && movies.length > 0 && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <p className="py-8 text-center text-xs text-slate-600">
          You&apos;ve reached the end of the list
        </p>
      )}
    </div>
  );
}

export default SearchedMovies;
