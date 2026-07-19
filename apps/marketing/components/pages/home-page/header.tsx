"use client"

import { Button, Logo } from "@/components/product-ui"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import { homeContent } from "@/content/home"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
} from "@/utils/platform"
import { productConfig } from "@workspace/config/public"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { useDetectPlatform } from "hooks/use-detect-platform"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
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
    <section className="relative overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <Logo className="mb-8 h-10" />

          {announcement ? (
            <Link
              href={announcement.href}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              {announcement.text}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          ) : null}

          <h1 className="text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]">
            {headerContent.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {headerContent.description}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <Button
              variant="dark"
              href={primaryDownloadUrl}
              size="lg"
              className="justify-center font-medium"
              onClick={() =>
                trackHomepageEvent("download_cta_clicked", {
                  source_page: "home_header",
                  cta_location: "primary",
                  target_url: primaryDownloadUrl,
                  detected_platform: platform ?? "unknown",
                  is_intel: Boolean(isIntel),
                })
              }
            >
              {getPlatformIcon(displayPlatform)}
              {getDownloadButtonText(displayPlatform, false, isIntel)}
            </Button>
            <Button
              variant="outline"
              href="/pricing"
              size="lg"
              className="justify-center font-medium"
              onClick={() =>
                trackHomepageEvent("pricing_cta_clicked", {
                  source_page: "home_header",
                  cta_location: "secondary",
                  target_url: "/pricing",
                })
              }
            >
              {homeContent.header.cta.primaryButton}
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {homeContent.header.cta.freeVersionText}
          </p>

          <Link
            href="/migrate"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Coming from another tool?
            <span className="underline underline-offset-4">Migrate</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-5xl md:mt-20"
        >
          <div className="absolute -inset-4 rounded-4xl bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent_70%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-24px_color-mix(in_oklch,var(--foreground)_35%,transparent)] md:rounded-3xl">
            <button
              type="button"
              aria-label={`Play ${productConfig.name} product demo`}
              onClick={() => setVideoToggled(true)}
              className="absolute top-1/2 left-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:size-16 md:size-20"
            >
              <FontAwesomeIcon
                icon={faPlay}
                className="ml-0.5 size-5 sm:size-6 md:size-7"
              />
            </button>
            <Image
              src="/illustrations/app.webp"
              width={1400}
              height={900}
              quality={80}
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              alt={`${productConfig.name} product`}
              className="h-auto w-full object-cover"
            />
          </div>
        </motion.div>

        <div className="mx-auto mt-14 max-w-3xl md:mt-16">
          <p className="mb-5 text-center text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {homeContent.pricing.lovedBy}
          </p>
          <LogoMarquee />
        </div>
      </div>

      <AnimatePresence>
        {videoToggled ? <VideoModal setVideoToggled={setVideoToggled} /> : null}
      </AnimatePresence>
    </section>
  )
}

export default Header
