import Link from "next/link";
import Image from "next/image";
import { Film } from "lucide-react";
import { WatchlistItem } from "@/models/Watchlist";

export default function WatchlistCard({ item }: { item: WatchlistItem }) {
  return (
    <Link
      key={item.id}
      href={`/${item.media_type === "movie" ? "movies" : "tv"}/${item.media_id}`}
      className="group overflow-hidden rounded-xl border border-slate-800 hover:border-slate-600 transition"
    >
      <div className="relative aspect-2/3 bg-slate-800">
        {item.media_poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.media_poster_path}`}
            alt={item.media_title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Film className="h-8 w-8 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-red-400">
          {item.media_title}
        </p>
      </div>
    </Link>
  );
}
