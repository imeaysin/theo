import { Link as RouterLink, Outlet, useLocation } from "react-router-dom"
import { AppShell } from "@workspace/ui/components/shell"
import type {
  ShellLinkComponent,
  ShellLinkProps,
} from "@workspace/ui/components/shell"
import { Logo } from "@workspace/ui/components/logo"
import { AppOrganizationSwitcher } from "@/features/auth/components/app-organization-switcher"
import { AppUserButton } from "@/features/auth/components/app-user-button"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"

const ShellLink: ShellLinkComponent = ({
  href,
  children,
  ...props
}: ShellLinkProps) => (
  <RouterLink to={href} {...props}>
    {children}
  </RouterLink>
)

export function AppLayout() {
  const location = useLocation()
  const shell = useAppShellConfig()

  return (
    <AppShell
      brandLabel={shell.brandLabel}
      commandActions={shell.commandActions}
      linkComponent={ShellLink}
      logo={<Logo />}
      navigation={shell.navigation}
      onSignOut={shell.onSignOut}
      pathname={location.pathname}
      sidebarHeader={<AppOrganizationSwitcher />}
      userControl={<AppUserButton />}
      userLoading={shell.userLoading}
      withoutMain
      user={shell.user}
      userMenuItems={shell.userMenuItems}
    >
      <Outlet />
    </AppShell>
  )
}
