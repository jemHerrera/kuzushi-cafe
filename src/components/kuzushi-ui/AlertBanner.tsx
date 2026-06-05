import { cx } from "./shared";

export function AlertBanner({
  className,
  message = "Profile is incomplete. Finish onboarding to unlock sharing.",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900",
        className,
      )}
    >
      {message}
    </div>
  );
}
