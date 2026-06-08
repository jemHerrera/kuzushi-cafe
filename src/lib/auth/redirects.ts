export const DEFAULT_AUTHENTICATED_PATH = "/app";
export const SIGN_IN_PATH = "/auth/sign-in";
export const COMPLETE_PROFILE_PATH = "/complete-profile";

export function isSafeRelativePath(
  value: string | null | undefined,
): value is string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    const parsed = new URL(value, "http://localhost");
    return parsed.origin === "http://localhost";
  } catch {
    return false;
  }
}

export function safeRelativePath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTHENTICATED_PATH,
) {
  return isSafeRelativePath(value) ? value : fallback;
}

export function withNext(pathname: string, next: string) {
  const url = new URL(pathname, "http://localhost");
  url.searchParams.set("next", safeRelativePath(next));
  return `${url.pathname}${url.search}`;
}

export function requestPathWithSearch(url: URL) {
  return `${url.pathname}${url.search}`;
}
