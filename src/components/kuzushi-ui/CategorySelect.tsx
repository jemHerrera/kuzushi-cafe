import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { categories } from "./shared";

export function CategorySelect() {
  return (
    <div className="grid gap-3">
      <div className="inline-grid w-fit grid-cols-2 rounded-md border border-zinc-300 bg-white p-1 text-sm font-semibold">
        <button className="rounded bg-zinc-950 px-3 py-1.5 text-white">Gi</button>
        <button className="rounded px-3 py-1.5 text-zinc-700">No-Gi</button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <button key={category} className="rounded-md border border-zinc-200 bg-white p-2 text-left">
            <TechniqueCategoryPill category={category} />
          </button>
        ))}
      </div>
    </div>
  );
}
