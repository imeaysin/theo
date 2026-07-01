"use client"

import {
  useAuthUiConfig,
  useRevokeSession,
  useSession,
} from "@workspace/auth/react"
import { LogOut, Monitor, Smartphone, X } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { toastManager } from "@workspace/ui/components/toast"
import { parseUserAgent } from "../../utils/parse-user-agent"

function parseCreatedAt(value?: Date | string): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  return new Date(value)
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ]

  for (const [unit, threshold] of units) {
    if (seconds >= threshold) {
      return rtf.format(-Math.floor(seconds / threshold), unit)
    }
  }

  return rtf.format(0, "second")
}

export interface ActiveSessionProps {
  activeSession: {
    id: string
    token: string
    userAgent?: string | null
    createdAt?: Date | string
  }
}

export function ActiveSession({ activeSession }: ActiveSessionProps) {
  const config = useAuthUiConfig()
  const { data: session } = useSession()
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession()

  const isCurrentSession = activeSession.token === session?.session.token
  const ua = parseUserAgent(activeSession.userAgent)
  const createdAt = parseCreatedAt(activeSession.createdAt)

  let sessionMeta: ReactNode = null
  if (isCurrentSession) {
    sessionMeta = <Badge variant="secondary">Current session</Badge>
  } else if (createdAt) {
    sessionMeta = (
      <span className="text-xs text-muted-foreground capitalize">
        {timeAgo(createdAt)}
      </span>
    )
  }

  const actionLabel = isCurrentSession ? "Sign out" : "Revoke"

  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        {ua.isMobile ? (
          <Smartphone className="size-4.5" />
        ) : (
          <Monitor className="size-4.5" />
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">
          {ua.browserName}
          {ua.osName ? `, ${ua.osName}` : ""}
        </span>

        {sessionMeta}
      </div>

      <Button
        aria-label={isCurrentSession ? "Sign out" : "Revoke session"}
        className="ml-auto shrink-0"
        loading={isRevoking}
        onClick={() =>
          isCurrentSession
            ? config.navigate(config.routes.signOut)
            : revokeSession(
                { token: activeSession.token },
                {
                  onSuccess: () => {
                    toastManager.add({
                      title: "Session revoked",
                      type: "success",
                    })
                  },
                }
              )
        }
        size="sm"
        variant="outline"
      >
        {isCurrentSession ? <LogOut /> : <X />}
        {actionLabel}
      </Button>
    </div>
  )
}
