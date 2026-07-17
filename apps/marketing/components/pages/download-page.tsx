"use client"

import { Button } from "@/components/product-ui"
import { useDetectPlatform } from "hooks/use-detect-platform"
import Link from "next/link"
import { useState } from "react"
import { trackEvent } from "@/lib/analytics"
import { ChromeExtensionButton } from "@/components/chrome-extension-button"
import {
  CAP_CHROME_EXTENSION_URL,
  CHROME_EXTENSION_BUTTON_CLASS,
} from "@/lib/chrome-extension"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
  getVersionText,
  PlatformIcons,
} from "@/utils/platform"

export const DownloadPage = () => {
  const { platform, isIntel } = useDetectPlatform()
  const [copiedCliCommand, setCopiedCliCommand] = useState(false)
  const loading = platform === null
  const primaryDownloadUrl = getDownloadUrl(platform, isIntel)
  const cliInstallCommand =
    platform === "windows"
      ? "irm https://theo.example/install-cli.ps1 | iex"
      : "curl -fsSL https://theo.example/install-cli.sh | sh"

  const trackDownloadClick = (
    ctaLocation: string,
    targetUrl: string,
    target?: string
  ) => {
    trackEvent("download_cta_clicked", {
      source_page: "download_page",
      cta_location: ctaLocation,
      ...(target ? { target } : {}),
      target_url: targetUrl,
      detected_platform: platform ?? "unknown",
      is_intel: Boolean(isIntel),
    })
  }

  const copyCliInstallCommand = async () => {
    await navigator.clipboard.writeText(cliInstallCommand)
    setCopiedCliCommand(true)
    trackEvent("cli_install_command_copied", {
      source_page: "download_page",
      detected_platform: platform ?? "unknown",
    })
    window.setTimeout(() => setCopiedCliCommand(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-32 sm:px-8 md:py-40">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="animate-in text-2xl delay-300 fade-in slide-in-from-bottom-4 md:text-4xl">
          Download Theo
        </h1>
        <p className="animate-in px-4 text-sm text-muted-foreground delay-500 fade-in slide-in-from-bottom-4 md:px-0 md:text-base">
          The quickest way to share your screen. Pin to your dock or taskbar and
          record in seconds.
        </p>
        <div className="flex animate-in flex-col items-center justify-center gap-4 delay-500 fade-in slide-in-from-bottom-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="blue"
                size="lg"
                href={primaryDownloadUrl}
                onClick={() =>
                  trackDownloadClick("primary", primaryDownloadUrl)
                }
                className="flex w-full items-center justify-center font-medium text-primary-foreground sm:w-auto"
              >
                {!loading && getPlatformIcon(platform)}
                {getDownloadButtonText(platform, loading, isIntel)}
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                or
              </span>
              <ChromeExtensionButton
                variant="white"
                size="lg"
                onClick={() =>
                  trackDownloadClick(
                    "chrome_extension_primary",
                    CAP_CHROME_EXTENSION_URL,
                    "chrome_extension"
                  )
                }
                className={`${CHROME_EXTENSION_BUTTON_CLASS} w-full font-medium sm:w-auto`}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {getVersionText(platform)}
            </div>

            {/* Windows SmartScreen video and instructions */}
            {platform === "windows" && (
              <div className="mt-4 max-w-md">
                <video
                  src="/windows-smartscreen.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="mx-auto w-full rounded-md shadow-md"
                  style={{ maxWidth: "300px" }}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Whilst Theo for Windows is in early beta, after downloading
                  and running the app, follow the steps above to whitelist Theo
                  on your PC.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex animate-in items-center justify-center delay-500 fade-in slide-in-from-bottom-4">
          <PlatformIcons source="download_page" />
        </div>

        <div className="mx-auto mt-6 max-w-xl animate-in delay-500 fade-in slide-in-from-bottom-4">
          <div className="rounded-xl border border-border bg-muted p-4 text-left">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Install the Theo CLI
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Already have Theo Desktop? Link the bundled CLI for agents,
                  scripts, and terminals.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="gray"
                onClick={copyCliInstallCommand}
                className="shrink-0"
              >
                {copiedCliCommand ? "Copied" : "Copy command"}
              </Button>
            </div>
            <code className="mt-3 block overflow-x-auto rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              {cliInstallCommand}
            </code>
          </div>
        </div>

        <div className="mt-6 animate-in pb-4 delay-500 fade-in slide-in-from-bottom-4">
          <h3 className="mb-2 text-base font-medium text-foreground">
            Other download options:
          </h3>
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            {platform !== "windows" && (
              <a
                href="https://theo.example/download/windows"
                onClick={() =>
                  trackDownloadClick(
                    "other_option_windows",
                    "/download/windows"
                  )
                }
                className="text-sm text-muted-foreground transition-all hover:underline"
              >
                Windows (Beta)
              </a>
            )}
            {platform !== "linux" && (
              <a
                href="https://theo.example/download/linux-deb"
                onClick={() =>
                  trackDownloadClick(
                    "other_option_linux_deb",
                    "/download/linux-deb"
                  )
                }
                className="text-sm text-muted-foreground transition-all hover:underline"
              >
                Linux .deb
              </a>
            )}
            {platform === "macos" && isIntel && (
              <a
                href="https://theo.example/download/apple-silicon"
                onClick={() =>
                  trackDownloadClick(
                    "other_option_apple_silicon",
                    "/download/apple-silicon"
                  )
                }
                className="text-sm text-muted-foreground transition-all hover:underline"
              >
                Apple Silicon
              </a>
            )}
            {platform === "macos" && !isIntel && (
              <a
                href="https://theo.example/download/apple-intel"
                onClick={() =>
                  trackDownloadClick(
                    "other_option_apple_intel",
                    "/download/apple-intel"
                  )
                }
                className="text-sm text-muted-foreground transition-all hover:underline"
              >
                Apple Intel
              </a>
            )}
            {platform !== "macos" && (
              <>
                <a
                  href="https://theo.example/download/apple-silicon"
                  onClick={() =>
                    trackDownloadClick(
                      "other_option_apple_silicon",
                      "/download/apple-silicon"
                    )
                  }
                  className="text-sm text-muted-foreground transition-all hover:underline"
                >
                  Apple Silicon
                </a>
                <a
                  href="https://theo.example/download/apple-intel"
                  onClick={() =>
                    trackDownloadClick(
                      "other_option_apple_intel",
                      "/download/apple-intel"
                    )
                  }
                  className="text-sm text-muted-foreground transition-all hover:underline"
                >
                  Apple Intel
                </a>
              </>
            )}
            <Link
              href="/download/versions"
              onClick={() =>
                trackDownloadClick("all_versions", "/download/versions")
              }
              className="text-sm text-muted-foreground transition-all hover:underline"
            >
              All versions
            </Link>
          </div>
        </div>

        {/* Discreet SEO Links */}
        <div className="mt-32 border-t border-border pt-8 text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="/screen-recorder"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Screen Recorder
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/free-screen-recorder"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Free Screen Recorder
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/screen-recorder-mac"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Mac Screen Recorder
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/mac-screen-recording-with-audio"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Mac Audio Recording
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/screen-recorder-windows"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Windows Screen Recorder
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/screen-recording-software"
              className="text-xs hover:text-muted-foreground hover:underline"
            >
              Recording Software
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
