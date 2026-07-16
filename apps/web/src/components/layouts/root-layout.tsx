import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/navbar"
import { PageLoading } from "@/components/page-loading"

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <Suspense fallback={<PageLoading className="flex-1" />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
