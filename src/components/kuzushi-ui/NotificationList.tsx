"use client";

import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  ApiErrorDetail,
  NotificationDetail,
  PaginatedResponse,
} from "@/lib/managers/types";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { JournalEntryPagination } from "./JournalEntryPagination";
import { LoadingState } from "./LoadingState";
import { NotificationItem } from "./NotificationItem";
import { cx } from "./shared";

const PAGE_SIZE = 10;

export function NotificationList({
  className,
  onIndicatorsChange,
  onOpenLink,
  onOpenProfile,
}: {
  className?: string;
  onIndicatorsChange?: () => void | Promise<void>;
  onOpenLink?: (url: string) => void;
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
      await onIndicatorsChange?.();
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
      await onIndicatorsChange?.();
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
    const { linkUrl, sourceAccountId } = notification;
    if (!sourceAccountId && !linkUrl) return;
    if (!notification.isRead) void markRead(notification);
    if (linkUrl) {
      onOpenLink?.(linkUrl);
      return;
    }
    if (sourceAccountId) onOpenProfile?.(sourceAccountId);
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
        </Button>
      </div>
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => setRefreshToken((token) => token + 1)}
        />
      ) : null}
      {isLoading ? <LoadingState label="Loading notifications" /> : null}
      {!isLoading && !error && visibleNotifications.length === 0 ? (
        <EmptyState
          body="New activity will appear here."
          className="px-4 py-10"
          title="No notifications"
        />
      ) : null}
      {!isLoading && !error
        ? visibleNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              heading={notification.heading}
              body={notification.text}
              unread={!notification.isRead}
              canOpen={Boolean(
                notification.sourceAccountId || notification.linkUrl,
              )}
              disabled={mutationId !== undefined}
              onMarkRead={() => markRead(notification)}
              onOpen={() => openNotification(notification)}
            />
          ))
        : null}
      {!isLoading && !error && visibleNotifications.length > 0 ? (
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
