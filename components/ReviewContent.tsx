import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ShieldAlert, X } from "lucide-react";

interface ReviewContentProps {
  content: string;
  containsSpoilers: boolean;
  isEditing: boolean;
  editContent: string;
  onEditChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  isSaving: boolean;
}

export function ReviewContent({
  content,
  containsSpoilers,
  isEditing,
  editContent,
  onEditChange,
  onCancelEdit,
  onSaveEdit,
  isSaving,
}: ReviewContentProps) {
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  if (isEditing) {
    return (
      <div className="mt-5">
        <textarea
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          rows={5}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm leading-relaxed text-slate-200 outline-none focus:border-slate-500"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancelEdit} className="text-slate-500 hover:text-slate-300">
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button size="sm" disabled={!editContent.trim() || isSaving} onClick={onSaveEdit} className="bg-red-600 hover:bg-red-500">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-1 h-4 w-4" /> Save</>}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-5">
      {containsSpoilers && !spoilerRevealed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur-md">
          <Button size="sm" onClick={() => setSpoilerRevealed(true)} className="gap-2 bg-slate-800 text-slate-200 hover:bg-slate-700">
            <ShieldAlert className="h-4 w-4 text-red-400" /> Reveal Spoiler
          </Button>
        </div>
      )}
      <p
        className={`wrap-break-word text-sm text-slate-400 ${
          containsSpoilers && !spoilerRevealed ? "select-none opacity-20 blur-[3px]" : ""
        }`}
      >
        {content}
      </p>
    </div>
  );
}