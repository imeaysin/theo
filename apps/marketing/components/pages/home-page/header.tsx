"use client"

import { Button, Logo } from "@/components/product-ui"
import UpgradeToPro from "@/components/upgrade-to-pro"
import { homeContent } from "@/content/home"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
  PlatformIcons,
} from "@/utils/platform"
import { productConfig } from "@workspace/config/public"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence } from "framer-motion"
import { useDetectPlatform } from "hooks/use-detect-platform"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import VideoModal from "./video-modal"

const trackHomepageEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  void import("@/lib/analytics").then(({ trackEvent }) => {
    trackEvent(eventName, properties)
  })
}

interface HeaderProps {
  serverHomepageCopyVariant?: string
}

const Header = ({ serverHomepageCopyVariant = "" }: HeaderProps) => {
  const [videoToggled, setVideoToggled] = useState(false)
  const { platform, isIntel } = useDetectPlatform()
  const displayPlatform = platform ?? "macos"
  const primaryDownloadUrl =
    platform === "windows" ? "/download" : getDownloadUrl(platform, isIntel)

  const getHeaderContent = () => {
    const variant =
      serverHomepageCopyVariant as keyof typeof homeContent.header.variants
    return (
      homeContent.header.variants[variant] ||
      homeContent.header.variants.default
    )
  }

  const headerContent = getHeaderContent()
  const announcement = homeContent.header.announcement

  return (
    <div className="mx-auto mt-[90px] mb-[60px] w-full max-w-[1920px] overflow-x-hidden sm:mb-[100px] md:mt-[140px] md:mb-[160px] md:overflow-visible xl:min-h-[700px]">
      <div className="relative z-10 mb-0 flex w-full flex-col justify-center px-5 lg:justify-start xl:flex-row">
        <div className="mx-auto w-full max-w-2xl xl:ml-[100px] xl:max-w-[530px] 2xl:mt-12 2xl:ml-[150px]">
          <div className="flex w-full max-w-[650px] flex-col text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <Logo className="h-10" />
            </div>

            {announcement ? (
              <p className="mb-4">
                <Link
                  href={announcement.href}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {announcement.text}
                </Link>
              </p>
            ) : null}

            <h1 className="relative z-10 mb-6 text-4xl leading-tight font-medium text-balance text-foreground md:text-6xl">
              {headerContent.title}
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-7 text-muted-foreground md:mx-0">
              {headerContent.description}
            </p>
          </div>

          <div className="mb-5 flex flex-col items-center gap-3 md:items-start">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button
                variant="dark"
                href={primaryDownloadUrl}
                onClick={() =>
                  trackHomepageEvent("download_cta_clicked", {
                    source_page: "home_header",
                    cta_location: "primary",
                    target_url: primaryDownloadUrl,
                    detected_platform: platform ?? "unknown",
                    is_intel: Boolean(isIntel),
                  })
                }
                size="lg"
                className="flex max-w-fit items-center justify-center font-medium"
              >
                {getPlatformIcon(displayPlatform)}
                {getDownloadButtonText(displayPlatform, false, isIntel)}
              </Button>
              <UpgradeToPro
                text={homeContent.header.cta.primaryButton}
                onClick={() =>
                  trackHomepageEvent("pricing_cta_clicked", {
                    source_page: "home_header",
                    cta_location: "secondary",
                    target_url: "/pricing",
                  })
                }
              />
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              {homeContent.header.cta.freeVersionText}
            </p>
            <Link
              href="/download"
              onClick={() =>
                trackHomepageEvent("download_cta_clicked", {
                  source_page: "home_header",
                  cta_location: "see_other_options",
                  target_url: "/download",
                  detected_platform: platform ?? "unknown",
                  is_intel: Boolean(isIntel),
                })
              }
              className="hidden text-sm text-muted-foreground underline hover:text-foreground md:inline"
            >
              {homeContent.header.cta.seeOtherOptionsText}
            </Link>
          </div>

          <div className="mt-8 hidden md:block">
            <PlatformIcons source="home_header" />
          </div>
        </div>

        <div className="relative mt-10 w-full xl:absolute xl:top-0 xl:right-0 xl:mt-0 xl:max-w-[55%] 2xl:max-w-[60%]">
          <button
            type="button"
            aria-label={`Play ${productConfig.name} product demo`}
            onClick={() => setVideoToggled(true)}
            className="absolute top-1/2 left-1/2 z-10 flex size-[100px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary shadow-xl transition-transform hover:scale-105 active:scale-95 md:size-[150px] xl:left-[40%]"
          >
            <FontAwesomeIcon
              icon={faPlay}
              className="size-8 text-primary-foreground md:size-12"
            />
          </button>
          <Image
            src="/illustrations/app.webp"
            width={1200}
            height={900}
            quality={75}
            priority
            sizes="(min-width: 1536px) 60vw, (min-width: 1280px) 55vw, 100vw"
            alt={`${productConfig.name} product`}
            className="relative inset-0 h-auto w-full object-cover opacity-90"
          />
        </div>
      </div>

      <AnimatePresence>
        {videoToggled && <VideoModal setVideoToggled={setVideoToggled} />}
      </AnimatePresence>
    </div>
  )
}

export default Header
