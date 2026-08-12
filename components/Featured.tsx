import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, ArrowRight, Calendar, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/models/movie";
export default function FeaturedReview({ movie }: { movie: Movie }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const overviewSnippet = movie.overview
    ? movie.overview.length > 250
      ? movie.overview.substring(0, 250) + "…"
      : movie.overview
    : "No overview available.";

  return (
    <section className="border-b relative h-lvh border-slate-800 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
        {/* ── Right: Poster + Overlay ── */}
        {movie.poster_path ? (

            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt={movie.title}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
              fill
              priority
            />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-600">
            <Film className="h-16 w-16" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
        <article className="flex flex-col gap-6">
          <Badge className="self-start rounded-full border-red-500/30 bg-red-600/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 backdrop-blur-sm">
            🎬 Featured Review
          </Badge>
          {/* Movie Title */}
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-xl bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {movie.title}
          </h1>
          {/* Quick info: year, rating, genres */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            {year && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {year}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {rating}
            </span>
            <div className="flex flex-wrap gap-1">
              {movie.genre_ids?.slice(0, 3).map((gid) => (
                <Badge
                  key={gid}
                  variant="outline"
                  className="border-slate-700 text-slate-400 text-[10px]"
                >
                  {gid}
                </Badge>
              ))}
            </div>
          </div>
          {/* Actions */}
        </article>
        <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-md bg-slate-950/70 border-t border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-slate-400">Now Featured</p>
              <p className="mt-1 text-xl font-bold text-white truncate">
                {movie.title}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {year && `${year}`} {movie.original_language?.toUpperCase()}
              </p>
            </div>
            <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 backdrop-blur-sm shrink-0">
              Streaming
            </Badge>
          </div>
        </div>
      </div>
      <div className="border-l-4 absolute bottom-28 border-red-500 bg-white/5 p-5 backdrop-blur-sm rounded-r-lg">
        <p className="text-xl font-semibold italic leading-snug text-slate-200">
          “{overviewSnippet.split(".")[0] ?? movie.title}”
        </p>
        <p className="mt-2 text-sm text-slate-500">
          — {movie.vote_count.toLocaleString()} audience votes
        </p>
        <div className="flex mt-2 flex-wrap gap-2">
          <Link href={`/movies/${movie.id}`}>
            <Button className="bg-red-600 text-white hover:bg-red-500 transition-colors gap-2">
              <Play className="h-4 w-4 fill-white" />
              View Details
            </Button>
          </Link>
          <Link href={`/movies/${movie.id}#reviews`}>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Read Review
            </Button>
          </Link>
        </div>
        {/* Stats cards */}
        <div className="grid grid-cols-3 mt-5 gap-3 max-w-sm">
          {[
            { label: "Rating", value: `${rating}/10` },
            {
              label: "Votes",
              value: movie.vote_count?.toLocaleString() ?? "0",
            },
            {
              label: "Popularity",
              value: movie.popularity?.toFixed(0) ?? "0",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="md:text-lg text-sm font-bold text-white">
                {stat.value}
              </dt>
              <dd className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                {stat.label}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
