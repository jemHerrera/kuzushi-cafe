export class ManagerError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "ManagerError";
  }
}

export function assertManagerResult<T>(
  data: T | null,
  error: { message: string; code?: string } | null,
  code: string,
  message: string,
): T {
  if (error || data === null) {
    throw new ManagerError(code, error?.message || message, 500);
  }

  return data;
}
