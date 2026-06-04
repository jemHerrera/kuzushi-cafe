import type { ReactNode } from "react";

export function ButtonSecondary({ children = "Cancel" }: { children?: ReactNode }) {
  return (
    <button className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
      {children}
    </button>
  );
}
