import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteControlsProps {
  review: { id: string; votes?: number };
  onVote: (id: string, vote: "up" | "down") => void;
  disabled?: boolean;
}

export function VoteControls({ review, onVote, disabled }: VoteControlsProps) {
  return (
    <div className="flex sm:flex-col items-center sm:justify-start justify-center gap-1 px-3 py-2 sm:py-4 sm:px-4">
      <button
        disabled={disabled}
        onClick={() => onVote(review.id, "up")}
        className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-green-400 disabled:opacity-50"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <span className="text-xs font-medium text-slate-400">{review.votes ?? 0}</span>
      <button
        disabled={disabled}
        onClick={() => onVote(review.id, "down")}
        className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-red-400 disabled:opacity-50"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}