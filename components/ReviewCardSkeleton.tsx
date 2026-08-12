export function ReviewCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-4 flex-1">
          <div className="h-16 w-12 sm:h-20 sm:w-14 rounded-lg bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-3 w-12 rounded bg-slate-800" />
              <div className="h-3 w-16 rounded bg-slate-800" />
              <div className="h-3 w-20 rounded bg-slate-800" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-12 rounded-full bg-slate-800" />
          <div className="h-8 w-8 rounded-md bg-slate-800" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-3/4 rounded bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-800" />
      </div>
      <div className="mt-5 flex gap-4 border-t border-slate-800/60 pt-4">
        <div className="h-4 w-16 rounded bg-slate-800" />
        <div className="h-4 w-12 rounded bg-slate-800" />
        <div className="ml-auto h-4 w-12 rounded bg-slate-800" />
      </div>
    </div>
  );
}