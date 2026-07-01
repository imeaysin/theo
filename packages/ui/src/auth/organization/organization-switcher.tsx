"use client"

import {
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from "@workspace/auth/react"
import type { OrganizationSummary } from "@workspace/auth/types/organization"
import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@workspace/ui/components/button"
import { Menu, MenuPopup, MenuTrigger } from "@workspace/ui/components/menu"
import { cn } from "@workspace/ui/lib/utils"
import { AuthUserView } from "../auth-user-view"
import { OrganizationLogo } from "./organization-logo"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationSwitcherMenu } from "./organization-switcher-menu"
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
  const { data: session, isPending: sessionPending } = useSession()
  const { data: activeOrganization, isPending: activeOrganizationPending } =
    useActiveOrganization()
  const { isPending: organizationsPending } = useListOrganizations()

  const [menuOpen, setMenuOpen] = useState(false)
  const [createOrganizationOpen, setCreateOrganizationOpen] = useState(false)

  const isPending =
    sessionPending ||
    (!!session && (organizationsPending || activeOrganizationPending))

  const activeOrg = activeOrganization

  if (!session && !sessionPending) return null

  return (
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
        <OrganizationSwitcherMenu
          hideCreate={hideCreate}
          hidePersonal={hidePersonal}
          onClose={() => setMenuOpen(false)}
          onCreateOrganization={() => setCreateOrganizationOpen(true)}
        />
      </MenuPopup>

      <CreateOrganizationDialog
        onOpenChange={setCreateOrganizationOpen}
        open={createOrganizationOpen}
      />
    </Menu>
  )
}
