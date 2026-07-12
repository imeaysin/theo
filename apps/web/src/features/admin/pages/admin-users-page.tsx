import { usePlatformRoleOptions } from "@workspace/auth/react"
import { Admin, BanUserDialog } from "@workspace/ui-shadcn/auth"
import { useCreateUserDialog } from "@/features/admin/hooks/use-create-user-dialog"
import { useBanUserDialog } from "@/features/admin/hooks/use-ban-user-dialog"

export function AdminUsersPage() {
  const { roles, formatPlatformRoleLabel } = usePlatformRoleOptions()
  const createUser = useCreateUserDialog()
  const banUser = useBanUserDialog()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          Manage platform users and permissions.
        </p>
      </div>
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
    </div>
  )
}
