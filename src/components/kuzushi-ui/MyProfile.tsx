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
    <ModalFrame
      title="My profile"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <div className="grid gap-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start">
        <Avatar initials="JH" size="lg" />
        <div className="grid gap-4">
          <ProfileFields />
          <div className="flex justify-end">
            <ButtonPrimary>Save profile</ButtonPrimary>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}
