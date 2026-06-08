"use client";

import { useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ModalFrame } from "./ModalFrame";
import { SavedTechniqueTagItem } from "./SavedTechniqueTagItem";
import { SavedTechniqueUpsert } from "./SavedTechniqueUpsert";
import { sampleTechniques, type Category, type Technique } from "./shared";

type TechniqueListItem = Technique & { id: string };

export function SavedTechniqueTagList({
  onClose,
  withinDialog = false,
  initialTechniques = sampleTechniques,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
  initialTechniques?: Technique[];
}) {
  const nextId = useRef(initialTechniques.length);
  const [techniques, setTechniques] = useState<TechniqueListItem[]>(() =>
    initialTechniques.map((technique, index) => ({
      ...technique,
      id: `saved-technique-${index}`,
    })),
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  function updateTechnique(
    id: string,
    changes: Partial<Pick<Technique, "name" | "category">>,
  ) {
    setTechniques((current) =>
      current.map((technique) =>
        technique.id === id ? { ...technique, ...changes } : technique,
      ),
    );
  }

  function addTechnique({
    label,
    category,
  }: {
    label: string;
    category: Category;
  }) {
    const id = `saved-technique-${nextId.current}`;
    nextId.current += 1;
    setTechniques((current) => [...current, { id, name: label, category }]);
  }

  return (
    <ModalFrame
      title="Saved techniques"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
      headerAction={
        <SavedTechniqueUpsert
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSave={addTechnique}
        />
      }
    >
      <Command
        className="gap-2 p-0"
        filter={(value, search, keywords) =>
          commandFilter(value, search, keywords)
        }
      >
        <CommandInput
          aria-label="Search saved techniques"
          placeholder="Search saved techniques"
        />
        <CommandList className="max-h-96">
          <CommandEmpty>No saved techniques found.</CommandEmpty>
          <CommandGroup>
            {techniques.map((technique) => (
              <CommandItem
                key={technique.id}
                keywords={[technique.name, technique.category]}
                value={technique.id}
                className="min-h-10 cursor-default p-0 data-selected:bg-zinc-50 [&>svg:last-child]:hidden"
                onSelect={() => undefined}
              >
                <SavedTechniqueTagItem
                  technique={technique}
                  onNameChange={(name) =>
                    updateTechnique(technique.id, { name })
                  }
                  onCategoryChange={(category) =>
                    updateTechnique(technique.id, { category })
                  }
                  onDelete={() =>
                    setTechniques((current) =>
                      current.filter((item) => item.id !== technique.id),
                    )
                  }
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ModalFrame>
  );
}

function commandFilter(value: string, search: string, keywords?: string[]) {
  const normalizedSearch = normalize(search);
  const searchableValues = [value, ...(keywords ?? [])];

  if (!normalizedSearch) return 1;

  return searchableValues.some((searchableValue) =>
    normalize(searchableValue).includes(normalizedSearch),
  )
    ? 1
    : 0;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
