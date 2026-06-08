import { UserMinus, UserPlus } from "lucide-react";
import { AggregateOverview } from "./AggregateOverview";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { JournalEntryTable } from "./JournalEntryTable";
import {
  sampleEntries,
  samplePartners,
  type JournalEntry,
  type Partner,
} from "./shared";

export function PublicProfile({
  partner = samplePartners[0],
  entries = sampleEntries,
}: {
  partner?: Partner;
  entries?: JournalEntry[];
}) {
  return (
    <section className="grid w-full gap-6">
      <header className="flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-5">
        <Avatar initials={partner.initials} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-zinc-950">
            {partner.firstName} {partner.lastName}
          </h2>
          {partner.bio ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">
              {partner.bio}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <ButtonPrimary>
            <UserPlus className="size-4" />
            Add partner
          </ButtonPrimary>
          <ButtonSecondary>
            <UserMinus className="size-4" />
            Remove
          </ButtonSecondary>
        </div>
      </header>
      <AggregateOverview entries={entries} />
      <JournalEntryTable entries={entries} readOnly />
    </section>
  );
}
