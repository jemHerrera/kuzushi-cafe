import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IconButton({
  label,
  icon,
  className,
  ...props
}: {
  label: string;
  icon: ReactNode;
} & Omit<ComponentProps<typeof Button>, "children" | "size">) {
  return (
    <Button
      aria-label={label}
      title={label}
      variant="outline"
      size="icon-lg"
      className={cn("rounded-md text-zinc-700", className)}
      {...props}
    >
      {icon}
    </Button>
  );
}
