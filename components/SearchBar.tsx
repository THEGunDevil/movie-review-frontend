"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchedMovies from "./SearchedMovies";

interface SearchState {
  search: string;
  searchLoading: boolean;
  searchError: string | null;
}

export default function SearchBar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchState, setSearchState] = useState<SearchState>({
    search: "",
    searchLoading: false,
    searchError: null,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchState.search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchState.search]);

  const updateSearchState = (updates: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updates }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        updateSearchState({ search: "" });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") updateSearchState({ search: "" });
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchState.search.trim();
    if (!searchTerm) return;

    updateSearchState({ searchLoading: true, searchError: null });

    try {
      router.push(`/movies?search=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      console.error("Search failed:", error);
      updateSearchState({
        searchError: error instanceof Error ? error.message : "Search failed",
      });
    } finally {
      updateSearchState({ searchLoading: false });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative mx-auto z-50 mt-8 flex max-w-md items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-5 py-3 text-slate-400 backdrop-blur-sm"
    >
      <Search className="h-4 w-4" />
      <input
        value={searchState.search}
        onChange={(e) => updateSearchState({ search: e.target.value })}
        placeholder="Search movies..."
        className="w-full bg-transparent px-3 text-sm text-slate-200 outline-none border-0 placeholder:text-slate-600"
      />
      {searchState.searchLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
      )}

      {debouncedSearch && (
        <div
          ref={dropdownRef}
          className="absolute top-16 scrollbar-hide left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-6xl max-h-140 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl animate-dropdown-enter"
        >
          <SearchedMovies searchQuery={debouncedSearch} />
        </div>
      )}
    </form>
  );
}