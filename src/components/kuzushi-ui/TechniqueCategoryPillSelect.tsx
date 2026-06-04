import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { categories } from "./shared";

export function TechniqueCategoryPillSelect() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category}
            className="rounded-md border border-zinc-200 p-2 text-left hover:bg-zinc-50"
          >
            <TechniqueCategoryPill category={category} />
          </button>
        ))}
      </div>
    </div>
  );
}
