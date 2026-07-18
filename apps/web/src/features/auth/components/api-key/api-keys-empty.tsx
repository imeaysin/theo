"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { Key } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui-shadcn/components/empty"
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin"

/**
 * Empty state for the API keys list. Create actions belong on the section header.
 */
export function ApiKeysEmpty() {
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Key />
        </EmptyMedia>
        <EmptyTitle>{apiKeyLocalization.noApiKeys}</EmptyTitle>
        <EmptyDescription>
          {apiKeyLocalization.apiKeysDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
