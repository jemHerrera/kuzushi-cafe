"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { CustomPartnerInput } from "./CustomPartnerInput";
import { ModalFrame } from "./ModalFrame";
import { PublicProfile } from "./PublicProfile";
import {
  beltBorderStyles,
  cx,
  samplePartners,
  type Partner,
} from "./shared";

export function TrainingPartnersListModal({
  onClose,
  onTitleChange,
  withinDialog = false,
}: {
  onClose?: () => void;
  onTitleChange?: (title: string) => void;
  withinDialog?: boolean;
}) {
  const [view, setView] = useState<"list" | "custom">("list");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  function openList() {
    setSelectedPartner(null);
    setView("list");
    onTitleChange?.("My training partners");
  }

  function openCustomPartner() {
    setSelectedPartner(null);
    setView("custom");
    onTitleChange?.("Add custom partner");
  }

  function openPublicProfile(partner: Partner) {
    setSelectedPartner(partner);
    onTitleChange?.("Public profile");
  }

  if (selectedPartner) {
    return (
      <PublicProfile
        partner={selectedPartner}
        onClose={onClose}
        withinDialog={withinDialog}
      />
    );
  }

  if (view === "custom") {
    return (
      <CustomPartnerInput
        onBack={openList}
        onClose={onClose}
        withinDialog={withinDialog}
      />
    );
  }

  return (
    <ModalFrame
      title="My training partners"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <Command
        className="border border-zinc-200"
        filter={(value, search, keywords) =>
          commandFilter(value, search, keywords)
        }
      >
        <CommandInput placeholder="Search training partners" />
        <CommandList className="max-h-96">
          <CommandEmpty>No training partners found.</CommandEmpty>
          <CommandGroup heading="Training partners">
            {samplePartners.map((partner) => (
              <CommandItem
                key={`${partner.firstName}-${partner.lastName}`}
                keywords={[
                  partner.firstName,
                  partner.lastName,
                  `${partner.firstName} ${partner.lastName}`,
                  partner.belt,
                  partner.weight,
                  formatAgeClass(partner.age),
                ]}
                value={`${partner.firstName}-${partner.lastName}`}
                className="min-h-10 gap-3 rounded-md px-3 py-2 cursor-pointer"
                onSelect={() => openPublicProfile(partner)}
              >
                <span
                  className={cx(
                    "inline-flex shrink-0 rounded-full border-[3px] p-0",
                    beltBorderStyles[partner.belt],
                  )}
                >
                  <Avatar initials={partner.initials} size="xs" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-950">
                    {partner.firstName} {partner.lastName}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <ButtonPrimary
        className="w-full"
        onClick={openCustomPartner}
        type="button"
      >
        <Plus className="size-4" />
        Add custom training partner
      </ButtonPrimary>
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

function formatAgeClass(age: Partner["age"]) {
  return age === "young-adult" ? "young adult" : age;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
