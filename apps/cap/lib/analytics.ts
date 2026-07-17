export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cap:analytics", {
        detail: { eventName, properties },
      })
    )
  }
}
