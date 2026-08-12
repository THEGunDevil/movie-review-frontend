import { Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function WatchlistCard({ watchlist }: { watchlist: string[] }) {
  return (
    <Card
      id="watchlist"
      className="rounded-lg border-0 bg-white ring-1 ring-[#dfe4ec]"
    >
      <CardHeader className="rounded-none">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="size-5 text-[#12a89d]" />
          Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {watchlist.map((movie, index) => (
          <div
            key={movie}
            className="flex items-center justify-between border-b border-[#eef1f5] pb-3 last:border-0 last:pb-0"
          >
            <span className="font-medium">{movie}</span>
            <span className="text-sm text-[#7b746f]">0{index + 1}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
