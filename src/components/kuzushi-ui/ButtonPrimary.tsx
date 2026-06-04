import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ButtonPrimary({ children = "Add journal entry" }: { children?: ReactNode }) {
  return (
    <Button className="h-10 gap-2 rounded-md px-4 font-semibold">
      {children}
    </Button>
  );
}
