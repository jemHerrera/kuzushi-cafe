import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export function ModalFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3">
        <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
        <IconButton label="Close" icon={<X className="size-4" />} />
      </div>
      {children}
    </section>
  );
}
