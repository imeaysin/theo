"use client"

import {
  useActiveOrganization,
  useAuthUiConfig,
  useListOrganizations,
  useSession,
  useSetActiveOrganization,
} from "@workspace/auth/react"
import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { ChevronsUpDown, PlusCircle, Settings } from "lucide-react"
import { useState, type ReactNode } from "react"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@workspace/ui/components/menu"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserView } from "../auth-user-view"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationLogo } from "./organization-logo"
import { OrganizationView } from "./organization-view"

export interface OrganizationSwitcherProps {
  className?: string
  collapsed?: boolean
  hideCreate?: boolean
  hidePersonal?: boolean
}

function SwitcherTriggerContent({
  collapsed,
  isPending,
  activeOrg,
  session,
  hidePersonal,
}: {
  collapsed: boolean
  isPending: boolean
  activeOrg?: OrganizationSummary | null
  session: ReturnType<typeof useSession>["data"]
  hidePersonal: boolean
}) {
  if (collapsed) {
    return (
      <OrganizationLogo
        loading={isPending}
        organization={
          activeOrg ??
          (session ? { name: session.user.name ?? "Personal" } : undefined)
        }
        size="sm"
      />
    )
  }

  if (isPending) {
    return <OrganizationView className="min-w-0 flex-1" loading />
  }

  if (activeOrg) {
    return (
      <OrganizationView className="min-w-0 flex-1" organization={activeOrg} />
    )
  }

  if (session && !hidePersonal) {
    return (
      <AuthUserView
        className="min-w-0 flex-1"
        hideSubtitle
        user={session.user}
      />
    )
  }

  return (
    <OrganizationView
      className="min-w-0 flex-1"
      organization={{ name: "Select workspace" }}
    />
  )
}

export function OrganizationSwitcher({
  className,
  collapsed = false,
  hideCreate = false,
  hidePersonal = false,
}: OrganizationSwitcherProps) {
  const config = useAuthUiConfig()
  const { data: session, isPending: sessionPending } = useSession()
  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useActiveOrganization()
  const { data: organizations, isPending: organizationsPending } =
    useListOrganizations()
  const { mutate: setActiveOrganization } = useSetActiveOrganization()

  const [menuOpen, setMenuOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const isPending =
    sessionPending ||
    (!!session && (organizationsPending || activeOrganizationPending))

  const activeOrg = activeOrganization
  const orgList = organizations ?? []
  const otherOrganizations = orgList.filter(
    (organization) => organization.id !== activeOrg?.id
  )

  if (!session && !sessionPending) return null

  function handleSetActive(organization: OrganizationSummary | null) {
    setMenuOpen(false)
    setActiveOrganization({ organizationId: organization?.id ?? null })
  }

  let menuHeader: ReactNode = null
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

  const showCreateSeparator =
    !hideCreate &&
    (otherOrganizations.length > 0 || (!!activeOrg && !hidePersonal))

  return (
    <>
      <Menu onOpenChange={setMenuOpen} open={menuOpen}>
        <MenuTrigger
          aria-label="Switch workspace"
          className={cn(
            collapsed
              ? cn(
                  "flex size-8 items-center justify-center rounded-lg text-sidebar-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              : cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-auto w-full max-w-full justify-start px-2 py-2 font-normal"
                ),
            className
          )}
          disabled={!session || isPending}
          render={<button type="button" />}
        >
          <span
            className={cn(
              "flex min-w-0 items-center",
              collapsed ? "justify-center" : "w-full gap-2"
            )}
          >
            <SwitcherTriggerContent
              activeOrg={activeOrg}
              collapsed={collapsed}
              hidePersonal={hidePersonal}
              isPending={isPending}
              session={session}
            />
            {!collapsed ? (
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            ) : null}
          </span>
        </MenuTrigger>

        <MenuPopup align="start" className="min-w-64">
          {menuHeader}
          {menuHeader ? <MenuSeparator /> : null}

          {activeOrg && !hidePersonal ? (
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

          {activeOrg ? (
            <>
              <MenuSeparator />
              <MenuItem
                onClick={() => {
                  setMenuOpen(false)
                  config.navigate(config.routes.organizationSettings)
                }}
              >
                <Settings className="text-muted-foreground" />
                Workspace settings
              </MenuItem>
            </>
          ) : null}

          {!hideCreate ? (
            <>
              {showCreateSeparator ? <MenuSeparator /> : null}
              <MenuItem
                onClick={() => {
                  setMenuOpen(false)
                  setCreateOpen(true)
                }}
              >
                <PlusCircle className="text-muted-foreground" />
                Create workspace
              </MenuItem>
            </>
          ) : null}
        </MenuPopup>
      </Menu>

      <CreateOrganizationDialog
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </>
  )
}
