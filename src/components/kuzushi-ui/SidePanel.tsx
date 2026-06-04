import { ButtonPrimary } from "./ButtonPrimary";
import { DonationBanner } from "./DonationBanner";
import { PublicProfileSearch } from "./PublicProfileSearch";
import { UserSummary } from "./UserSummary";

export function SidePanel() {
  return (
    <aside className="flex h-full min-h-[720px] w-full max-w-xs flex-col border-r border-zinc-200 bg-white p-4">
      <UserSummary />
      <div className="mt-4">
        <ButtonPrimary>New entry</ButtonPrimary>
      </div>
      <div className="mt-4">
        <PublicProfileSearch />
      </div>
      <nav className="mt-4 grid gap-2 text-sm font-semibold text-zinc-800">
        {["Training partners", "My Profile", "Settings", "Saved Techniques"].map((item) => (
          <button key={item} className="rounded-md px-3 py-2 text-left hover:bg-zinc-50">
            {item}
          </button>
        ))}
      </nav>
      <div className="mt-auto grid gap-3">
        <DonationBanner />
        <a href="#" className="text-sm font-semibold text-zinc-700">
          Contact Us
        </a>
      </div>
    </aside>
  );
}
