export function AlertBanner({
  message = "Profile is incomplete. Finish onboarding to unlock sharing.",
}: {
  message?: string;
}) {
  return (
    <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900">
      {message}
    </div>
  );
}
