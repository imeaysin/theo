import {
  AuthUserButton,
  type AuthUserButtonMenuItem,
  type AuthUserButtonProps,
} from "@workspace/ui/auth"
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

  return (
    <AuthUserButton
      className={className}
      hideSettings={hideSettings}
      menuItems={menuItems}
      onSignOut={onSignOut}
      showWorkspaceMenu
      size={size}
    />
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
