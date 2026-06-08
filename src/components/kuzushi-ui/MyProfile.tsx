"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { ProfileFields, sampleProfileValue } from "./ProfileFields";

export function MyProfile({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  const [profile, setProfile] = useState(sampleProfileValue);

  return (
    <ModalFrame
      title="My profile"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <div className="grid gap-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start">
        <Avatar initials="JH" size="lg" />
        <div className="grid gap-4">
          <ProfileFields value={profile} onChange={setProfile} />
          <div className="flex justify-end">
            <ButtonPrimary>Save profile</ButtonPrimary>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}
