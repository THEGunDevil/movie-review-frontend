"use client";

import { useMovies } from "@/hooks/useMovies";
import { Movie } from "@/models/movie";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { getDateTimestamp } from "@/lib/format";
import MoviesPageComponent from "@/components/MoviesPageComponent";
import { GoToPage } from "@/lib/helpers";

export default function MoviesPage() {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  const {
    movieData,
    genreMoviesData,
    searchData, // searchData ইমপোর্ট করা হয়েছে
    fetchMovies,
    fetchGenreMovies,
    fetchSearchResults,
    page,
  } = useMovies();
  const { goToPage } = GoToPage();
  // স্ট্যাটাস নির্ধারণ (সার্চ হচ্ছে নাকি জেনার সিলেক্ট করা আছে)
  const isSearching = Boolean(searchQuery.trim());
  const isGenre = Boolean(selectedGenreId);

  // ডেটা ফেচ করা – page, genre, search যেকোনো পরিবর্তনে
  useEffect(() => {
    if (isSearching) {
      fetchSearchResults(searchQuery.trim(), page);
    } else if (isGenre && selectedGenreId) {
      fetchGenreMovies(page, selectedGenreId);
    } else {
      fetchMovies(page);
    }
  }, [
    page,
    selectedGenreId,
    searchQuery,
    fetchMovies,
    fetchGenreMovies,
    fetchSearchResults,
    isSearching,
    isGenre,
  ]);
  // বর্তমান অবস্থার উপর ভিত্তি করে সঠিক ডেটা এবং লোডিং স্ট্যাটাস বের করা
  let rawMovies: Movie[] = [];
  let totalPages: number = 1;
  let isLoading = false;
  let error = null;

  if (isSearching) {
    rawMovies = searchData?.data?.movies ?? [];
    totalPages = searchData?.data?.total_pages ?? 1;
    isLoading = searchData.loading;
    error = searchData.error;
  } else if (isGenre) {
    rawMovies = genreMoviesData?.data?.movies ?? [];
    totalPages = genreMoviesData?.data?.total_pages ?? 1;
    isLoading = genreMoviesData.loading;
    error = genreMoviesData.error;
  } else {
    rawMovies = movieData?.data?.movies ?? [];
    totalPages = movieData?.data?.total_pages ?? 1;
    isLoading = movieData.loading;
    error = movieData.error;
  }

  // ফিল্টার (Sort) অ্যাপ্লাই করা (সার্চ, জেনার বা নরমাল লিস্ট সবার জন্য)
  const sortedMovies = useMemo(() => {
    if (!rawMovies.length) return [];
    const sorted = [...rawMovies];

    switch (sortBy) {
      case "vote_average.desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "release_date.desc":
        return sorted.sort(
          (a, b) =>
            getDateTimestamp(b.release_date) - getDateTimestamp(a.release_date),
        );
      case "popularity.desc":
      default:
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  }, [rawMovies, sortBy]);

  // হ্যান্ডলার: জেনার পরিবর্তন হলে পেজ ১-এ নিয়ে যাওয়া
  const handleSetSelectedGenreId = (id: string | null) => {
    setSelectedGenreId(id);
    goToPage(1); // Reset pagination
  };

  // হ্যান্ডলার: সার্চ করলে পেজ ১-এ নিয়ে যাওয়া
  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    goToPage(1); // Reset pagination
  };

  if (isLoading && rawMovies.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <MoviesPageComponent
      page={page}
      totalPages={totalPages}
      goToPage={goToPage}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortedMovies={sortedMovies}
      selectedGenreId={selectedGenreId}
      setSelectedGenreId={handleSetSelectedGenreId}
      setSearchQuery={handleSetSearchQuery}
    />
  );
}
