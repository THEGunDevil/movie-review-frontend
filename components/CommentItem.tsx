import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Review } from "@/models/Review";

interface CommentItemProps {
  comment: Review;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3">
      {comment.profile_picture ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
          <Image
            src={comment.profile_picture}
            alt={comment.user_name}
            width={30}
            height={30}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
          <User className="h-4 w-4 text-slate-500" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/50 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/users/${comment.user_id}`}
              className="text-xs font-semibold text-slate-300 hover:text-red-400"
            >
              {comment.user_name}
            </Link>
            <span className="shrink-0 text-[10px] text-slate-600">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-400">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}
