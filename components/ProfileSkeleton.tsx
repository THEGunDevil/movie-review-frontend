import { useAuth } from "@/context/AuthContext";

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8">
      <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <div className="flex gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 rounded bg-slate-800" />
            <div className="h-4 w-32 rounded bg-slate-800" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded bg-slate-800" />
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-800/50" />
        ))}
      </div>
    </div>
  );
}