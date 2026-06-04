import { Pencil, Trash2 } from "lucide-react";
import { IconButton } from "./IconButton";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { sampleTechniques, type Technique } from "./shared";

export function SavedTechniqueTagItem({ technique = sampleTechniques[0] }: { technique?: Technique }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white p-3">
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-950">{technique.name}</span>
      <TechniqueCategoryPill category={technique.category} />
      <IconButton label="Edit technique" icon={<Pencil className="size-4" />} />
      <IconButton label="Delete technique" icon={<Trash2 className="size-4" />} />
    </div>
  );
}
