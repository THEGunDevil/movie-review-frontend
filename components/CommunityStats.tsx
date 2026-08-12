import { Star } from "lucide-react";

type CommunityStatsProps = {
  totalReviews: number;
  averageRating: number;
  discussions: number;
};

function StatCard({
  label,
  value,
  description,
  icon,
  glowClass,
}: {
  label: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  glowClass: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-4">
      <div
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition ${glowClass}`}
      />

      <p className="relative text-[10px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </p>

      <div className="relative mt-1 flex items-center gap-1.5">
        {icon}

        <p className="text-xl font-black text-slate-100 sm:text-2xl">
          {value}
        </p>
      </div>

      <p className="relative mt-0.5 text-[11px] text-slate-500">
        {description}
      </p>
    </div>
  );
}

export function CommunityStats({
  totalReviews,
  averageRating,
  discussions,
}: CommunityStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
      <StatCard
        label="Community"
        value={totalReviews.toLocaleString()}
        description="Reviews"
        glowClass="bg-red-500/10 group-hover:bg-red-500/20"
      />

      <StatCard
        label="Average"
        value={averageRating.toFixed(1)}
        description="Rating"
        icon={
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        }
        glowClass="bg-amber-500/10 group-hover:bg-amber-500/20"
      />

      <StatCard
        label="Activity"
        value={discussions.toLocaleString()}
        description="Discussions"
        glowClass="bg-purple-500/10 group-hover:bg-purple-500/20"
      />
    </div>
  );
}
