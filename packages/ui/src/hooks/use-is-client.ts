import { useSyncExternalStore } from "react"

function subscribe() {
  return () => undefined
}

export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
