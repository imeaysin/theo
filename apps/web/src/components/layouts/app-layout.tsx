import { Link, Outlet, useNavigate } from "react-router-dom"
import { signOut, useSession } from "@/lib/auth"
import { Button, Spinner } from "@workspace/hero-ui"
import { env } from "@/config/env"
import { paths } from "@/config/paths"
import { Navbar } from "../navbar"

export function AppLayout() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()

  async function handleSignOut() {
    await signOut()
    navigate(paths.auth.signIn, { replace: true })
  }

  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl grow px-6 pt-16">
        <Outlet />
      </main>
      <footer className="flex w-full items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current no-underline"
          href="https://heroui.com?utm_source=vite-template"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="text-muted">Powered by</span>
          <p className="text-accent">HeroUI</p>
        </a>
      </footer>
    </div>
  )
}
