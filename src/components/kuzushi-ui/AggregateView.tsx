import { Plus } from "lucide-react";

import type { AggregateStatsDetail, Category } from "@/lib/managers/types";
import { ButtonPrimary } from "./ButtonPrimary";
import type { AggregateTypeFilter } from "./AggregateViewFilters";
import { StatsChart } from "./StatsChart";
import { StatsRow } from "./StatsRow";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { formatCategoryLabel } from "./shared";

export function AggregateView({
  category = "submission",
  data,
  onAddEntry,
  typeFilter = "all",
}: {
  category?: Category;
  data: AggregateStatsDetail;
  onAddEntry?: () => void;
  typeFilter?: AggregateTypeFilter;
}) {
  const hasData = data.stats.length > 0;

  return (
    <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-zinc-950">
            {" "}
            {formatCategoryLabel(category)}s
          </h3>
          <p className="text-sm text-zinc-500">
            Attempts and successes across the selected period
          </p>
        </div>
      </div>
      {hasData ? (
        <>
          <StatsChart
            category={category}
            data={data.series}
            isTap={category === "tap"}
            typeFilter={typeFilter}
          />
          <div className="grid gap-x-6 sm:grid-cols-2">
            {data.stats.map((item) => (
              <StatsRow
                key={item.label}
                count={item.count}
                label={item.label}
                percentage={item.percentage}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 px-6 py-10 text-center">
          <h3 className="text-base font-bold text-zinc-950">
            No aggregate data yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
            Charts appear after journal entries matching these filters are
            created.
          </p>
          {onAddEntry ? (
            <div className="mt-4">
              <ButtonPrimary onClick={onAddEntry} type="button">
                <Plus className="size-4" />
                Add journal entry
              </ButtonPrimary>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
