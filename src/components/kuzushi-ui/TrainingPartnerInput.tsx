import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";
import { cx } from "./shared";

export function TrainingPartnerInput() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 rounded-md border border-zinc-300 bg-white p-1 text-sm font-semibold">
        {["No partner", "Training partner", "Custom"].map((mode, index) => (
          <button
            key={mode}
            className={cx("rounded px-2 py-1.5", index === 1 ? "bg-zinc-950 text-white" : "text-zinc-700")}
          >
            {mode}
          </button>
        ))}
      </div>
      <TrainingPartnerSelectMenu />
    </div>
  );
}
