import { Link as RouterLink, Outlet, useLocation } from "react-router-dom"
import { AppShell } from "@workspace/ui/components/shell"
import type {
  ShellLinkComponent,
  ShellLinkProps,
} from "@workspace/ui/components/shell"
import { Logo } from "@workspace/ui/components/logo"
import {
  AppSidebarUser,
  AppUserButton,
} from "@/features/auth/components/app-auth-user-button"
import { WorkspaceOnboardingGate } from "@/features/auth/components/workspace-onboarding-gate"
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
    <WorkspaceOnboardingGate>
      <AppShell
        brandLabel={shell.brandLabel}
        commandActions={shell.commandActions}
        linkComponent={ShellLink}
        logo={<Logo />}
        navigation={shell.navigation}
        pathname={location.pathname}
        sidebarUserControl={<AppSidebarUser />}
        userControl={<AppUserButton />}
        withoutMain
      >
        <Outlet />
      </AppShell>
    </WorkspaceOnboardingGate>
  )
}
