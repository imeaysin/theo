import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "@workspace/auth/client"
import { env } from "@/config/env"
import { apiRoutes } from "@/config/api-routes"
import { notificationsQueryKey, unreadCountQueryKey } from "./use-notifications"

type SSEEvent = {
  readonly type: string
}

function isSSEEvent(value: unknown): value is SSEEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string"
  )
}

function parseSSELines(chunk: string): SSEEvent[] {
  const events: SSEEvent[] = []
  const blocks = chunk.split("\n\n")

  for (const block of blocks) {
    const lines = block.split("\n")
    let data = ""

    for (const line of lines) {
      if (line.startsWith("data:")) {
        data += line.slice(5).trim()
      }
    }

    if (!data) continue

    try {
      const parsed: unknown = JSON.parse(data)
      if (isSSEEvent(parsed)) {
        events.push(parsed)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        continue
      }
      throw error
    }
  }

  return events
}

const RECONNECT_DELAY_MS = 3_000
const NOTIFICATION_EVENT_TYPES = new Set([
  "notification.created",
  "notification.read",
  "notification.deleted",
  "notification.all-read",
])

export function useEventStream() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const activeRef = useRef(true)

  useEffect(() => {
    activeRef.current = true
    let abortController: AbortController | undefined
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    async function connect() {
      if (!activeRef.current || !session) return

      abortController = new AbortController()

      try {
        const response = await fetch(`${env.apiUrl}${apiRoutes.eventsStream}`, {
          credentials: "include",
          signal: abortController.signal,
        })

        if (!response.ok || !response.body) return

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (activeRef.current) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lastDoubleNewline = buffer.lastIndexOf("\n\n")
          if (lastDoubleNewline === -1) continue

          const complete = buffer.slice(0, lastDoubleNewline + 2)
          buffer = buffer.slice(lastDoubleNewline + 2)

          const events = parseSSELines(complete)
          for (const event of events) {
            if (NOTIFICATION_EVENT_TYPES.has(event.type)) {
              void queryClient.invalidateQueries({
                queryKey: notificationsQueryKey,
              })
              void queryClient.invalidateQueries({
                queryKey: unreadCountQueryKey,
              })
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        if (err instanceof SyntaxError) return
      }

      if (activeRef.current) {
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    void connect()

    return () => {
      activeRef.current = false
      abortController?.abort()
      if (reconnectTimer !== undefined) clearTimeout(reconnectTimer)
    }
  }, [queryClient, session])
}
