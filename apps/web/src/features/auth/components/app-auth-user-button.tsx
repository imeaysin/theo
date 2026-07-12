import {
  AuthUserButton,
  type AuthUserButtonMenuItem,
  type AuthUserButtonProps,
} from "@workspace/ui-shadcn/auth"
import { useSidebar } from "@workspace/ui-shadcn/components/sidebar"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"

type AppAuthUserButtonProps = Pick<
  AuthUserButtonProps,
  | "className"
  | "hideSettings"
  | "onCreateOrganization"
  | "sidebarCollapsed"
  | "size"
> & {
  menuItems?: AuthUserButtonMenuItem[]
}

function AppAuthUserButton({
  className,
  hideSettings,
  menuItems,
  onCreateOrganization,
  sidebarCollapsed,
  size,
}: AppAuthUserButtonProps) {
  const { onSignOut } = useAppShellConfig()

  return (
    <AuthUserButton
      className={className}
      hideSettings={hideSettings}
      menuItems={menuItems}
      onCreateOrganization={onCreateOrganization}
      onSignOut={onSignOut}
      showWorkspaceMenu
      sidebarCollapsed={sidebarCollapsed}
      size={size}
    />
  )
}

export function AppUserButton({
  onCreateOrganization,
}: {
  onCreateOrganization: () => void
}) {
  return (
    <AppAuthUserButton
      className="max-w-xs"
      onCreateOrganization={onCreateOrganization}
      size="compact"
    />
  )
}

export function AppSidebarUser({
  onCreateOrganization,
}: {
  onCreateOrganization: () => void
}) {
  const { userMenuItems } = useAppShellConfig()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <AppAuthUserButton
      hideSettings
      menuItems={userMenuItems}
      onCreateOrganization={onCreateOrganization}
      sidebarCollapsed={isCollapsed}
      size="sidebar"
    />
  )
}
