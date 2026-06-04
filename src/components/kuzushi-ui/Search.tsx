export function Search({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
        /
      </span>
      <input
        className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
        placeholder={placeholder}
      />
    </label>
  );
}
