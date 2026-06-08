"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AggregateTypeFilter } from "./AggregateViewFilters";
import type { TechniqueAggregate } from "./AggregateOverview";
import type { Category } from "./shared";

const categoryChartColors: Record<Category, { light: string; strong: string }> =
  {
    submission: { light: "#fda4af", strong: "#be123c" },
    sweep: { light: "#fcd34d", strong: "#b45309" },
    reversal: { light: "#7dd3fc", strong: "#0369a1" },
    "back take": { light: "#c4b5fd", strong: "#6d28d9" },
    "guard pass": { light: "#6ee7b7", strong: "#047857" },
    tap: { light: "#d4d4d8", strong: "#3f3f46" },
  };

export function StatsChart({
  category = "submission",
  data = [],
  typeFilter = "all",
  isTap = false,
}: {
  category?: Category;
  data?: TechniqueAggregate[];
  typeFilter?: AggregateTypeFilter;
  isTap?: boolean;
}) {
  const colors = categoryChartColors[category];
  const chartConfig = {
    attempts: {
      label: "Attempts",
      color: colors.light,
    },
    successes: {
      label: "Successes",
      color: colors.strong,
    },
    occurrences: {
      label: "Occurrences",
      color: colors.strong,
    },
  } satisfies ChartConfig;
  const minimumChartWidth = Math.max(320, data.length * 100);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <ChartContainer
        className="h-88 min-h-88 aspect-auto"
        config={chartConfig}
        style={{ minWidth: minimumChartWidth, width: "100%" }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            angle={-35}
            dataKey="technique"
            height={100}
            interval={0}
            tickLine={false}
            tickMargin={12}
            textAnchor="end"
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {!isTap && typeFilter !== "success" ? (
            <Bar
              dataKey="attempts"
              fill="var(--color-attempts)"
              maxBarSize={48}
              radius={typeFilter === "all" ? [0, 0, 4, 4] : 4}
              stackId={typeFilter === "all" ? "type" : undefined}
            />
          ) : null}
          {!isTap && typeFilter !== "attempt" ? (
            <Bar
              dataKey="successes"
              fill="var(--color-successes)"
              maxBarSize={48}
              radius={4}
              stackId={typeFilter === "all" ? "type" : undefined}
            />
          ) : null}
          {isTap ? (
            <Bar
              dataKey="occurrences"
              fill="var(--color-occurrences)"
              maxBarSize={48}
              radius={4}
            />
          ) : null}
          {!isTap ? <ChartLegend content={<ChartLegendContent />} /> : null}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
