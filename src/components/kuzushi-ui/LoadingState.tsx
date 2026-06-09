export function LoadingState({ label = "Loading rows" }: { label?: string }) {
  return (
    <div className="grid gap-2 rounded-lg bg-white" aria-label={label}>
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-10 animate-pulse rounded-md bg-zinc-100" />
      ))}
    </div>
  );
}
