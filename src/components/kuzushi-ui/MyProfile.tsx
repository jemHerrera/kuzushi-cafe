import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { ProfileFields } from "./ProfileFields";

export function MyProfile({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <ModalFrame title="My profile" onClose={onClose} withinDialog={withinDialog}>
      <Avatar initials="JH" size="lg" />
      <ProfileFields />
      <ButtonPrimary>Save profile</ButtonPrimary>
    </ModalFrame>
  );
}
