import { Genre, Movie } from '@/models/movie'
import { CalendarDays, Star } from 'lucide-react'
function MovieInfo({genres,movie}:{genres:Genre[],movie:Movie}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300"
                    >
                      {genre.name.trim()}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {movie.title}
              </h1>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Release
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {movie.release_date || "Unknown Date"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                    <Star className="h-4 w-4" />
                    Rating
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {movie.vote_average || "N/A"}/10
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-950/20 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm shadow-red-950/40">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <span className="text-3xl font-bold text-white">
                    {movie.vote_average || "N/A"}
                    <span className="text-lg text-slate-500">/10</span>
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {movie.vote_count.toLocaleString()} votes
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-6">
                <h2 className="text-xl font-bold text-white">Synopsis</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                  {movie.overview || "No description available."}
                </p>
              </div>
            </div>
  )
}

export default MovieInfo