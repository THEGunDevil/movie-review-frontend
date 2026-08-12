// components/AuthLayout.tsx
"use client";

import { ReactNode } from "react";
import { Film, Star, Clapperboard, Popcorn } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0b10] flex">
      {/* ── Left Immersive Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Deep cinematic background with spotlight effect */}
        <div className="absolute inset-0 bg-linear-to-br from-stone-900 via-[#1a1110] to-[#0a0b10]" />

        {/* Large spotlight / projector beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-150 w-150 rounded-full bg-amber-500/20 blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-amber-500/10 to-transparent" />

        {/* Film strip accent on the side (no grid, just a decorative bar) */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-linear-to-b from-amber-500/30 via-rose-500/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
              <Film className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              Cine<span className="text-amber-400">Critic</span>
            </span>
          </Link>

          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300/80 border border-amber-400/20 rounded-full bg-amber-400/10 backdrop-blur-sm">
                Film Review Platform
              </span>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1]">
              Where <span className="text-amber-400">opinions</span>
              <br />
              meet the <span className="text-rose-400">big screen</span>.
            </h2>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed font-light">
              Rate, review, and discover films curated by passionate critics.
              Your next favorite movie is one review away.
            </p>

            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-gray-300">Honest Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-rose-400" />
                <span className="text-sm font-medium text-gray-300">Latest Trailers</span>
              </div>
              <div className="flex items-center gap-2">
                <Popcorn className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-gray-300">Watchlist</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 tracking-widest uppercase">
            © 2026 CineCritic Studios
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#0f1117]">
        {/* Mobile-only background ambiance */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-sm relative z-10">{children}</div>
      </div>
    </div>
  );
}