import { toastManager } from "@workspace/ui/components/toast"

export function buildPublicPageUrl(userName?: string | null): string {
  const slug = userName?.trim().toLowerCase().replace(/\s+/g, "-") || "user"
  if (typeof window === "undefined") return `/${slug}`
  return `${window.location.origin}/${slug}`
}

export function copyPublicPageLink(url: string): void {
  void navigator.clipboard.writeText(url).then(() => {
    toastManager.add({ title: "Link copied", type: "success" })
  })
}
