import { AppSidebar } from "@/components/app-sidebar"
import { AppOutletContext } from "@/features/auth/app-outlet-context"
import { WorkspaceOnboardingGate } from "@/features/auth/components/workspace-onboarding-gate"
import { useCreateOrganizationDialog } from "@/features/auth/hooks/use-create-organization-dialog"
import { useEventStream } from "@/features/notifications/hooks/use-event-stream"
import { useAppShellConfig } from "@/features/shell/use-app-shell-config"
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
import { Outlet, useLocation } from "react-router-dom"

export const AppLayout = () => {
  const createOrganization = useCreateOrganizationDialog()

  const { navMain, brandLabel } = useAppShellConfig()
  const { pathname } = useLocation()
  useEventStream()
  const outletContext: AppOutletContext = {
    openCreateOrganization: createOrganization.openDialog,
  }

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
    <WorkspaceOnboardingGate>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      {currentNav?.title ?? brandLabel}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentSubNav && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentSubNav.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet context={outletContext} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </WorkspaceOnboardingGate>
  )
}
