"use client";

import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { useMemo, useState } from "react";
import { AggregateView } from "./AggregateView";
import {
  AggregateViewFilters,
  type AggregateTimeline,
  type AggregateTypeFilter,
} from "./AggregateViewFilters";
import { sampleEntries, type Category, type JournalEntry } from "./shared";

export type TechniqueAggregate = {
  technique: string;
  attempts: number;
  successes: number;
  occurrences: number;
};

export function AggregateOverview({
  entries = sampleEntries,
}: {
  entries?: JournalEntry[];
}) {
  const [category, setCategory] = useState<Category>("submission");
  const [timeline, setTimeline] = useState<AggregateTimeline>("month");
  const [typeFilter, setTypeFilter] = useState<AggregateTypeFilter>("all");
  const effectiveTypeFilter = category === "tap" ? "all" : typeFilter;
  const aggregates = useMemo(
    () => aggregateEntries(entries, category, timeline, effectiveTypeFilter),
    [entries, category, timeline, effectiveTypeFilter],
  );

  function changeCategory(nextCategory: Category) {
    setCategory(nextCategory);
    if (nextCategory === "tap") setTypeFilter("all");
  }

  return (
    <section className="grid gap-3">
      <AggregateViewFilters
        category={category}
        timeline={timeline}
        typeFilter={effectiveTypeFilter}
        onCategoryChange={changeCategory}
        onTimelineChange={setTimeline}
        onTypeFilterChange={setTypeFilter}
      />
      <AggregateView
        category={category}
        data={aggregates}
        typeFilter={effectiveTypeFilter}
      />
    </section>
  );
}

function aggregateEntries(
  entries: JournalEntry[],
  category: Category,
  timeline: AggregateTimeline,
  typeFilter: AggregateTypeFilter,
) {
  const now = new Date();
  const interval = getTimelineInterval(timeline, now);
  const aggregates = new Map<string, TechniqueAggregate>();

  entries
    .filter((entry) => entry.category === category)
    .filter((entry) => {
      if (!interval) return true;
      return isWithinInterval(parseISO(entry.trainedDate), interval);
    })
    .filter((entry) => {
      if (category === "tap" || typeFilter === "all") return true;
      return entry.journalType === typeFilter;
    })
    .forEach((entry) => {
      const current = aggregates.get(entry.technique) ?? {
        technique: entry.technique,
        attempts: 0,
        successes: 0,
        occurrences: 0,
      };

      current.occurrences += 1;
      if (entry.journalType === "attempt") current.attempts += 1;
      if (entry.journalType === "success") current.successes += 1;
      aggregates.set(entry.technique, current);
    });

  return [...aggregates.values()].sort(
    (left, right) =>
      right.occurrences - left.occurrences ||
      left.technique.localeCompare(right.technique),
  );
}

function getTimelineInterval(timeline: AggregateTimeline, now: Date) {
  if (timeline === "all") return null;
  if (timeline === "week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }
  if (timeline === "year") {
    return { start: startOfYear(now), end: endOfYear(now) };
  }

  return { start: startOfMonth(now), end: endOfMonth(now) };
}
