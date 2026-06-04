import { AggregateOverview } from "./AggregateOverview";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { JournalEntryTable } from "./JournalEntryTable";
import { ModalFrame } from "./ModalFrame";

export function PublicProfile() {
  return (
    <ModalFrame title="Public profile">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar initials="MC" size="lg" />
        <div>
          <h3 className="text-xl font-bold text-zinc-950">Maya Chen</h3>
          <p className="text-sm text-zinc-600">Purple belt - 145 lb</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <ButtonPrimary>Add partner</ButtonPrimary>
          <ButtonSecondary>Remove</ButtonSecondary>
        </div>
      </div>
      <AggregateOverview />
      <JournalEntryTable />
    </ModalFrame>
  );
}
