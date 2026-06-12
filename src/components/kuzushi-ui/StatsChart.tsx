"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AggregateStatsDetail, Category } from "@/lib/managers/types";
import type { AggregateTypeFilter } from "./AggregateViewFilters";

const categoryChartColors: Record<Category, { light: string; strong: string }> =
  {
    submission: { light: "#fda4af", strong: "#be123c" },
    takedown: { light: "#fdba74", strong: "#c2410c" },
    sweep: { light: "#fcd34d", strong: "#b45309" },
    "guard-pass": { light: "#6ee7b7", strong: "#047857" },
    reversal: { light: "#7dd3fc", strong: "#0369a1" },
    "back-take": { light: "#c4b5fd", strong: "#6d28d9" },
    "leg-entry": { light: "#f0abfc", strong: "#a21caf" },
    escape: { light: "#67e8f9", strong: "#0e7490" },
    tap: { light: "#d4d4d8", strong: "#3f3f46" },
    "off-balance": { light: "#bef264", strong: "#4d7c0f" },
    position: { light: "#a5b4fc", strong: "#4338ca" },
    "guard-retention": { light: "#5eead4", strong: "#0f766e" },
    other: { light: "#d6d3d1", strong: "#57534e" },
  };

export function StatsChart({
  category = "submission",
  data = [],
  typeFilter = "all",
  isTap = false,
}: {
  category?: Category;
  data?: AggregateStatsDetail["series"];
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
  const isMobile = useIsMobile();
  const minimumChartWidth = isMobile
    ? Math.max(320, data.length * 28)
    : Math.max(560, data.length * 56);
  const maxBarSize = isMobile ? 24 : 48;

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <ChartContainer
        className="h-80 min-h-80 aspect-auto"
        config={chartConfig}
        style={{ minWidth: minimumChartWidth, width: "100%" }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            angle={-65}
            dataKey="label"
            height={72}
            interval={0}
            textAnchor="end"
            tickLine={false}
            tickMargin={10}
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
              maxBarSize={maxBarSize}
              radius={typeFilter === "all" ? [0, 0, 4, 4] : 4}
              stackId={typeFilter === "all" ? "type" : undefined}
            />
          ) : null}
          {!isTap && typeFilter !== "attempt" ? (
            <Bar
              dataKey="successes"
              fill="var(--color-successes)"
              maxBarSize={maxBarSize}
              radius={4}
              stackId={typeFilter === "all" ? "type" : undefined}
            />
          ) : null}
          {isTap ? (
            <Bar
              dataKey="occurrences"
              fill="var(--color-occurrences)"
              maxBarSize={maxBarSize}
              radius={4}
            />
          ) : null}
          {!isTap ? <ChartLegend content={<ChartLegendContent />} /> : null}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function useIsMobile() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia("(max-width: 639px)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
}
