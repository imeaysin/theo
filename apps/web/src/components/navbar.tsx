import { Link } from "react-router-dom"
import { NavbarAuth } from "@/features/auth/components/navbar-auth"
import { routes } from "@/config/routes"
import { site } from "@/config/site"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          className="font-heading text-sm font-semibold tracking-tight"
          to={routes.home}
        >
          {site.name}
        </Link>
        <NavbarAuth />
      </div>
    </header>
  )
}
