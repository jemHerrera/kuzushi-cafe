import type { ComponentProps } from "react";
import { Search } from "./Search";

export function SavedTechniqueSearch(
  props: Omit<ComponentProps<typeof Search>, "placeholder">,
) {
  return <Search placeholder="Search saved techniques" {...props} />;
}
