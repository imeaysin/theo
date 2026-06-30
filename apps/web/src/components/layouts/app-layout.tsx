import { Link as RouterLink, Outlet, useLocation } from "react-router-dom"
import { AppShell } from "@workspace/ui/components/shell"
import type {
  ShellLinkComponent,
  ShellLinkProps,
} from "@workspace/ui/components/shell"
import { Logo } from "@workspace/ui/components/logo"
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

/** Post-login shell. Routes live in features; nav lives in `config/app-navigation.ts`. */
export function AppLayout() {
  const location = useLocation()
  const shell = useAppShellConfig()

  return (
    <AppShell
      bottomNavItems={shell.bottomNavItems}
      brandLabel={shell.brandLabel}
      commandActions={shell.commandActions}
      linkComponent={ShellLink}
      logo={<Logo />}
      navigation={shell.navigation}
      onSignOut={shell.onSignOut}
      pathname={location.pathname}
      userLoading={shell.userLoading}
      withoutMain
      user={shell.user}
      userMenuItems={shell.userMenuItems}
    >
      <Outlet />
    </AppShell>
  )
}
