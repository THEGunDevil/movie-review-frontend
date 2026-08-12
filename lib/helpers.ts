import { Genre } from "@/models/movie";
import { useCallback, useState } from "react";
const initialPage = 1;
export  function GoToPage() {
  const [page, setPage] = useState<number>(initialPage);
  const goToPage = useCallback((newPage: number) => {
    if (newPage > 0) setPage(newPage);
  }, []);
  return { goToPage, page, setPage };
}
export function getGenreName(genreId: number, genres:Genre[]): string {
    const genre = genres.find((g) => g.id === genreId);
    return genre?.name ?? String(genreId);
  };