import { SelectInput } from "./shared";

export function AggregateViewFilters() {
  return (
    <div className="flex flex-wrap gap-2">
      <SelectInput>
        <option>This month</option>
        <option>This week</option>
        <option>This year</option>
        <option>Custom range</option>
      </SelectInput>
      <SelectInput>
        <option>All types</option>
        <option>Attempt only</option>
        <option>Success only</option>
      </SelectInput>
    </div>
  );
}
