import { Plus } from "lucide-react";

import type { AggregateStatsDetail, Category } from "@/lib/managers/types";
import { ButtonPrimary } from "./ButtonPrimary";
import type {
  AggregateTimeline,
  AggregateTypeFilter,
} from "./AggregateViewFilters";
import { StatsChart } from "./StatsChart";
import { StatsRow } from "./StatsRow";

const categoryPluralLabels: Record<Category, string> = {
  submission: "submissions",
  takedown: "takedowns",
  sweep: "sweeps",
  "guard-pass": "guard passes",
  reversal: "reversals",
  "back-take": "back takes",
  "leg-entry": "leg entries",
  escape: "escapes",
  tap: "taps",
  "off-balance": "off-balances",
  position: "positions",
  "guard-retention": "guard retentions",
  other: "other techniques",
};

const timelinePhrases: Record<AggregateTimeline, string> = {
  week: "this week",
  month: "this month",
  year: "this year",
  all: "of all time",
};

export function AggregateView({
  category = "submission",
  data,
  onAddEntry,
  typeFilter = "all",
  timeline = "month",
}: {
  category?: Category;
  data: AggregateStatsDetail;
  onAddEntry?: () => void;
  typeFilter?: AggregateTypeFilter;
  timeline?: AggregateTimeline;
}) {
  const hasData = data.stats.length > 0;
  const categoryLabel = categoryPluralLabels[category];
  const activityLabel = formatActivityLabel(
    category,
    categoryLabel,
    typeFilter,
  );

  return (
    <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-zinc-950">
            {capitalize(categoryLabel)}
          </h3>
          <p className="text-sm text-zinc-500">
            Your {activityLabel} {timelinePhrases[timeline]}.
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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatActivityLabel(
  category: Category,
  categoryLabel: string,
  typeFilter: AggregateTypeFilter,
) {
  if (category === "tap" || typeFilter === "all") return categoryLabel;
  if (typeFilter === "success") return `successful ${categoryLabel}`;
  return `${singularCategoryLabels[category]} attempts`;
}

const singularCategoryLabels: Record<Category, string> = {
  submission: "submission",
  takedown: "takedown",
  sweep: "sweep",
  "guard-pass": "guard pass",
  reversal: "reversal",
  "back-take": "back take",
  "leg-entry": "leg entry",
  escape: "escape",
  tap: "tap",
  "off-balance": "off-balance",
  position: "position",
  "guard-retention": "guard retention",
  other: "other technique",
};
