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
        <option>All attempts</option>
        <option>Successful only</option>
      </SelectInput>
    </div>
  );
}
