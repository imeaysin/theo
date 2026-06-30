import { Link, Outlet } from "react-router-dom"
import { AuthShell } from "@workspace/ui/auth"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

export function AuthLayout() {
  return (
    <AuthShell
      homeHref={paths.home}
      privacyHref={site.links.privacy}
      renderHomeLink={({ href, className, children }) => (
        <Link className={className} to={href}>
          {children}
        </Link>
      )}
      renderTermsLink={(href, label) => (
        <a
          className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {label}
        </a>
      )}
      termsHref={site.links.terms}
    >
      <Outlet />
    </AuthShell>
  )
}
