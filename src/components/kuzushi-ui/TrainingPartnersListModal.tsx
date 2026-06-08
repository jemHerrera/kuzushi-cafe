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
import { beltBorderStyles, cx, samplePartners, type Partner } from "./shared";

export function TrainingPartnersListModal({
  onClose,
  onTitleChange,
  onSelectPartner,
  withinDialog = false,
}: {
  onClose?: () => void;
  onTitleChange?: (title: string) => void;
  onSelectPartner?: (partner: Partner) => void;
  withinDialog?: boolean;
}) {
  const [view, setView] = useState<"list" | "custom">("list");

  function openList() {
    setView("list");
    onTitleChange?.("My training partners");
  }

  function openCustomPartner() {
    setView("custom");
    onTitleChange?.("Add custom partner");
  }

  function openPublicProfile(partner: Partner) {
    onSelectPartner?.(partner);
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
      // className="p-3 sm:p-5"
    >
      <Command
        filter={(value, search, keywords) =>
          commandFilter(value, search, keywords)
        }
        className="p-0 gap-2"
      >
        <CommandInput placeholder="Search training partners" />
        <CommandList className="max-h-96">
          <CommandEmpty>No training partners found.</CommandEmpty>
          <CommandGroup>
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
                  <span className="block truncate text-sm text-zinc-950">
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
