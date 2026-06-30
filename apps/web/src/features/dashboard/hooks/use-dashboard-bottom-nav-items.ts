import { useMemo } from "react"
import { CopyIcon, ExternalLinkIcon } from "lucide-react"
import type { NavItem } from "@workspace/ui/components/shell"
import { toastManager } from "@workspace/ui/components/toast"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"

export function usePublicPageUrl(): string {
  const { data: session } = useAuthSession()
  const user = session?.user

  return useMemo(() => {
    const slug = user?.name?.trim().toLowerCase().replace(/\s+/g, "-") || "user"
    if (typeof window === "undefined") return `/${slug}`
    return `${window.location.origin}/${slug}`
  }, [user?.name])
}

/** Secondary links shown in the mobile "more" drawer — not the desktop sidebar. */
export function useDashboardBottomNavItems(): NavItem[] {
  const publicPageUrl = usePublicPageUrl()

  return useMemo<NavItem[]>(
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
    ],
    [publicPageUrl]
  )
}
