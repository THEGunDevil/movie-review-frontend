"use client";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Film, Play, Star } from "lucide-react";
import { Genre, Movie } from "@/models/movie";
import { useMovies } from "@/hooks/useMovies";
import { getGenreName } from "@/lib/helpers";
import { useEffect } from "react";
function MovieCard({ movie }: { movie: Movie }) {
  const { genreData, fetchGenres } = useMovies()
  useEffect(() => {
    fetchGenres()
  },[fetchGenres])
  const genres: Genre[] = genreData?.data  
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="group relative h-full overflow-hidden border-slate-800 bg-slate-900/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10">
        <div className="aspect-2/3 overflow-hidden relative">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-800 text-slate-600">
              <Film className="h-12 w-12" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="rounded-full bg-red-600/90 p-3 shadow-lg">
              <Play className="h-6 w-6 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 z-10">
            <Badge className="bg-black/70 backdrop-blur-sm flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold leading-tight text-slate-100 line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {movie.release_date
              ? (() => {
                  const date = new Date(movie.release_date);
                  return isNaN(date.getTime()) ? "TBA" : date.getFullYear();
                })()
              : "TBA"}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {movie?.genre_ids?.map((gid: number) => (
              <Badge key={gid} variant="secondary" className="text-[10px]">
                {getGenreName(gid,genres)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default MovieCard;
