"use client";

import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  ApiErrorDetail,
  NotificationDetail,
  PaginatedResponse,
} from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { JournalEntryPagination } from "./JournalEntryPagination";
import { LoadingState } from "./LoadingState";
import { NotificationItem } from "./NotificationItem";
import { cx } from "./shared";

const PAGE_SIZE = 10;

export function NotificationList({
  className,
  onOpenProfile,
}: {
  className?: string;
  onOpenProfile?: (accountId: string) => void;
}) {
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [mutationId, setMutationId] = useState<string>();
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotifications() {
      await Promise.resolve();
      if (controller.signal.aborted) return;
      setIsLoading(true);
      setError(undefined);
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE + 1),
        offset: String((page - 1) * PAGE_SIZE),
      });
      try {
        const response = await fetch(`/api/notifications?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw await apiError(response);
        const data =
          (await response.json()) as PaginatedResponse<NotificationDetail>;
        setNotifications(data.items);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(messageFor(loadError, "We could not load notifications."));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadNotifications();
    return () => controller.abort();
  }, [page, refreshToken]);

  async function markRead(notification: NotificationDetail) {
    if (notification.isRead) return;
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item,
      ),
    );
    setMutationId(notification.id);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/notifications/${notification.id}/read`,
        { method: "PATCH" },
      );
      if (!response.ok) throw await apiError(response);
    } catch (markError) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: false } : item,
        ),
      );
      setError(messageFor(markError, "We could not mark this as read."));
    } finally {
      setMutationId(undefined);
    }
  }

  async function markAllRead() {
    const previous = notifications;
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
    setMutationId("all");
    setError(undefined);
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      if (!response.ok) throw await apiError(response);
    } catch (markError) {
      setNotifications(previous);
      setError(
        messageFor(markError, "We could not mark all notifications as read."),
      );
    } finally {
      setMutationId(undefined);
    }
  }

  function openNotification(notification: NotificationDetail) {
    if (!notification.sourceAccountId) return;
    if (!notification.isRead) void markRead(notification);
    onOpenProfile?.(notification.sourceAccountId);
  }

  const visibleNotifications = notifications.slice(0, PAGE_SIZE);
  const hasNext = notifications.length > PAGE_SIZE;
  const hasUnread = visibleNotifications.some(
    (notification) => !notification.isRead,
  );

  return (
    <aside
      className={cx(
        "grid max-w-sm content-start gap-3 border-l border-zinc-200 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-zinc-950">Notifications</h3>
        <Button
          className="gap-2 text-zinc-700"
          disabled={!hasUnread || mutationId !== undefined}
          type="button"
          variant="ghost"
          onClick={markAllRead}
        >
          <CheckCheck className="size-4" />
          {mutationId === "all" ? "Marking..." : "Mark all as read"}
        </Button>
      </div>
      {error ? (
        <div className="grid gap-2">
          <AlertBanner
            className="border-red-200 bg-red-50 text-red-900"
            message={error}
          />
          <Button
            className="justify-self-start"
            variant="outline"
            onClick={() => setRefreshToken((token) => token + 1)}
          >
            Retry
          </Button>
        </div>
      ) : null}
      {isLoading ? <LoadingState label="Loading notifications" /> : null}
      {!isLoading && !error && visibleNotifications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center">
          <h4 className="text-sm font-semibold text-zinc-950">
            No notifications
          </h4>
          <p className="mt-1 text-sm text-zinc-500">
            New activity will appear here.
          </p>
        </div>
      ) : null}
      {!isLoading
        ? visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              heading={notification.heading}
              body={notification.text}
              unread={!notification.isRead}
              canOpen={Boolean(notification.sourceAccountId)}
              disabled={mutationId !== undefined}
              onMarkRead={() => markRead(notification)}
              onOpen={() => openNotification(notification)}
            />
          ))
        : null}
      {!isLoading && visibleNotifications.length > 0 ? (
        <JournalEntryPagination
          page={page}
          hasNext={hasNext}
          onPageChange={setPage}
        />
      ) : null}
    </aside>
  );
}

async function apiError(response: Response) {
  const detail = (await response.json()) as ApiErrorDetail;
  return new Error(detail.error.message);
}

function messageFor(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
