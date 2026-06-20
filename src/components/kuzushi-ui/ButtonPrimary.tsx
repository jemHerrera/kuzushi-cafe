import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonPrimaryProps = Omit<ComponentProps<typeof Button>, "variant"> & {
  variant?: "default" | "small";
};

const buttonPrimaryVariants: Record<
  NonNullable<ButtonPrimaryProps["variant"]>,
  string
> = {
  default: "h-10 gap-2 rounded-md px-4 font-semibold",
  small: "h-8 gap-1.5 rounded-md px-3 text-xs font-semibold",
};

export function ButtonPrimary({
  children = "Add entry",
  className,
  variant = "default",
  ...props
}: ButtonPrimaryProps) {
  return (
    <Button
      className={cn(buttonPrimaryVariants[variant], className)}
      {...props}
    >
      {children}
    </Button>
  );
}
