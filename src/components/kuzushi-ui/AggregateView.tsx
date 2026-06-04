import { AggregateViewFilters } from "./AggregateViewFilters";
import { StatsChart } from "./StatsChart";
import { StatsRow } from "./StatsRow";

export function AggregateView({ title = "Submissions" }: { title?: string }) {
  return (
    <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
        <AggregateViewFilters />
      </div>
      <StatsChart />
      <div className="grid gap-3">
        <StatsRow label="Attempts" count={25} percentage={78} />
        <StatsRow label="Successful" count={18} percentage={72} />
      </div>
    </section>
  );
}
