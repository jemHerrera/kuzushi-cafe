import type { ComponentProps } from "react";
import { Command, CommandInput } from "@/components/ui/command";

export function TrainingPartnerSearch(
  props: Omit<ComponentProps<typeof CommandInput>, "placeholder">,
) {
  return (
    <Command className="gap-2 p-0">
      <CommandInput placeholder="Search training partners" {...props} />
    </Command>
  );
}
