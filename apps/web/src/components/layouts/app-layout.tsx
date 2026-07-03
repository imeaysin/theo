import { Link as RouterLink, Outlet, useLocation } from "react-router-dom"
import { CreateOrganizationDialog } from "@workspace/ui/auth"
import { ImpersonationBanner } from "@workspace/ui/auth"
import { Shell } from "@workspace/ui/components/shell"
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
import type { AppOutletContext } from "@/features/auth/app-outlet-context"
import { useCreateOrganizationDialog } from "@/features/auth/hooks/use-create-organization-dialog"
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
  const createOrganization = useCreateOrganizationDialog()
  const outletContext: AppOutletContext = {
    openCreateOrganization: createOrganization.openDialog,
  }

  return (
    <WorkspaceOnboardingGate>
      <div className="flex h-dvh flex-col overflow-hidden">
        <ImpersonationBanner className="shrink-0" />
        <Shell
          brandLabel={shell.brandLabel}
          commandActions={shell.commandActions}
          linkComponent={ShellLink}
          logo={<Logo />}
          navigation={shell.navigation}
          pathname={location.pathname}
          sidebarUserControl={
            <AppSidebarUser
              onCreateOrganization={createOrganization.openDialog}
            />
          }
          userControl={
            <AppUserButton
              onCreateOrganization={createOrganization.openDialog}
            />
          }
        >
          <Outlet context={outletContext} />
        </Shell>
      </div>
      <CreateOrganizationDialog {...createOrganization.dialogProps} />
    </WorkspaceOnboardingGate>
  )
}
