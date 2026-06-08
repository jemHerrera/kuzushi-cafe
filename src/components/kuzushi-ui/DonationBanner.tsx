import { ButtonPrimary } from "./ButtonPrimary";

export function DonationBanner({ onDonate }: { onDonate?: () => void }) {
  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-zinc-950">
        Support Kuzushi Cafe
      </p>
      <p className="mt-1 text-sm text-zinc-700">
        This app is completely free and ad-free. Donations will help a lot in
        supporting hosting and maintenance.
      </p>
      <div className="mt-3">
        <ButtonPrimary onClick={onDonate} type="button">
          Donate
        </ButtonPrimary>
      </div>
    </aside>
  );
}
