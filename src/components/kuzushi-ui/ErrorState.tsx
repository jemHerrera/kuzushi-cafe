import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertBanner } from "./AlertBanner";
import { cx } from "./shared";

export function ErrorState({
  className,
  message,
  onRetry,
  retryLabel = "Retry",
}: {
  className?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className={cx("grid gap-2", className)} role="alert">
      <AlertBanner
        className="border-red-200 bg-red-50 text-red-900"
        message={message}
      />
      {onRetry ? (
        <Button
          className="w-fit"
          onClick={onRetry}
          type="button"
          variant="outline"
        >
          <RotateCcw className="size-4" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
