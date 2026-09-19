"use client";

import {
  Search,
  X,
  ChevronDown,
} from "lucide-react";

import {
  MediaType,
  SortType,
} from "@/models/Review";

interface FilterBarProps {
  search: string;
  onSearchChange: (
    value: string,
  ) => void;
  onSearchSubmit: () => void;

  mediaType:
    | "all"
    | MediaType;

  onMediaTypeChange: (
    value:
      | "all"
      | MediaType,
  ) => void;

  ratingFilter:
    | number
    | null;

  onRatingFilterChange: (
    value: number | null,
  ) => void;

  sort: SortType;

  onSortChange: (
    value: SortType,
  ) => void;

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
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-4">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange(
              e.target.value,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearchSubmit();
            }
          }}
          placeholder="Search reviews, movies, shows, or users..."
          className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-24 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
        />

        <button
          type="button"
          onClick={onSearchSubmit}
          className="absolute right-1.5 top-1.5 h-9 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-500"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Media */}
        <div className="flex items-center gap-2">
          {[
            {
              value: "all" as const,
              label: "All",
            },
            {
              value: "movie" as const,
              label: "🎥 Movies",
            },
            {
              value: "tv" as const,
              label: "📺 TV Shows",
            },
          ].map((item) => {
            const active =
              mediaType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  onMediaTypeChange(
                    item.value,
                  )
                }
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Rating + Sort */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Rating */}
          <div className="relative">
<select
  value={ratingFilter ?? ""}
  onChange={(e) =>
    onRatingFilterChange(
      e.target.value
        ? Number(e.target.value)
        : null,
    )
  }
  className="h-10 w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3 pr-9 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500/50 sm:w-40"
>
  <option value="">⭐ Any Rating</option>
  <option value="5">⭐ 5+ Stars</option>
  <option value="4">⭐ 4+ Stars</option>
  <option value="3">⭐ 3+ Stars</option>
  <option value="2">⭐ 2+ Stars</option>
  <option value="1">⭐ 1+ Star</option>
</select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) =>
                onSortChange(
                  e.target
                    .value as SortType,
                )
              }
              className="h-10 w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3 pr-9 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500/50 sm:w-44"
            >
              <option value="newest">
                🕐 Newest
              </option>

              <option value="popular">
                🔥 Most Popular
              </option>

              <option value="discussed">
                💬 Most Discussed
              </option>

              <option value="highest_rated">
                🏆 Highest Rated
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Filters are active
          </div>

          <button
            type="button"
            onClick={
              onClearFilters
            }
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}