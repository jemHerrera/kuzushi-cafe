import { ButtonSecondary } from "./ButtonSecondary";

export function DonationBanner() {
  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-zinc-950">Keep Kuzushi Cafe free</p>
      <p className="mt-1 text-sm text-zinc-700">
        Support hosting, maintenance, and public technique data.
      </p>
      <div className="mt-3">
        <ButtonSecondary>Donate</ButtonSecondary>
      </div>
    </aside>
  );
}
