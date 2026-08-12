import Image from "next/image";
import Link from "next/link";
import { Trophy, MessageSquare, User } from "lucide-react";

interface Reviewer {
  user_id: string;
  user_name: string;
  profile_picture: string | null;
  review_count: number;
}

// Fetch this from your API; here's a static example
const topReviewers: Reviewer[] = [
  { user_id: "1", user_name: "CinemaFan", profile_picture: null, review_count: 42 },
  { user_id: "2", user_name: "MovieBuff99", profile_picture: "/avatars/2.jpg", review_count: 38 },
  { user_id: "3", user_name: "ScreenGeek", profile_picture: null, review_count: 35 },
];

export function TopReviewers() {
  if (topReviewers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
        <Trophy className="h-4 w-4 text-amber-400" />
        Top Reviewers
      </div>
      <ul className="space-y-3">
        {topReviewers.map((reviewer, index) => (
          <li key={reviewer.user_id} className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 w-4">{index + 1}.</span>
            <Link
              href={`/users/${reviewer.user_id}`}
              className="flex items-center gap-2 flex-1 min-w-0 group"
            >
              {reviewer.profile_picture ? (
                <Image
                  src={reviewer.profile_picture}
                  alt={reviewer.user_name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                </span>
              )}
              <span className="text-sm text-slate-200 truncate group-hover:text-red-400">
                {reviewer.user_name}
              </span>
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MessageSquare className="h-3 w-3" />
              {reviewer.review_count}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}