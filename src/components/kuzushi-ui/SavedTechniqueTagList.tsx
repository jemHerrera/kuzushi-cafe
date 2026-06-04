import { ButtonPrimary } from "./ButtonPrimary";
import { SavedTechniqueSearch } from "./SavedTechniqueSearch";
import { SavedTechniqueTagItem } from "./SavedTechniqueTagItem";
import { SavedTechniqueUpsert } from "./SavedTechniqueUpsert";
import { sampleTechniques } from "./shared";

export function SavedTechniqueTagList() {
  return (
    <aside className="grid max-w-md gap-3 border-l border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-950">Saved techniques</h3>
        <ButtonPrimary>Add</ButtonPrimary>
      </div>
      <SavedTechniqueSearch />
      {sampleTechniques.map((technique) => (
        <SavedTechniqueTagItem key={technique.name} technique={technique} />
      ))}
      <SavedTechniqueUpsert />
    </aside>
  );
}
