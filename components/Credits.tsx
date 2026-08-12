"use client";

import { CreditType, MovieCredit } from "@/models/movie";
import { Users, BriefcaseBusiness } from "lucide-react";
import Image from "next/image";
import Pagination from "./pagination";

interface CreditsProps {
  setCreditType: (type: CreditType) => void;
  creditType: CreditType;
  credits: MovieCredit[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
}

function Credits({
  setCreditType,
  creditType,
  credits,
  totalPages,
  page,
  onPageChange,
}: CreditsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/20">
      {/* Header */}
      <div className="border-b border-slate-800 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Top Cast & Crew</h2>

            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              Browse the people attached to this movie.
            </p>
          </div>
        </div>

        {/* Cast / Crew tabs */}
        <div className="mt-5 flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
          {(["cast", "crew"] as CreditType[]).map((type) => {
            const active = creditType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setCreditType(type);

                  // Reset pagination when switching type
                  onPageChange(1);
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                  active
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Credits */}
      <div className="p-5 sm:p-6">
        {credits.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {credits.map((credit) => (
              <div
                key={credit.id ?? `${credit.person_id}-${credit.role}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/60"
              >
                {/* Profile */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
                  {credit.person_profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${credit.person_profile_path}`}
                      alt={credit.person_name}
                      width={500}
                      height={750}
                      loading="eager"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Person info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {credit.person_name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-slate-500" />

                    <p className="truncate text-xs text-slate-400">
                      {credit.role || credit.department || "Contributor"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/70">
              <Users className="h-5 w-5 text-slate-500" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-300">
              No {creditType} credits available
            </h3>

            <p className="mt-1 max-w-xs text-xs text-slate-500">
              We couldn't find any {creditType} information for this movie.
            </p>
          </div>
        )}

        {/* Pagination */}
        {credits.length > 0 && totalPages > 1 && (
          <div className="mt-6 border-t border-slate-800 pt-5">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Credits;
