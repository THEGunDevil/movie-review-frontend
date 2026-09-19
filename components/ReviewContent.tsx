"use client";

import { useState } from "react";
import { Check, Loader2, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="mt-4">
        <textarea
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm leading-relaxed text-slate-200 outline-none focus:border-slate-500"
        />

        <div className="mt-2 flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="text-slate-500"
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>

          <Button
            size="sm"
            disabled={!editContent.trim() || isSaving}
            onClick={onSaveEdit}
            className="bg-red-600 hover:bg-red-500"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  const hidden = containsSpoilers && !spoilerRevealed;

  return (
    <div className="relative mt-4">
      {hidden && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-sm">
          <Button
            size="sm"
            onClick={() => setSpoilerRevealed(true)}
            className="h-8 gap-2 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
          >
            <ShieldAlert className="h-4 w-4 text-red-400" />
            Reveal Spoiler
          </Button>
        </div>
      )}

      <p
        className={`wrap-break-word text-sm leading-relaxed text-slate-400 ${
          hidden ? "select-none opacity-20 blur-[3px]" : ""
        }`}
      >
        {content}
      </p>
    </div>
  );
}