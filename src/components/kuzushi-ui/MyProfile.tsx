"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import {
  ProfileFields,
  sampleProfileValue,
  type ProfileFormValue,
} from "./ProfileFields";

export function MyProfile({
  onClose,
  withinDialog = false,
  initialProfile = sampleProfileValue,
  profilePhoto,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
  initialProfile?: ProfileFormValue;
  profilePhoto?: string;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const initials =
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KC";

  return (
    <ModalFrame
      title="My profile"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <div className="grid gap-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start">
        <Avatar initials={initials} src={profilePhoto} size="lg" />
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
