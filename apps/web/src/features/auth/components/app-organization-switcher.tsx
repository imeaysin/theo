"use client"

import { OrganizationSwitcher } from "@workspace/ui/auth"
import { useSidebarState } from "@workspace/ui/components/shell/sidebar-state"

export function AppOrganizationSwitcher() {
  const { isIconSidebar } = useSidebarState()

  return <OrganizationSwitcher collapsed={isIconSidebar} />
}
