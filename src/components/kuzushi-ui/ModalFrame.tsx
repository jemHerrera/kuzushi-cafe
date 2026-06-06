import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ModalFrame({
  title,
  children,
  onClose,
  withinDialog = false,
  className,
}: {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  withinDialog?: boolean;
  className?: string;
}) {
  const heading = !title ? null : withinDialog ? (
    <DialogHeader>
      <DialogTitle className="text-lg font-bold text-zinc-950">
        {title}
      </DialogTitle>
    </DialogHeader>
  ) : (
    <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
  );

  return (
    <section
      className={cn(
        "grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div
        className={`flex items-center gap-4 ${title ? "justify-between" : "justify-end"}`}
      >
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
