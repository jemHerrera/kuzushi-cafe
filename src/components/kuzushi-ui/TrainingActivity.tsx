"use client";

import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

import { Skeleton } from "@/components/ui/skeleton";
import type {
  ApiErrorDetail,
  TrainingActivityDetail,
} from "@/lib/managers/types";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export const sampleTrainingActivity: TrainingActivityDetail = {
  object: "training_activity",
  accountId: "component-library-account",
  startDate: "2025-06-14",
  endDate: "2026-06-14",
  totalEntries: 14,
  activeDays: 7,
  days: [
    { date: "2025-06-14", count: 0 },
    { date: "2025-08-06", count: 1 },
    { date: "2025-10-20", count: 3 },
    { date: "2026-01-12", count: 2 },
    { date: "2026-03-18", count: 1 },
    { date: "2026-04-27", count: 4 },
    { date: "2026-05-19", count: 2 },
    { date: "2026-06-10", count: 1 },
    { date: "2026-06-14", count: 0 },
  ],
};

export function TrainingActivity({
  accountId,
  data,
  onAddEntry,
  refreshToken = 0,
  showHeading = true,
}: {
  accountId?: string;
  data?: TrainingActivityDetail;
  onAddEntry?: () => void;
  refreshToken?: number;
  showHeading?: boolean;
}) {
  const [activity, setActivity] = useState<TrainingActivityDetail | undefined>(
    data,
  );
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(data === undefined);
  const [retryToken, setRetryToken] = useState(0);
  const isStatic = data !== undefined;
  const displayedActivity = isStatic ? data : activity;

  useEffect(() => {
    if (isStatic) return;

    const controller = new AbortController();
    const endpoint = accountId
      ? `/api/accounts/${accountId}/training-activity`
      : "/api/training-activity";

    async function loadActivity() {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        setActivity((await response.json()) as TrainingActivityDetail);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setActivity(undefined);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load training activity.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadActivity();
    return () => controller.abort();
  }, [accountId, isStatic, refreshToken, retryToken]);

  return (
    <section
      className="grid w-full min-w-0 max-w-full gap-3"
      aria-label="Training activity"
    >
      {showHeading ? (
        <h2 className="mt-1 mb-2 text-md font-black tracking-tight">
          Activity
        </h2>
      ) : null}
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => setRetryToken((token) => token + 1)}
        />
      ) : null}
      {isLoading ? (
        <TrainingActivityLoadingState />
      ) : displayedActivity ? (
        <TrainingActivityCalendar
          data={displayedActivity}
          isPublic={accountId !== undefined}
          onAddEntry={onAddEntry}
        />
      ) : null}
    </section>
  );
}

function TrainingActivityCalendar({
  data,
  isPublic,
  onAddEntry,
}: {
  data: TrainingActivityDetail;
  isPublic: boolean;
  onAddEntry?: () => void;
}) {
  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const calendarWrapper = calendarWrapperRef.current;
    if (!calendarWrapper) return;

    const scrollToEnd = () => {
      const scrollContainer =
        calendarWrapper.querySelector<HTMLElement>(
          ".react-activity-calendar__scroll-container",
        ) ?? calendarWrapper;

      scrollContainer.scrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
    };

    let nestedFrame = 0;
    const firstFrame = requestAnimationFrame(scrollToEnd);
    const secondFrame = requestAnimationFrame(() => {
      nestedFrame = requestAnimationFrame(scrollToEnd);
    });

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(calendarWrapper);

    const mutationObserver = new MutationObserver(scrollToEnd);
    mutationObserver.observe(calendarWrapper, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      if (nestedFrame) cancelAnimationFrame(nestedFrame);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [data.days.length]);

  if (data.totalEntries === 0) {
    return (
      <EmptyState
        className="border border-zinc-200"
        body={
          isPublic
            ? "No journal activity is visible for the last 12 months."
            : "Your contribution calendar will fill in as entries are created."
        }
        onAction={onAddEntry}
        title="No training activity yet"
      />
    );
  }

  const calendarData: Activity[] = data.days.map((day) => ({
    ...day,
    level: activityLevel(day.count),
  }));

  return (
    <div className="grid gap-4">
      <div ref={calendarWrapperRef} className="overflow-x-auto pb-1">
        <ActivityCalendar
          blockMargin={4}
          blockRadius={2}
          blockSize={12}
          colorScheme="light"
          data={calendarData}
          fontSize={12}
          labels={{
            totalCount: "{{count}} entries in the last year",
            legend: { less: "Less", more: "More" },
          }}
          showWeekdayLabels={["mon", "wed", "fri"]}
          theme={{
            light: ["#ffffff", "#d4d4d8", "#71717a", "#3f3f46", "#000000"],
          }}
          renderBlock={(block) =>
            cloneElement(block, {
              style: {
                ...block.props.style,
                stroke: "#d4d4d8",
                strokeWidth: 1,
              },
            })
          }
          renderColorLegend={(block) =>
            cloneElement(block, {
              style: {
                ...block.props.style,
                stroke: "#d4d4d8",
                strokeWidth: 1,
              },
            })
          }
          tooltips={{
            activity: {
              text: (day) =>
                `${day.count} ${day.count === 1 ? "entry" : "entries"} on ${formatDate(day.date)}`,
            },
          }}
          weekStart={1}
        />
      </div>
    </div>
  );
}

function activityLevel(count: number) {
  if (count === 0) return 0;
  return Math.min(count, 4);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function TrainingActivityLoadingState() {
  return (
    <div
      aria-label="Loading training activity"
      className="grid w-full min-w-0 max-w-full gap-4 overflow-hidden"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Skeleton className="h-5 w-full max-w-60" />
        <Skeleton className="h-4 w-20 sm:w-24" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}
