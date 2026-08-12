"use client";

import { Button } from "@/components/ui/button";
import { MediaType, SortType } from "@/models/Review";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  mediaType: "all" | MediaType;
  onMediaTypeChange: (value: "all" | MediaType) => void;
  ratingFilter: number | null;
  onRatingFilterChange: (value: number | null) => void;
  sort: SortType;
  onSortChange: (value: SortType) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function FilterBar({
  search,
  onSearchChange,
  onSearchSubmit,
  mediaType,
  onMediaTypeChange,
  ratingFilter,
  onRatingFilterChange,
  sort,
  onSortChange,
  onClearFilters,
  hasFilters,
}: FilterBarProps) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-3">
        {/* Search Row */}
        <div className="flex">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
            placeholder="Search reviews or movies..."
            className="h-10 flex-1 rounded-lg border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
          />
          <Button
            onClick={onSearchSubmit}
            className="p-5 text-sm font-medium text-white bg-transparent transition-colors"
          >
            <Search className="h-5! w-5!"/>
          </Button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={mediaType}
            onChange={(e) =>
              onMediaTypeChange(e.target.value as "all" | MediaType)
            }
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300 outline-none transition-colors hover:border-slate-700 focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="all">🎬 All Media</option>
            <option value="movie">🎥 Movies</option>
            <option value="tv">📺 TV Shows</option>
          </select>

          <select
            value={ratingFilter ?? ""}
            onChange={(e) =>
              onRatingFilterChange(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300 outline-none transition-colors hover:border-slate-700 focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="">⭐ Any Rating</option>
            <option value="5">⭐ 5 Stars</option>
            <option value="4">⭐ 4+ Stars</option>
            <option value="3">⭐ 3+ Stars</option>
            <option value="2">⭐ 2+ Stars</option>
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300 outline-none transition-colors hover:border-slate-700 focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="newest">🕐 Newest</option>
            <option value="popular">🔥 Most Popular</option>
            <option value="discussed">💬 Most Discussed</option>
            <option value="highest_rated">🏆 Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-800/70 pt-3">
          <span className="text-xs text-slate-500">
            Filters active — results refined
          </span>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            ✕ Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}