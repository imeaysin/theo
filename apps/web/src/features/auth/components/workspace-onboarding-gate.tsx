"use client"

import { useListOrganizations, useAuthSession } from "@workspace/auth/react"
import { CreateOrganizationDialog } from "@workspace/ui/auth"
import { PageLoading } from "@workspace/ui/components/page-loading"
import type { ReactNode } from "react"
import { useWorkspaceOnboarding } from "@/features/auth/hooks/use-workspace-onboarding"

export function WorkspaceOnboardingGate({ children }: { children: ReactNode }) {
  const { data: session, isPending: sessionPending } = useAuthSession()
  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations()
  const onboarding = useWorkspaceOnboarding()

  if (sessionPending || organizationsPending) {
    return <PageLoading />
  }

  if (session && organizations && organizations.length === 0) {
    return <CreateOrganizationDialog {...onboarding.dialogProps} />
  }

  return children
}
