import { AppLogo } from "@workspace/ui/components/app-logo"
import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AppLogo />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
