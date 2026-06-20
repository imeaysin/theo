"use client"

import type * as React from "react"
import { Monitor, Smartphone } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

export interface ActiveSession {
  id: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ActiveSessionsListProps {
  sessions: ActiveSession[]
  currentSessionId?: string
  onRevokeSession: (sessionId: string) => Promise<void>
  isRevokingId?: string | null
}

export function ActiveSessionsList({
  sessions,
  currentSessionId,
  onRevokeSession,
  isRevokingId,
}: ActiveSessionsListProps) {
  // Simple parser to guess device type from user agent
  const getDeviceInfo = (userAgent: string | null | undefined) => {
    if (!userAgent) return { type: "Unknown Device", icon: Monitor }
    
    const ua = userAgent.toLowerCase()
    const isMobile = /mobile|android|iphone|ipad/i.test(ua)
    
    let browser = "Unknown Browser"
    if (ua.includes("firefox")) browser = "Firefox"
    else if (ua.includes("chrome") || ua.includes("crios")) browser = "Chrome"
    else if (ua.includes("safari")) browser = "Safari"
    else if (ua.includes("edg")) browser = "Edge"

    let os = "Unknown OS"
    if (ua.includes("win")) os = "Windows"
    else if (ua.includes("mac")) os = "macOS"
    else if (ua.includes("linux")) os = "Linux"
    else if (ua.includes("android")) os = "Android"
    else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS"

    return {
      type: `${browser} on ${os}`,
      icon: isMobile ? Smartphone : Monitor,
    }
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage and revoke your active sessions across devices
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="flex flex-col divide-y">
          {sessions.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No active sessions found.
            </div>
          ) : (
            sessions.map((session) => {
              const deviceInfo = getDeviceInfo(session.userAgent)
              const Icon = deviceInfo.icon
              const isCurrent = session.id === currentSessionId

              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/50 text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {deviceInfo.type}
                        </span>
                        {isCurrent && (
                          <Badge variant="success" className="h-5 px-1.5 text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.ipAddress ? `${session.ipAddress} • ` : ""}
                        Signed in on{" "}
                        {new Date(session.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      loading={isRevokingId === session.id}
                      onClick={() => onRevokeSession(session.id)}
                      className="w-full sm:w-auto"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardPanel>
    </Card>
  )
}
