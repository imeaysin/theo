import { AppLogo } from "@workspace/ui/components/app-logo"
import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col justify-center">
      <header className="flex w-full items-center justify-center">
        <AppLogo />
      </header>
      <main className="flex items-center justify-center px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
