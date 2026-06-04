export function StatsChart() {
  const bars = [54, 72, 38, 64, 47, 81];

  return (
    <div className="flex h-52 items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      {bars.map((height, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t bg-zinc-900"
            style={{ height: `${height}%` }}
            aria-label={`Chart bar ${index + 1}`}
          />
          <span className="text-xs text-zinc-500">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}
