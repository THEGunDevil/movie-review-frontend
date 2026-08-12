import Link from "next/link";
import { Film, Tv, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-12 w-12 text-slate-600 mb-4" />
      <h3 className="text-lg font-semibold text-slate-300">No reviews found</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        We couldn't find any reviews matching your criteria. Try adjusting your
        filters, or discover something new to watch.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {onClearFilters && (
          <Button
            variant="outline"
            className="border-slate-800 text-slate-300 hover:bg-slate-800"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
        <Link href="/movies">
          <Button className="bg-red-600 hover:bg-red-500 text-white">
            <Film className="mr-2 h-4 w-4" /> Explore Movies
          </Button>
        </Link>
        <Link href="/tv">
          <Button className="bg-red-600 hover:bg-red-500 text-white">
            <Tv className="mr-2 h-4 w-4" /> Explore TV Shows
          </Button>
        </Link>
      </div>
    </div>
  );
}