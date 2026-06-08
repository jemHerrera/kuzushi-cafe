export function StatsRow({
  label = "Armbar from closed guard",
  count = 7,
  percentage = 44,
}: {
  label?: string;
  count?: number;
  percentage?: number;
}) {
  return (
    <div className="grid gap-2 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="min-w-0 truncate font-medium text-zinc-800">
          {label}
        </span>
        <span className="shrink-0 tabular-nums text-zinc-600">
          {count} / {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-950"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
