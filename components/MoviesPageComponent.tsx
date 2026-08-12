"use client";
import { Film, Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Pagination from "@/components/pagination";
import MovieCard from "@/components/MovieCard";
import SidebarContent from "@/components/SidebarContent";
import { Movie } from "@/models/movie";

export default function MoviesPageComponent({
  page,
  totalPages,
  goToPage,
  sortBy,
  setSortBy,
  sortedMovies,
  selectedGenreId,
  setSelectedGenreId,
  setSearchQuery,
}: {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortedMovies: Movie[];
  selectedGenreId: string | null;
  setSelectedGenreId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  }) {

  
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl flex gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Desktop Sidebar – প্রপস পাস করি */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <SidebarContent
              selectedGenreId={selectedGenreId}
              setSelectedGenreId={setSelectedGenreId}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header & Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                Movies
              </h1>
              <p className="mt-2 text-lg text-slate-400">
                Browse our collection of reviewed films.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  if (value) setSortBy(value);
                }}
              >
                <SelectTrigger className="w-45 bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 focus:ring-red-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                  <SelectItem value="popularity.desc">Popularity</SelectItem>
                  <SelectItem value="vote_average.desc">Top Rated</SelectItem>
                  <SelectItem value="release_date.desc">
                    Release Date
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800 hover:text-white lg:hidden">
                  <Menu className="h-4 w-4" />
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-72 p-6 bg-slate-950 border-slate-800 overflow-y-auto"
                >
                  <SidebarContent
                    selectedGenreId={selectedGenreId}
                    setSelectedGenreId={setSelectedGenreId}
                    setSearchQuery={setSearchQuery}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Movie Grid */}
          {sortedMovies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Film className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No movies found.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
