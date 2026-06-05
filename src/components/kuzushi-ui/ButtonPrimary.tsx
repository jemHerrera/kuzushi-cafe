import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonPrimary({
  children = "Add journal entry",
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("h-10 gap-2 rounded-md px-4 font-semibold", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
