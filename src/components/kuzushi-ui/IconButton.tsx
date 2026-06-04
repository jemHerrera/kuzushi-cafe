import type { ReactNode } from "react";

export function IconButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
    >
      {icon}
    </button>
  );
}
