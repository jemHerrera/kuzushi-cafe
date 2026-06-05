import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModalFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3">
        <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
        <Button
          aria-label="Close"
          title="Close"
          variant="ghost"
          size="icon-lg"
          className="rounded-md text-zinc-700"
        >
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </section>
  );
}
