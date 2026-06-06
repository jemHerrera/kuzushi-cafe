"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ButtonSecondary } from "./ButtonSecondary";
import { CustomPartnerInput } from "./CustomPartnerInput";
import { ModalFrame } from "./ModalFrame";
import { PublicProfile } from "./PublicProfile";
import { TrainingPartnerSearch } from "./TrainingPartnerSearch";
import { UserSummary } from "./UserSummary";
import { getPartnerProfileMeta, samplePartners, type Partner } from "./shared";

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
    onTitleChange?.("Training partners");
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
      title="Training partners"
      onClose={onClose}
      withinDialog={withinDialog}
    >
      <TrainingPartnerSearch />
      <div className="grid gap-2">
        {samplePartners.map((partner) => (
          <button
            aria-label={`View ${partner.firstName} ${partner.lastName} public profile`}
            key={`${partner.firstName}-${partner.lastName}`}
            className="rounded-md border border-zinc-200 bg-white p-2 text-left transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={() => openPublicProfile(partner)}
            type="button"
          >
            <UserSummary
              partner={partner}
              className="min-w-0"
              meta={getPartnerProfileMeta(partner)}
            />
          </button>
        ))}
      </div>
      <ButtonSecondary onClick={openCustomPartner} type="button">
        <Plus className="size-4" />
        Add custom training partner
      </ButtonSecondary>
    </ModalFrame>
  );
}
