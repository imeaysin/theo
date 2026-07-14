"use client"

import { User2 } from "lucide-react"
import type { ReactNode } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export type AuthUserAvatarUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  displayUsername?: string | null
}

export type AuthUserAvatarProps = {
  user?: AuthUserAvatarUser | null
  loading?: boolean
  fallback?: ReactNode
  className?: string
}

function getInitials(user?: AuthUserAvatarUser | null) {
  const source = user?.username ?? user?.name ?? user?.email
  return source?.slice(0, 2).toUpperCase()
}

function getAltText(user?: AuthUserAvatarUser | null) {
  return user?.displayUsername ?? user?.name ?? user?.email ?? "User avatar"
}

export function AuthUserAvatar({
  user,
  loading = false,
  fallback,
  className,
}: AuthUserAvatarProps) {
  if (loading && !user) {
    return <Skeleton className={cn("size-8 rounded-full", className)} />
  }

  const initials = getInitials(user)

  return (
    <Avatar
      className={cn(
        "size-8 rounded-full bg-muted text-sm text-foreground",
        className
      )}
    >
      <AvatarImage alt={getAltText(user)} src={user?.image ?? undefined} />
      <AvatarFallback className="text-muted-foreground">
        {fallback ?? initials ?? (
          <User2 aria-hidden="true" className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
