import {
  AuthUserButton,
  CreateOrganizationDialog,
  type AuthUserButtonMenuItem,
  type AuthUserButtonProps,
} from "@workspace/ui/auth"
import { useCreateOrganizationDialog } from "@/features/auth/hooks/use-create-organization-dialog"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"

type AppAuthUserButtonProps = Pick<
  AuthUserButtonProps,
  "className" | "hideSettings" | "size"
> & {
  menuItems?: AuthUserButtonMenuItem[]
}

function AppAuthUserButton({
  className,
  hideSettings,
  menuItems,
  size,
}: AppAuthUserButtonProps) {
  const { onSignOut } = useAppShellConfig()
  const createOrganization = useCreateOrganizationDialog()

  return (
    <>
      <AuthUserButton
        className={className}
        hideSettings={hideSettings}
        menuItems={menuItems}
        onCreateOrganization={createOrganization.openDialog}
        onSignOut={onSignOut}
        showWorkspaceMenu
        size={size}
      />
      <CreateOrganizationDialog {...createOrganization.dialogProps} />
    </>
  )
}

export function AppUserButton() {
  return <AppAuthUserButton className="max-w-[45vw]" size="compact" />
}

export function AppSidebarUser() {
  const { userMenuItems } = useAppShellConfig()

  return (
    <AppAuthUserButton
      hideSettings
      menuItems={userMenuItems.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        onClick: item.onClick,
        variant: item.variant,
      }))}
      size="sidebar"
    />
  )
}
