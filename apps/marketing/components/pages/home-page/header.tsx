"use client"

import { Button } from "@/components/product-ui"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import UpgradeToPro from "@/components/upgrade-to-pro"
import { homeContent } from "@/content/home"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
  PlatformIcons,
} from "@/utils/platform"
import { productConfig } from "@workspace/config/public"
import { faArrowRight, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useDetectPlatform } from "hooks/use-detect-platform"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { InstantIcon, ScreenshotIcon, StudioIcon } from "./mode-icons"
import VideoModal from "./video-modal"

const HERO_MODE_ICONS = {
  instant: InstantIcon,
  studio: StudioIcon,
  screenshot: ScreenshotIcon,
} as const

const MODE_CYCLE_INTERVAL = 3500

const HERO_MODE_COLORS = {
  instant: "text-amber-600",
  studio: "text-blue-600",
  screenshot: "text-violet-600",
} as const

const TITLE_LEADING = "leading-[2.25rem] md:leading-[3.5rem]"

const trackHomepageEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  void import("@/lib/analytics").then(({ trackEvent }) => {
    trackEvent(eventName, properties)
  })
}

const HeroTitle = ({ text, animate }: { text: string; animate: boolean }) => {
  let letterIndex = -1
  const wordCounts: Record<string, number> = {}
  const charCounts: Record<string, number> = {}

  return (
    <>
      {text.split(" ").map((word) => {
        wordCounts[word] = (wordCounts[word] ?? 0) + 1
        return (
          <Fragment key={`${word}:${wordCounts[word]}`}>
            {" "}
            <span
              className={clsx("inline-block whitespace-nowrap", TITLE_LEADING)}
            >
              {animate
                ? Array.from(word).map((char) => {
                    letterIndex += 1
                    charCounts[char] = (charCounts[char] ?? 0) + 1
                    return (
                      <motion.span
                        key={`${char}:${charCounts[char]}`}
                        className={clsx("inline-block", TITLE_LEADING)}
                        initial={{
                          opacity: 0,
                          y: "0.4em",
                          filter: "blur(6px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: "0em",
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.34,
                          delay: letterIndex * 0.028,
                          ease: "easeOut",
                        }}
                      >
                        {char}
                      </motion.span>
                    )
                  })
                : word}
            </span>
          </Fragment>
        )
      })}
    </>
  )
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
  const heroModes = homeContent.header.modes
  const [activeModeIndex, setActiveModeIndex] = useState(0)
  const [modePickerInteracted, setModePickerInteracted] = useState(false)
  const [hasCycled, setHasCycled] = useState(false)
  const activeMode = heroModes[activeModeIndex]

  useEffect(() => {
    if (modePickerInteracted) return

    const interval = setInterval(() => {
      setActiveModeIndex((prev) => (prev + 1) % heroModes.length)
      setHasCycled(true)
    }, MODE_CYCLE_INTERVAL)

    return () => clearInterval(interval)
  }, [modePickerInteracted, heroModes.length])

  const downloadButton = (
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
  )

  const upgradeButton = (
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
  )

  return (
    <div className="mx-auto mt-[90px] mb-[60px] w-full max-w-[1920px] overflow-x-hidden sm:mb-[100px] md:mt-[140px] md:mb-[160px] md:overflow-visible xl:min-h-[700px]">
      <div className="relative z-10 mb-0 flex w-full flex-col justify-center px-5 lg:justify-start xl:flex-row">
        <div className="mx-auto w-full max-w-2xl xl:ml-[100px] xl:max-w-[530px] 2xl:mt-12 2xl:ml-[150px]">
          <div className="flex w-full max-w-[650px] flex-col text-center md:text-left">
            <div className="mb-5 flex justify-center md:justify-start">
              <div className="inline-flex gap-1 rounded-full border border-border bg-muted p-1">
                {heroModes.map((mode, index) => {
                  const isActive = index === activeModeIndex
                  const Icon = HERO_MODE_ICONS[mode.id]
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setModePickerInteracted(true)
                        setActiveModeIndex(index)
                        setHasCycled(true)
                      }}
                      className="relative flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="heroModeHighlight"
                          className="absolute inset-0 rounded-full border border-border bg-background shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      ) : null}
                      <Icon
                        className={clsx(
                          "relative z-1 size-3.5 transition-colors",
                          isActive
                            ? HERO_MODE_COLORS[mode.id]
                            : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={clsx(
                          "relative z-1 whitespace-nowrap transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {mode.label}
                        <span className="hidden sm:inline"> Mode</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-2 h-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeMode?.id ?? activeModeIndex}
                  className={clsx(
                    "block text-sm font-medium italic",
                    activeMode
                      ? HERO_MODE_COLORS[activeMode.id]
                      : "text-muted-foreground"
                  )}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  with {activeMode?.label ?? "Launch"}...
                </motion.span>
              </AnimatePresence>
            </div>

            <h1 className="relative z-10 mb-6 flex h-18 flex-col justify-center text-[2.25rem] leading-9 font-medium text-foreground md:h-28 md:text-[3.75rem] md:leading-14">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeMode?.id ?? activeModeIndex}
                  className={clsx("block text-balance", TITLE_LEADING)}
                  exit={{
                    opacity: 0,
                    y: -16,
                    filter: "blur(4px)",
                    transition: { duration: 0.2, ease: "easeIn" },
                  }}
                >
                  <HeroTitle
                    text={activeMode?.title ?? headerContent.title}
                    animate={hasCycled}
                  />
                </motion.span>
              </AnimatePresence>
            </h1>

            <p className="mx-auto mb-4 max-w-3xl text-lg leading-7 text-muted-foreground md:mx-0">
              {headerContent.description}
            </p>
          </div>

          <div className="mb-5 hidden flex-wrap items-center gap-4 md:flex">
            {downloadButton}
            {upgradeButton}
          </div>

          <div className="mb-5 flex flex-col gap-3 md:hidden">
            {downloadButton}
            <div className="mt-1 flex flex-col items-center gap-2">
              {upgradeButton}
              <span className="text-center text-xs text-muted-foreground">
                {productConfig.name} Pro unlocks unlimited cloud sharing, AI
                features &amp; team workspaces
              </span>
            </div>
          </div>

          <div className="mb-3 flex justify-center md:justify-start">
            <Link
              href="/migrate"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Coming from another tool? Bring your library with you
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-left">
            {homeContent.header.cta.freeVersionText}
          </p>

          <div className="mt-6 mb-10 hidden md:block">
            <PlatformIcons source="home_header" />

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
              className="mt-2 text-sm text-muted-foreground underline hover:text-foreground"
            >
              {homeContent.header.cta.seeOtherOptionsText}
            </Link>
          </div>

          <div className="mt-14">
            <p className="mb-4 text-center text-sm text-muted-foreground italic md:text-left">
              {homeContent.pricing.lovedBy}
            </p>
            <LogoMarquee />
          </div>
        </div>

        <div className="relative top-[-22%] w-full drop-shadow-2xl lg:right-[-400px] xl:absolute xl:max-w-[1000px] 2xl:right-[-300px] 2xl:max-w-[1200px]">
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setVideoToggled(true)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${productConfig.name} product demo`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setVideoToggled(true)
            }}
            className="xs:top-[180px] relative inset-x-0 top-[35vw] z-10 mx-auto flex size-[100px] cursor-pointer items-center justify-center rounded-full bg-blue-500 shadow-[0px_60px_40px_3px_rgba(0,0,0,0.4)] sm:top-[35vw] md:size-[150px] xl:top-[350px] xl:left-[-120px] 2xl:top-[400px]"
          >
            <FontAwesomeIcon
              icon={faPlay}
              className="size-8 text-white md:size-12"
            />
          </motion.div>
          <Image
            src="/illustrations/app.webp"
            width={1000}
            height={1000}
            quality={75}
            priority
            sizes="(min-width: 1536px) 1200px, (min-width: 1280px) 1000px, 100vw"
            alt={`${productConfig.name} product`}
            className="relative inset-0 size-full rounded-xl object-cover opacity-70"
          />
        </div>
      </div>
      <AnimatePresence>
        {videoToggled ? <VideoModal setVideoToggled={setVideoToggled} /> : null}
      </AnimatePresence>
    </div>
  )
}

export default Header
