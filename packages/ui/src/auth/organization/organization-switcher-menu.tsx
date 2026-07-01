"use client"

import {
  useActiveOrganization,
  useAuthUiConfig,
  useListOrganizations,
  useSession,
  useSetActiveOrganization,
} from "@workspace/auth/react"
import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { PlusCircle, Settings } from "lucide-react"
import type { ReactNode } from "react"
import {
  MenuGroup,
  MenuItem,
  MenuSeparator,
} from "@workspace/ui/components/menu"
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
  const { data: session } = useSession()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: organizations } = useListOrganizations()
  const { mutate: setActiveOrganization } = useSetActiveOrganization()

  const activeOrg = activeOrganization
  const orgList = organizations ?? []
  const otherOrganizations = orgList.filter(
    (organization) => organization.id !== activeOrg?.id
  )

  function handleSetActive(organization: OrganizationSummary | null) {
    onClose()
    setActiveOrganization({ organizationId: organization?.id ?? null })
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
  const hasSwitcherEntries =
    showPersonalSwitcher || otherOrganizations.length > 0
  const hasWorkspaceActions = Boolean(activeOrg) || !hideCreate

  return (
    <>
      {menuHeader}
      {menuHeader ? <MenuSeparator /> : null}

      {hasSwitcherEntries ? (
        <>
          {showPersonalSwitcher ? (
            <MenuItem onClick={() => handleSetActive(null)}>
              <AuthUserView hideSubtitle user={session?.user} />
            </MenuItem>
          ) : null}

          {otherOrganizations.map((organization) => (
            <MenuItem
              key={organization.id}
              onClick={() => handleSetActive(organization)}
            >
              <OrganizationView organization={organization} />
            </MenuItem>
          ))}
        </>
      ) : null}

      {hasWorkspaceActions ? (
        <>
          {hasSwitcherEntries ? <MenuSeparator className="my-1.5" /> : null}
          <MenuGroup className="space-y-0.5">
            {activeOrg ? (
              <MenuItem
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
