import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonSecondary({
  children = "Cancel",
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn("h-10 gap-2 rounded-md px-4 font-semibold", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
