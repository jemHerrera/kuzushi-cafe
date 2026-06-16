import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonSecondaryProps = Omit<ComponentProps<typeof Button>, "variant"> & {
  variant?: "default" | "small";
};

const buttonSecondaryVariants: Record<
  NonNullable<ButtonSecondaryProps["variant"]>,
  string
> = {
  default: "h-10 gap-2 rounded-md px-4 font-semibold",
  small: "h-8 gap-1.5 rounded-md px-3 text-xs font-semibold",
};

export function ButtonSecondary({
  children = "Cancel",
  className,
  variant = "default",
  ...props
}: ButtonSecondaryProps) {
  return (
    <Button
      variant="outline"
      className={cn(buttonSecondaryVariants[variant], className)}
      {...props}
    >
      {children}
    </Button>
  );
}
