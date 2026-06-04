import { ModalFrame } from "./ModalFrame";
import { cx } from "./shared";

export function PrivacySettings() {
  const rows = [
    "Profile",
    "Journal entries",
    "Submissions",
    "Sweeps",
    "Reversals",
    "Back takes",
    "Guard passes",
    "Taps",
  ];

  return (
    <ModalFrame title="Privacy settings">
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 p-3">
            <span className="text-sm font-semibold text-zinc-900">{row}</span>
            <div className="grid grid-cols-3 rounded-md border border-zinc-300 bg-white p-1 text-xs font-semibold">
              {["Public", "Partners", "Private"].map((option, index) => (
                <button key={option} className={cx("rounded px-2 py-1.5", index === 1 && "bg-zinc-950 text-white")}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalFrame>
  );
}
