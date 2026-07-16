import { AppSidebar } from "@/components/app-sidebar"
import { useEventStream } from "@/features/notifications/hooks/use-event-stream"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"
import { useEnsureActiveOrganization } from "@/features/shell/use-ensure-active-organization"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui-shadcn/components/breadcrumb"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui-shadcn/components/sidebar"
import { Link, Outlet, useLocation } from "react-router-dom"

export function AppLayout() {
  const { navMain, brandLabel } = useAppShellConfig()
  const { pathname } = useLocation()
  useEnsureActiveOrganization()
  useEventStream()

  const currentNav = navMain.find(
    (n) =>
      pathname === n.url ||
      n.items?.some(
        (sub) => pathname === sub.url || pathname.startsWith(`${sub.url}/`)
      )
  )
  const currentSubNav = currentNav?.items?.find(
    (n) => pathname === n.url || pathname.startsWith(`${n.url}/`)
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              orientation="vertical"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {currentNav?.url ? (
                    <BreadcrumbLink render={<Link to={currentNav.url} />}>
                      {currentNav.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{brandLabel}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {currentSubNav ? (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentSubNav.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : null}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
