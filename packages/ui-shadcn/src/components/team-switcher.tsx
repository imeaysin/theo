"use client"

import * as React from "react"
import { ChevronsUpDownIcon, PlusIcon, PieChartIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui-shadcn/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui-shadcn/components/sidebar"
import {
  useActiveOrganization,
  useListOrganizations,
  useSetActiveOrganization,
} from "@workspace/auth/react"
import { toast } from "@workspace/ui-shadcn/components/sonner"
import { OrganizationLogo } from "@workspace/ui-shadcn/components/auth/organization/organization-logo"

export function TeamSwitcher({
  onCreateOrganization,
}: {
  onCreateOrganization?: () => void
}) {
  const { isMobile } = useSidebar()
  const { data: activeOrganization } = useActiveOrganization()
  const { data: organizations } = useListOrganizations()
  const { mutateAsync: setActiveOrganization, isPending } =
    useSetActiveOrganization()

  const orgList = organizations ?? []

  function handleSetActive(organizationId: string) {
    if (organizationId === activeOrganization?.id) return

    const promise = setActiveOrganization({ organizationId })
    toast.promise(promise, {
      loading: "Switching workspace…",
      success: "Workspace switched",
      error: "Could not switch workspace",
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <>
                {activeOrganization ? (
                  <OrganizationLogo
                    organization={activeOrganization}
                    className="size-8 rounded-lg"
                  />
                ) : (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-background text-foreground">
                    <PieChartIcon className="size-4" />
                  </div>
                )}
              </>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization?.name ?? "Personal Workspace"}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization?.slug ?? "Free"}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {orgList.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSetActive(org.id)}
                className="gap-2 p-2"
                disabled={isPending || org.id === activeOrganization?.id}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <OrganizationLogo organization={org} size="xs" />
                </div>
                {org.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => onCreateOrganization?.()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Create workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
