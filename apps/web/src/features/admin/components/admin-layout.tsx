import { Outlet } from "react-router-dom"
import { paths } from "@/config/paths"
import { useAuthSession } from "@/features/auth/hooks"
import { useCan } from "@repo/permission-manager/react"

export function AdminLayout() {
  const { session } = useAuthSession()
  const canAccess = useCan({ user: ["list"] }, session?.user?.role)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">
            {canAccess ? "Manage your application" : "Restricted area"}
          </p>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href={paths.admin.dashboard}>Dashboard</a>
          <a href={paths.admin.users}>Users</a>
          <a href={paths.admin.settings}>Settings</a>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
