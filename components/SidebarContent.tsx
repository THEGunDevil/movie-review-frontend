"use client";

import { Film, Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useMovies } from "@/hooks/useMovies";

export default function SidebarContent({
  selectedGenreId,
  setSelectedGenreId,
  setSearchQuery,
}: {
  selectedGenreId: string | null;
  setSelectedGenreId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState<string>("");
  const { genreData,fetchGenres } = useMovies();
  const handleGenreClick = (genreId: string) => {
    setSelectedGenreId(genreId);
    setSearchQuery(""); // সার্চ ক্লিয়ার করি
    setLocalSearch(""); // লোকাল ইনপুটও ক্লিয়ার
  };

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = localSearch.trim();
    if (!trimmed) return;
    setSelectedGenreId(null); // জেনার সিলেকশন ক্লিয়ার
    setSearchQuery(trimmed);
  };
  useEffect(() => {
    fetchGenres()
  },[fetchGenres])
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search movies..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 border-slate-700 bg-slate-800/60 text-slate-200 placeholder:text-slate-500 focus-visible:ring-red-500"
        />
      </form>

      {/* Genres */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Genres
        </h3>
        <Separator className="my-3 bg-slate-800" />
        <div className="flex flex-wrap gap-2">
          {genreData?.data.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id.toString())}
            >
              <Badge
                variant="outline"
                className={`border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer ${
                  selectedGenreId === genre.id.toString()
                    ? "bg-red-600/20 border-red-500 text-red-300"
                    : ""
                }`}
              >
                {genre.name}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Browse Links */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Browse
        </h3>
        <Separator className="my-3 bg-slate-800" />
        <nav className="space-y-2 text-sm">
          <button
            onClick={() => {
              setSelectedGenreId(null);
              setSearchQuery("");
              setLocalSearch("");
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 w-full text-left"
          >
            <Film className="h-4 w-4" /> All Movies
          </button>
          <Link
            href="/movies/top-rated"
            className="flex items-center gap-2 text-slate-400 hover:text-red-400"
          >
            <TrendingUp className="h-4 w-4" /> Top Rated
          </Link>
        </nav>
      </div>
    </div>
  );
}
