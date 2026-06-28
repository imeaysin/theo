import { MobileNavigationMoreItems } from "@workspace/ui/components/shell"
import { dashboardMainNavigation } from "@/features/dashboard/dashboard-navigation"
import { useDashboardBottomNavItems } from "@/features/dashboard/hooks/use-dashboard-bottom-nav-items"

export function MorePage() {
  const bottomNavItems = useDashboardBottomNavItems()

  return (
    <div className="max-w-lg">
      <MobileNavigationMoreItems
        bottomNavItems={bottomNavItems}
        items={dashboardMainNavigation}
      />
      <p className="mt-6 text-xs leading-tight text-muted-foreground md:hidden">
        Additional navigation and account actions.
      </p>
    </div>
  )
}
