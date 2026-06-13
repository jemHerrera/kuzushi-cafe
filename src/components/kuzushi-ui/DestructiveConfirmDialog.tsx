"use client";

import { useState, type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertBanner } from "./AlertBanner";

export function DestructiveConfirmDialog({
  actionLabel,
  children,
  description,
  disabled = false,
  onConfirm,
  onOpenChange,
  onPendingChange,
  open,
  pendingLabel,
  title,
}: {
  actionLabel: string;
  children?: ReactNode;
  description: string;
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
  onOpenChange?: (open: boolean) => void;
  onPendingChange?: (pending: boolean) => void;
  open?: boolean;
  pendingLabel?: string;
  title: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const isControlled = open !== undefined;
  const isOpen = open ?? internalOpen;

  function changeOpen(nextOpen: boolean) {
    if (isPending) return;
    if (nextOpen) setError(undefined);
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  async function confirm() {
    setError(undefined);
    setIsPending(true);
    onPendingChange?.(true);
    try {
      await onConfirm();
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    } catch (confirmError) {
      setError(
        confirmError instanceof Error
          ? confirmError.message
          : "We could not complete this action.",
      );
    } finally {
      setIsPending(false);
      onPendingChange?.(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={changeOpen}>
      {children ? (
        <AlertDialogTrigger asChild disabled={disabled}>
          {children}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <AlertBanner
            className="border-red-200 bg-red-50 text-red-900"
            message={error}
          />
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              void confirm();
            }}
          >
            {isPending ? (pendingLabel ?? `${actionLabel}...`) : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
