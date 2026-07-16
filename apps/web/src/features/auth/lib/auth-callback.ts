export function buildAuthCallback(path: string): string {
  return new URL(path, window.location.origin).href
}
