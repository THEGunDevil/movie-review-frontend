"use client";

import { useEffect, useMemo, useState } from "react";
import { useTVShows } from "@/hooks/useTVShows";
import { TVShow } from "@/models/TVShow";
import Loader from "@/components/Loader";
import { getDateTimestamp } from "@/lib/format";
import TVShowsPageComponent from "@/components/TVShowsPageComponent";
import { GoToPage } from "@/lib/helpers";

export default function TVShowsPage() {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  const {
    tvShowsData, // all TV shows
    genreTVShowsData, // genre‑filtered TV shows
    searchData, // search results
    page,
    fetchTVShows,
    fetchGenreTVShows,
    fetchSearchResults,
  } = useTVShows();
  const { goToPage } = GoToPage();
  const isSearching = Boolean(searchQuery.trim());
  const isGenre = Boolean(selectedGenreId);

  // Fetch depending on the current mode
  useEffect(() => {
    if (isSearching) {
      fetchSearchResults(searchQuery.trim(), page);
    } else if (isGenre && selectedGenreId) {
      fetchGenreTVShows(page, selectedGenreId);
    } else {
      fetchTVShows(page);
    }
  }, [
    page,
    selectedGenreId,
    searchQuery,
    fetchTVShows,
    fetchGenreTVShows,
    fetchSearchResults,
    isSearching,
    isGenre,
  ]);

  let rawShows: TVShow[] = [];
  let totalPages = 1;
  let isLoading = false;
  let error: string | null = null;

  if (isSearching) {
    rawShows = searchData?.data?.tv_shows ?? [];
    totalPages = searchData?.data?.total_pages ?? 1;
    isLoading = searchData.loading;
    error = searchData.error;
  } else if (isGenre) {
    rawShows = genreTVShowsData?.data?.tv_shows ?? [];
    totalPages = genreTVShowsData?.data?.total_pages ?? 1;
    isLoading = genreTVShowsData.loading;
    error = genreTVShowsData.error;
  } else {
    rawShows = tvShowsData?.data?.tv_shows ?? [];
    totalPages = tvShowsData?.data?.total_pages ?? 1;
    isLoading = tvShowsData.loading;
    error = tvShowsData.error;
  }

  const sortedShows = useMemo(() => {
    if (!rawShows.length) return [];
    const sorted = [...rawShows];
    switch (sortBy) {
      case "vote_average.desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "first_air_date.desc":
        return sorted.sort(
          (a, b) =>
            getDateTimestamp(b.first_air_date) -
            getDateTimestamp(a.first_air_date),
        );
      case "popularity.desc":
      default:
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  }, [rawShows, sortBy]);

  const handleSetSelectedGenreId = (id: string | null) => {
    setSelectedGenreId(id);
    goToPage(1);
  };

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    goToPage(1);
  };

  if (isLoading && rawShows.length === 0) {
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
    <TVShowsPageComponent
      page={page}
      totalPages={totalPages}
      goToPage={goToPage}
      sortBy={sortBy}
      setSortBy={setSortBy}
      shows={sortedShows}
      selectedGenreId={selectedGenreId}
      setSelectedGenreId={handleSetSelectedGenreId}
      setSearchQuery={handleSetSearchQuery}
    />
  );
}
