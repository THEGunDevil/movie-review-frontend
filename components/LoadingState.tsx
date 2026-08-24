import { Loader2 } from "lucide-react";

export function LoadingState({state}:{state: string}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
        </div>
        <span className="text-sm text-slate-500">Loading {state}...</span>
      </div>
    </div>
  );
}
