import { SearchIcon } from "lucide-react";
import { forwardRef, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchProps = ComponentProps<"input">;

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { className, placeholder = "Search", ...props },
  ref,
) {
  return (
    <label className="relative block">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        strokeWidth="2"
      />
      <Input
        className={cn(
          "h-11 rounded-md bg-white pl-9 pr-3 text-sm text-zinc-900",
          className,
        )}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    </label>
  );
});
