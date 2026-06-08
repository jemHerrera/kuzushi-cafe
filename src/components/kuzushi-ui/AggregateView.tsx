import { StatsChart } from "./StatsChart";
import { StatsRow } from "./StatsRow";
import type { AggregateTypeFilter } from "./AggregateViewFilters";
import type { TechniqueAggregate } from "./AggregateOverview";
import type { Category } from "./shared";

const fallbackData: TechniqueAggregate[] = [
  {
    technique: "Armbar from closed guard",
    attempts: 4,
    successes: 3,
    occurrences: 7,
  },
  {
    technique: "Triangle choke",
    attempts: 3,
    successes: 2,
    occurrences: 5,
  },
  {
    technique: "Rear naked choke",
    attempts: 2,
    successes: 2,
    occurrences: 4,
  },
];

export function AggregateView({
  category = "submission",
  data = fallbackData,
  typeFilter = "all",
}: {
  category?: Category;
  data?: TechniqueAggregate[];
  typeFilter?: AggregateTypeFilter;
}) {
  const totalOccurrences = data.reduce(
    (total, item) => total + item.occurrences,
    0,
  );

  return (
    <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <h3 className="text-lg font-bold capitalize text-zinc-950">
          {category}
        </h3>
        <p className="text-sm text-zinc-500">
          Technique occurrences for the selected period
        </p>
      </div>
      {data.length ? (
        <>
          <StatsChart
            category={category}
            data={data}
            isTap={category === "tap"}
            typeFilter={typeFilter}
          />
          <div className="divide-y divide-zinc-200">
            {data.map((item) => (
              <StatsRow
                key={item.technique}
                count={item.occurrences}
                label={item.technique}
                percentage={
                  totalOccurrences
                    ? Math.round((item.occurrences / totalOccurrences) * 100)
                    : 0
                }
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-12 text-center text-sm text-zinc-500">
          No techniques match these filters.
        </div>
      )}
    </section>
  );
}
