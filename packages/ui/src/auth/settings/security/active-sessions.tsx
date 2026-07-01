"use client"

import {
  useAuthUiConfig,
  useListSessions,
  useRevokeSession,
  useSession,
} from "@workspace/auth/react"
import { LogOut, Monitor, Smartphone, X } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { parseUserAgent } from "../../utils/parse-user-agent"

export interface ActiveSessionsProps {
  className?: string
}

interface SessionRecord {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt?: Date | string
}

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

function ActiveSessionRow({ activeSession }: { activeSession: SessionRecord }) {
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

function SessionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="size-10 rounded-md" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export function ActiveSessions({ className }: ActiveSessionsProps) {
  const { data: session } = useSession()
  const { data: sessions, isPending } = useListSessions()

  const activeSessions = [
    ...((sessions as SessionRecord[] | undefined) ?? []),
  ].sort((a) => (a.id === session?.session.id ? -1 : 1))

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Active sessions</h2>

      <Card className={cn("p-0", className)}>
        <CardPanel className="p-0">
          {isPending ? (
            <SessionRowSkeleton />
          ) : (
            activeSessions.map((activeSession, index) => (
              <div key={activeSession.id}>
                {index > 0 ? <Separator /> : null}
                <ActiveSessionRow activeSession={activeSession} />
              </div>
            ))
          )}
        </CardPanel>
      </Card>
    </div>
  )
}
