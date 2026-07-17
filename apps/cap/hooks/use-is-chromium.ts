import { useSyncExternalStore } from "react"

interface NavigatorUAData {
  brands?: { brand: string }[]
}

type NavigatorWithUAData = Navigator & {
  userAgentData?: NavigatorUAData
}

const subscribeToUserAgent = () => () => undefined

function detectChromium() {
  const navigatorWithUAData = navigator as NavigatorWithUAData
  if (Array.isArray(navigatorWithUAData.userAgentData?.brands)) {
    return navigatorWithUAData.userAgentData.brands.some(({ brand }) =>
      /chromium/i.test(brand)
    )
  }

  return (
    /chrome|chromium/i.test(navigator.userAgent) &&
    !/crios/i.test(navigator.userAgent)
  )
}

/**
 * Detects whether the current browser is Chromium-based (Chrome, Edge, Brave,
 * Arc, Opera, Vivaldi, …), i.e. one that can install the Cap Chrome extension.
 *
 * Defaults to `true` during SSR and on the first client render — Chromium is
 * the overwhelming majority, so this avoids a layout flash for most visitors
 * while still resolving the real value after mount (non-Chromium browsers see a
 * single reflow). Detection runs in an effect, so there's no hydration mismatch.
 */
export const useIsChromium = (): boolean => {
  return useSyncExternalStore(subscribeToUserAgent, detectChromium, () => true)
}
