export function getAuthErrorMessage(
  error: { message?: string; status?: number } | null | undefined,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error?.message) return fallback
  return error.message
}
