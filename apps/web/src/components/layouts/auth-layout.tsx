import { Link, Outlet } from "react-router-dom"
import { AuthShell } from "@workspace/ui/auth"
import { paths } from "@/config/paths"

const marketingUrl =
  import.meta.env.VITE_MARKETING_URL ?? "http://localhost:3000"

export function AuthLayout() {
  return (
    <AuthShell
      homeHref={paths.home}
      privacyHref={`${marketingUrl}/policy`}
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
      termsHref={`${marketingUrl}/terms`}
    >
      <Outlet />
    </AuthShell>
  )
}
