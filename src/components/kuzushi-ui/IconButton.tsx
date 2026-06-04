import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function IconButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <Button
      aria-label={label}
      title={label}
      variant="outline"
      size="icon-lg"
      className="rounded-md text-zinc-700"
    >
      {icon}
    </Button>
  );
}
