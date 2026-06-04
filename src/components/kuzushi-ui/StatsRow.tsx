export function StatsRow({
  label = "Submissions",
  count = 18,
  percentage = 72,
}: {
  label?: string;
  count?: number;
  percentage?: number;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-800">{label}</span>
        <span className="text-zinc-600">
          {count} / {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full rounded-full bg-zinc-950" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
