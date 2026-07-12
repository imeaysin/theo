import { Link, Outlet } from "react-router-dom"
import { AuthShell } from "@workspace/ui-shadcn/auth"
import { routes } from "@/config/routes"
import { site } from "@/config/site"

export function AuthLayout() {
  return (
    <AuthShell
      homeHref={routes.home}
      linkComponent={({ href, className, children }) => (
        <Link className={className} to={href}>
          {children}
        </Link>
      )}
      privacyHref={site.links.privacy}
      termsHref={site.links.terms}
    >
      <Outlet />
    </AuthShell>
  )
}
