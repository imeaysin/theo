import { Outlet } from "react-router-dom"
import { CreateOrganizationDialog } from "@workspace/ui-shadcn/auth"
import { WorkspaceOnboardingGate } from "@/features/auth/components/workspace-onboarding-gate"
import type { AppOutletContext } from "@/features/auth/app-outlet-context"
import { useCreateOrganizationDialog } from "@/features/auth/hooks/use-create-organization-dialog"
import { useEventStream } from "@/features/notifications/hooks/use-event-stream"
import { AppSidebar } from "@workspace/ui-shadcn/components/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui-shadcn/components/sidebar"
import { Separator } from "@workspace/ui-shadcn/components/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui-shadcn/components/breadcrumb"

export function AppLayout() {
  const createOrganization = useCreateOrganizationDialog()
  useEventStream()
  const outletContext: AppOutletContext = {
    openCreateOrganization: createOrganization.openDialog,
  }

  return (
    <WorkspaceOnboardingGate>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet context={outletContext} />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <CreateOrganizationDialog {...createOrganization.dialogProps} />
    </WorkspaceOnboardingGate>
  )
}
