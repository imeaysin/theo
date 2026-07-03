import { usePlatformRoleOptions } from "@workspace/auth/react"
import { Admin, BanUserDialog } from "@workspace/ui/auth"
import { ShellMain } from "@workspace/ui/components/shell"
import { useCreateUserDialog } from "@/features/admin/hooks/use-create-user-dialog"
import { useBanUserDialog } from "@/features/admin/hooks/use-ban-user-dialog"

export function AdminUsersPage() {
  const { roles, formatPlatformRoleLabel } = usePlatformRoleOptions()
  const createUser = useCreateUserDialog()
  const banUser = useBanUserDialog()

  return (
    <ShellMain
      header={{
        heading: "Admin",
        subtitle: "Manage platform users, roles, and access.",
      }}
    >
      <Admin
        users={{
          roles,
          formatRoleLabel: formatPlatformRoleLabel,
          createDialog: createUser.dialogProps,
          onCreateClick: createUser.openDialog,
          onBanClick: banUser.openForUser,
        }}
      />
      <BanUserDialog {...banUser.dialogProps} />
    </ShellMain>
  )
}
