import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <label className="relative block">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        strokeWidth="2"
      />
      <Input
        className="h-11 rounded-md bg-white pl-9 pr-3 text-sm text-zinc-900"
        placeholder={placeholder}
      />
    </label>
  );
}
