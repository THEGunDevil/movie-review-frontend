import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-400">
      <AlertCircle className="h-12 w-12 text-red-500/80" />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-200">Failed to load reviews</h2>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry} className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800">
        Try again
      </Button>
    </div>
  );
}