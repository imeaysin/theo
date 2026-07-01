"use client"

import {
  useActiveOrganization,
  useAuthUiConfig,
  useListOrganizations,
  useAuthSession,
  useSetActiveOrganization,
} from "@workspace/auth/react"
import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { Check, PlusCircle, Settings } from "lucide-react"
import type { ReactNode } from "react"
import {
  MenuGroup,
  MenuItem,
  MenuSeparator,
} from "@workspace/ui/components/menu"
import { toastManager } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserView } from "../auth-user-view"
import { OrganizationView } from "./organization-view"

export interface OrganizationSwitcherMenuProps {
  hideCreate?: boolean
  hideHeader?: boolean
  hidePersonal?: boolean
  onClose: () => void
  onCreateOrganization?: () => void
}

export function OrganizationSwitcherMenu({
  hideCreate = false,
  hideHeader = false,
  hidePersonal = false,
  onClose,
  onCreateOrganization,
}: OrganizationSwitcherMenuProps) {
  const config = useAuthUiConfig()
  const { data: session } = useAuthSession()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: organizations } = useListOrganizations()
  const { mutate: setActiveOrganization, isPending } =
    useSetActiveOrganization()

  const activeOrganizationId = session?.session.activeOrganizationId ?? null
  const activeOrg = activeOrganization
  const orgList = organizations ?? []

  function handleSetActive(organization: OrganizationSummary | null) {
    const organizationId = organization?.id ?? null

    if (organizationId === activeOrganizationId) {
      onClose()
      return
    }

    onClose()

    setActiveOrganization(
      { organizationId },
      {
        onSuccess: () => {
          if (organization?.name) {
            toastManager.add({
              title: "Workspace switched",
              description: `You're now in ${organization.name}.`,
              type: "success",
            })
          }
        },
        onError: () => {
          toastManager.add({
            title: "Could not switch workspace",
            type: "error",
          })
        },
      }
    )
  }

  let menuHeader: ReactNode = null
  if (!hideHeader) {
    if (activeOrg) {
      menuHeader = (
        <div className="px-2 py-2">
          <OrganizationView organization={activeOrg} />
        </div>
      )
    } else if (session && !hidePersonal) {
      menuHeader = (
        <div className="px-2 py-2">
          <AuthUserView user={session.user} />
        </div>
      )
    }
  }

  const showPersonalSwitcher = Boolean(activeOrg && !hidePersonal)
  const hasSwitcherEntries = showPersonalSwitcher || orgList.length > 0
  const hasWorkspaceActions = Boolean(activeOrg) || !hideCreate

  return (
    <>
      {menuHeader}
      {menuHeader ? <MenuSeparator /> : null}

      {hasSwitcherEntries ? (
        <>
          {showPersonalSwitcher ? (
            <MenuItem
              disabled={isPending}
              onClick={() => handleSetActive(null)}
            >
              <AuthUserView hideSubtitle user={session?.user} />
            </MenuItem>
          ) : null}

          {orgList.map((organization) => {
            const isActive = organization.id === activeOrganizationId

            return (
              <MenuItem
                key={organization.id}
                className={cn(isActive && "bg-accent")}
                disabled={isPending || isActive}
                onClick={() => handleSetActive(organization)}
              >
                <OrganizationView organization={organization} />
                {isActive ? (
                  <Check className="ml-auto size-4 text-muted-foreground" />
                ) : null}
              </MenuItem>
            )
          })}
        </>
      ) : null}

      {hasWorkspaceActions ? (
        <>
          {hasSwitcherEntries ? <MenuSeparator className="my-1.5" /> : null}
          <MenuGroup className="space-y-0.5">
            {activeOrg ? (
              <MenuItem
                disabled={isPending}
                onClick={() => {
                  onClose()
                  config.navigate(config.routes.organizationSettings)
                }}
              >
                <Settings className="text-muted-foreground" />
                Workspace settings
              </MenuItem>
            ) : null}

            {!hideCreate ? (
              <MenuItem
                disabled={isPending}
                onClick={() => {
                  onClose()
                  onCreateOrganization?.()
                }}
              >
                <PlusCircle className="text-muted-foreground" />
                Create workspace
              </MenuItem>
            ) : null}
          </MenuGroup>
        </>
      ) : null}
    </>
  )
}
