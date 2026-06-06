import { Outlet } from "react-router-dom"
import { Navbar } from "../navbar"
import { appConfig } from "@workspace/config/app"

export function AppLayout() {
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
          <p className="text-accent">{appConfig.name}</p>
        </a>
      </footer>
    </div>
  )
}
