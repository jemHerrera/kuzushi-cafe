import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ModalFrame({
  title,
  children,
  onClose,
  withinDialog = false,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  const heading = withinDialog ? (
    <DialogHeader>
      <DialogTitle className="text-lg font-bold text-zinc-950">
        {title}
      </DialogTitle>
    </DialogHeader>
  ) : (
    <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
  );

  return (
    <section className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3">
        {heading}
        <Button
          aria-label="Close"
          title="Close"
          type="button"
          variant="ghost"
          size="icon-lg"
          className="rounded-md text-zinc-700"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </section>
  );
}
