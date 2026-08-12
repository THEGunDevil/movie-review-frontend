import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 text-white">
              <Film className="h-5 w-5 text-red-500" />
              <span className="text-2xl text-slate-100 font-bold tracking-tighter">
                Cine<span className="text-amber-400">Critic</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Curated film criticism, reviews, and trailers. Built for movie
              lovers by movie lovers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Browse
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/movies" className="transition hover:text-red-400">
                  All Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=28"
                  className="transition hover:text-red-400"
                >
                  Action
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=35"
                  className="transition hover:text-red-400"
                >
                  Comedy
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=27"
                  className="transition hover:text-red-400"
                >
                  Horror
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Genres
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/movies?genre=878"
                  className="transition hover:text-red-400"
                >
                  Sci‑Fi
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=10749"
                  className="transition hover:text-red-400"
                >
                  Romance
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=18"
                  className="transition hover:text-red-400"
                >
                  Drama
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?genre=53"
                  className="transition hover:text-red-400"
                >
                  Thriller
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              About
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition hover:text-red-400">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-red-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-red-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-red-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} CineCritic. Powered by Next.js,
            TypeScript, Tailwind CSS & shadcn/ui.
          </p>
        </div>
      </div>
    </footer>
  );
}
