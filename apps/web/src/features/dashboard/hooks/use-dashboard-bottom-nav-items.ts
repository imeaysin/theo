import { useMemo } from "react"
import {
  CopyIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from "lucide-react"
import type { NavigationItemType } from "@workspace/ui/components/shell"
import { toastManager } from "@workspace/ui/components/toast"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { paths } from "@/config/paths"

export function useDashboardBottomNavItems(): NavigationItemType[] {
  const { data: session } = useAuthSession()
  const user = session?.user

  const publicPageUrl = useMemo(() => {
    const slug =
      user?.name?.trim().toLowerCase().replace(/\s+/g, "-") || "user"
    if (typeof window === "undefined") return `/${slug}`
    return `${window.location.origin}/${slug}`
  }, [user?.name])

  return useMemo<NavigationItemType[]>(
    () => [
      {
        name: "View public page",
        href: publicPageUrl,
        icon: ExternalLinkIcon,
        target: "_blank",
      },
      {
        name: "Copy public page link",
        href: "",
        icon: CopyIcon,
        onClick: (event) => {
          event.preventDefault()
          void navigator.clipboard.writeText(publicPageUrl).then(() => {
            toastManager.add({
              title: "Link copied",
              type: "success",
            })
          })
        },
      },
      {
        name: "Settings",
        href: paths.auth.settings,
        icon: SettingsIcon,
      },
    ],
    [publicPageUrl]
  )
}
