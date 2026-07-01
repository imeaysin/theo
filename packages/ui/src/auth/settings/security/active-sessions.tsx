"use client"

import { useListSessions, useSession } from "@workspace/auth/react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { ActiveSession } from "./active-session"

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
                <ActiveSession activeSession={activeSession} />
              </div>
            ))
          )}
        </CardPanel>
      </Card>
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
