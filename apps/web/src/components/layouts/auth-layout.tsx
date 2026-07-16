import { Link, Outlet } from "react-router-dom"
import { routes } from "@/config/routes"
import { site } from "@/config/site"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <Link
        className="mb-8 font-heading text-lg font-semibold tracking-tight"
        to={routes.home}
      >
        {site.name}
      </Link>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
