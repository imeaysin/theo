import { productConfig } from "@workspace/config/public"

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(productConfig.analyticsEventName, {
        detail: { eventName, properties },
      })
    )
  }
}
