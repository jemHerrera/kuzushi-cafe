import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ButtonSecondary({ children = "Cancel" }: { children?: ReactNode }) {
  return (
    <Button variant="outline" className="h-10 gap-2 rounded-md px-4 font-semibold">
      {children}
    </Button>
  );
}
