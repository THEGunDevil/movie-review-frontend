import { Genre } from "@/models/movie";
import { TVShow } from "@/models/TVShow";
import {
  CalendarDays,
  Star,
  Tv,
  Globe,
  Activity,
  BarChart3,
  Film,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useMovies } from "@/hooks/useMovies";

function TVShowInfo({
  genresIDs,
  tvShow,
}: {
  genresIDs: number[];
  tvShow: TVShow;
}) {
  const lastYear = tvShow.last_air_date
    ? new Date(tvShow.last_air_date).getFullYear()
    : "Present";
  const originCountries = tvShow.origin_country?.join(", ") || "N/A";
  const statusColor = tvShow.in_production ? "bg-emerald-400" : "bg-slate-500";
  const { genreData, fetchGenres } = useMovies();
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);
  const genres = genreData?.data?.filter((g) => genresIDs?.includes(g.id));

  return (
    <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/90 to-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
      {/* Title & Status Badge */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {tvShow.name}
          </h1>
          {tvShow.original_name !== tvShow.name && (
            <p className="mt-1 text-sm text-slate-400">
              {tvShow.original_name}
            </p>
          )}
        </div>
        <Badge
          className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            tvShow.in_production
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-slate-600/30 bg-slate-700/30 text-slate-300"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
          {tvShow.status || (tvShow.in_production ? "On Air" : "Ended")}
        </Badge>
      </div>

      {/* Genres */}
      {genres.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300"
            >
              {genre?.name}
            </span>
          ))}
        </div>
      )}

      {/* Rating Highlight */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-950/20 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm shadow-red-950/40">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <div>
          <span className="text-3xl font-bold text-white">
            {tvShow.vote_average?.toFixed(1) || "N/A"}
            <span className="text-lg text-slate-500">/10</span>
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {tvShow.vote_count?.toLocaleString()} votes
          </p>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="rounded-xl flex items-center justify-between border border-slate-800 bg-slate-950/50 p-3 text-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="mx-auto h-4 w-4 text-slate-400" />
            <p className="mt-1 text-xs text-slate-400">First Aired</p>
          </div>
          <p className="text-xs font-semibold text-white">
            {tvShow.first_air_date || "Unknown"}
          </p>
        </div>
        <div className="rounded-xl flex items-center justify-between border border-slate-800 bg-slate-950/50 p-3 text-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="mx-auto h-4 w-4 text-slate-400" />
            <p className="mt-1 text-xs text-slate-400">Last Aired</p>
          </div>
          <p className="text-sm font-semibold text-white">
            {tvShow.last_air_date ? lastYear : "Present"}
          </p>
        </div>
        <div className="rounded-xl flex items-center justify-between border border-slate-800 bg-slate-950/50 p-3 text-center">
          <div className="flex items-center gap-2">
            <Tv className="mx-auto h-4 w-4 text-slate-400" />
            <p className="mt-1 text-xs text-slate-400">Seasons</p>
          </div>
          <p className="text-sm font-semibold text-white">
            {tvShow.number_of_seasons || 0}
          </p>
        </div>
        <div className="rounded-xl flex items-center justify-between border border-slate-800 bg-slate-950/50 p-3 text-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="mx-auto h-4 w-4 text-slate-400" />
            <p className="mt-1 text-xs text-slate-400">Episodes</p>
          </div>
          <p className="text-sm font-semibold text-white">
            {tvShow.number_of_episodes || 0}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Globe className="h-4 w-4" />
            Origin
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-200">
            {originCountries}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Activity className="h-4 w-4" />
            Status
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-200">
            {tvShow.status ||
              (tvShow.in_production ? "In Production" : "Ended")}
          </p>
        </div>
      </div>

      {/* Synopsis */}
      <div className="border-t border-slate-800 pt-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Film className="h-5 w-5 text-red-400" />
          Synopsis
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {tvShow.overview || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default TVShowInfo;
