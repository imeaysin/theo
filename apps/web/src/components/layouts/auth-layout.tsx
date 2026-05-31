import { Link, Outlet } from "react-router-dom"
import { env } from "@/config/env"
import { paths } from "@/config/paths"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          to={paths.home}
          className="text-sm font-medium text-foreground hover:underline"
        >
          {env.appName}
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
