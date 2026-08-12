"use client";

import Link from "next/link";
import { Star, Search, ChevronRight, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie, Genre } from "@/models/movie";
import { useMovies } from "@/hooks/useMovies";
import Image from "next/image";
import FeaturedReview from "@/components/Featured";
import { ScrollArea } from "@/components/ui/scroll-area";
import Pagination from "@/components/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { getGenreName } from "@/lib/helpers";

// Helper functions
const formatRating = (rating: number | undefined | null): string => {
  if (rating === undefined || rating === null || isNaN(rating)) return "N/A";
  return rating.toFixed(1);
};

const getReleaseYear = (dateString: string | undefined | null): string => {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "TBA" : String(date.getFullYear());
};

export default function HomePage() {
  const router = useRouter();
  const {
    movieData,
    genreData,
    page,
    fetchMovies,
    fetchGenres,
    genreMoviesData,
    fetchGenreMovies,
  } = useMovies();

  const movies = movieData?.data?.movies ?? [];
  const totalPages = movieData?.data?.total_pages ?? 1;

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const featured = movies.slice(0, 3);
  const genres: Genre[] = genreData?.data ?? [];
  const popularMovies: Movie[] = movies.slice(3, 21);
  const genreMovies: Movie[] = genreMoviesData?.data?.movies ?? [];
  const [showPopular, setShowPopular] = useState<boolean>(true);
  const displayedMovies = showPopular ? popularMovies : genreMovies;

  // Initial fetch
  useEffect(() => {
    fetchMovies(page);
    fetchGenres();
  }, [page]);

  const handleLatestReviews = (id: number) => {
    if (isNaN(id) || !id) return;
    setShowPopular(false);
    fetchGenreMovies(page, id);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      router.push(`/movies?search=${encodeURIComponent(search.trim())}`);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    fetchMovies(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (movieData.loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-white mt-4">Loading movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (movieData.error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">Error: {movieData.error}</p>
          <button
            onClick={() => fetchMovies(page)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* ── Hero Section ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge className="bg-red-600/20 text-red-300 border-red-500/30 backdrop-blur-sm px-4 py-1 text-sm">
            🍿 Movie Review Portfolio
          </Badge>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl bg-linear-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            CineCritic
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            In‑depth reviews, trailers, and film criticism from passionate movie
            lovers.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-5 py-3 text-slate-400 backdrop-blur-sm"
          >
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent px-3 text-sm text-slate-200 outline-none border-0 placeholder:text-slate-600"
            />
            {searchLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            )}
          </form>
          {searchError && (
            <p className="mt-2 text-sm text-red-400">{searchError}</p>
          )}
        </div>

        {/* Hero Carousel */}
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((movie) => (
            <FeaturedReview key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* ── Latest Reviews Grid ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400 mr-2">Genres:</span>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleLatestReviews(genre.id)}
            >
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                {genre.name}
              </Badge>
            </button>
          ))}
        </div>
        <div className="my-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">
            {showPopular ? "Latest Reviews" : "Genre Movies"}
          </h2>
          <Link
            href="/movies"
            className="group flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300"
          >
            View all{" "}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {displayedMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <Card className="group h-full overflow-hidden border-slate-800 bg-slate-900/60 backdrop-blur transition-all hover:border-slate-700 hover:shadow-xl">
                {/* Poster Container */}
                <div className="aspect-2/3 overflow-hidden relative">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={500}
                      height={750}
                      loading="eager"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-slate-600">
                      No Poster
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 z-10">
                    <Badge className="bg-black/70 backdrop-blur-sm">
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {formatRating(movie.vote_average)}
                    </Badge>
                  </div>
                </div>

                {/* Content Container - FIXED: Moved outside poster div */}
                <CardContent className="p-4">
                  <h3 className="font-semibold leading-tight text-slate-100 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {getReleaseYear(movie.release_date)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {movie.genre_ids
                      ?.filter((gid) => !isNaN(gid) && gid !== null)
                      .slice(0, 2)
                      .map((gid) => (
                        <Badge
                          key={gid}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {getGenreName(gid,genres)}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {genreMoviesData?.loading && <Loader />}
        </div>

        {/* Pagination: only show when popular is displayed */}
        {showPopular && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}
      </section>

      {/* ── Trending Now (Horizontal Scroll) ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Trending Now</h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {movies.slice(0, 10).map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="w-40 shrink-0 group"
              >
                <Card className="overflow-hidden border-slate-800 bg-slate-900/60 backdrop-blur transition hover:border-red-500/50 hover:shadow-lg">
                  <div className="aspect-2/3 relative">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={750}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-800 text-slate-600">
                        <Film className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/70 backdrop-blur-sm">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {formatRating(movie.vote_average)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <h3 className="text-xs text-slate-100 font-semibold line-clamp-1">
                      {movie.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-r from-red-600 to-rose-700 p-8 text-white text-center">
          <h2 className="text-3xl font-bold">Stay Updated</h2>
          <p className="mt-2 text-white/80">
            Get the latest reviews, trailers, and film essays delivered to your
            inbox.
          </p>
          <form
            className="mt-6 flex justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex max-w-md w-full gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
              />
              <Button
                type="submit"
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
