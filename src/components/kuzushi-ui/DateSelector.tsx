import { Input } from "@/components/ui/input";

export function DateSelector() {
  return (
    <Input
      className="h-11 rounded-md bg-white px-3 text-sm text-zinc-900"
      defaultValue="2026-06-03"
      type="date"
    />
  );
}
