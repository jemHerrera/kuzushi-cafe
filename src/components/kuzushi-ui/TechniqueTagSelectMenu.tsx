import { Plus } from "lucide-react";
import { Search } from "./Search";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { sampleTechniques, type Technique } from "./shared";

export function TechniqueTagSelectMenu({
  techniques = sampleTechniques,
  search = "arm",
}: {
  techniques?: Technique[];
  search?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <Search placeholder="Find or add a technique" />
      <div className="mt-3 grid gap-2">
        {techniques.map((technique) => (
          <button
            key={technique.name}
            className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-50"
          >
            <span className="font-medium text-zinc-900">{technique.name}</span>
            <TechniqueCategoryPill category={technique.category} />
          </button>
        ))}
        <button className="inline-flex items-center gap-2 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-left text-sm font-semibold text-zinc-900">
          <Plus className="size-4" />
          Add &quot;{search}&quot;
        </button>
      </div>
    </div>
  );
}
