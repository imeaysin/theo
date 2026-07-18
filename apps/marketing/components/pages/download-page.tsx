"use client"

import { Button } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import { useDetectPlatform } from "hooks/use-detect-platform"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
  getVersionText,
  PlatformIcons,
} from "@/utils/platform"
import { trackEvent } from "@/lib/analytics"

export const DownloadPage = () => {
  const { platform, isIntel } = useDetectPlatform()
  const loading = platform === null
  const primaryDownloadUrl = getDownloadUrl(platform, isIntel)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-32 sm:px-8 md:py-40">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl md:text-4xl">Download {productConfig.name}</h1>
        <p className="px-4 text-sm text-muted-foreground md:px-0 md:text-base">
          Get the desktop app for macOS or Windows and start in seconds.
        </p>
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            variant="blue"
            size="lg"
            href={primaryDownloadUrl}
            onClick={() =>
              trackEvent("download_cta_clicked", {
                source_page: "download_page",
                cta_location: "primary",
                target_url: primaryDownloadUrl,
                detected_platform: platform ?? "unknown",
                is_intel: Boolean(isIntel),
              })
            }
            className="flex w-full items-center justify-center font-medium text-primary-foreground sm:w-auto"
          >
            {!loading && getPlatformIcon(platform)}
            {getDownloadButtonText(platform, loading, isIntel)}
          </Button>
          <p className="text-sm text-muted-foreground">
            {getVersionText(platform)}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <PlatformIcons source="download_page" />
        </div>
      </div>
    </div>
  )
}
