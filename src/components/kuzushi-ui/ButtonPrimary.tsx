import type { ReactNode } from "react";

export function ButtonPrimary({ children = "Add journal entry" }: { children?: ReactNode }) {
  return (
    <button className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400">
      {children}
    </button>
  );
}
