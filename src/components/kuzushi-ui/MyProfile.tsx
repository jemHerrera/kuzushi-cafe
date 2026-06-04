import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { ProfileFields } from "./ProfileFields";

export function MyProfile() {
  return (
    <ModalFrame title="My profile">
      <Avatar initials="JH" size="lg" />
      <ProfileFields />
      <ButtonPrimary>Save profile</ButtonPrimary>
    </ModalFrame>
  );
}
