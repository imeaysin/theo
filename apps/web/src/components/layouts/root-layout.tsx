import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/navbar"
import { PageLoading } from "@workspace/ui/components/page-loading"

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
