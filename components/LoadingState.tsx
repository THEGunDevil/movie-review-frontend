import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <span className="text-sm text-slate-500">Loading reviews...</span>
      </div>
    </div>
  );
}