"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "./Avatar";
import { beltBorderStyles, cx, samplePartners, type Partner } from "./shared";

export function PublicProfileSearch({
  profiles = samplePartners,
}: {
  profiles?: Partner[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        className="flex h-11 w-full items-center gap-3 rounded-md border border-input bg-white px-3 text-left text-sm text-zinc-500 shadow-sm transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="size-4 shrink-0 text-zinc-400" />
        <span className="min-w-0 flex-1 truncate">Search public profiles</span>
      </button>
      <DialogContent
        className="overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Search public profiles</DialogTitle>
          <DialogDescription className="sr-only">
            Find training partners.
          </DialogDescription>
        </DialogHeader>
        <Command
          filter={(value, search, keywords) =>
            commandFilter(value, search, keywords)
          }
        >
          <CommandInput placeholder="Search training partners" />
          <CommandList className="max-h-96">
            <CommandEmpty>No profiles found.</CommandEmpty>
            <CommandGroup heading="Public profiles">
              {profiles.map((profile) => (
                <CommandItem
                  key={`${profile.firstName}-${profile.lastName}`}
                  keywords={[
                    profile.firstName,
                    profile.lastName,
                    `${profile.firstName} ${profile.lastName}`,
                    profile.belt,
                    profile.weight,
                    formatAgeClass(profile.age),
                  ]}
                  value={`${profile.firstName}-${profile.lastName}`}
                  className="min-h-10 gap-3 rounded-md px-3 py-2 cursor-pointer"
                  onSelect={() => setIsOpen(false)}
                >
                  <span
                    className={cx(
                      "inline-flex shrink-0 rounded-full border-[3px] p-0",
                      beltBorderStyles[profile.belt],
                    )}
                  >
                    <Avatar initials={profile.initials} size="xs" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-zinc-950">
                      {profile.firstName} {profile.lastName}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
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

function formatAgeClass(age: Partner["age"]) {
  return age === "young-adult" ? "young adult" : age;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
