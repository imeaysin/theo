// million-ignore
"use client"

import { Button } from "@/components/product-ui"
import { Input } from "@workspace/ui-shadcn/components/input"
import { faArrowRight, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useDetectPlatform } from "hooks/use-detect-platform"
import { useIsChromium } from "hooks/use-is-chromium"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useEffect, useState, useTransition } from "react"
import { ChromeExtensionButton } from "@/components/chrome-extension-button"
import { LoomMark } from "@/components/icons/loom-mark"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import {
  CAP_CHROME_EXTENSION_URL,
  CHROME_EXTENSION_BUTTON_CLASS,
} from "@/lib/chrome-extension"
import {
  getDownloadButtonText,
  getDownloadUrl,
  getPlatformIcon,
  PlatformIcons,
} from "@/utils/platform"
import { homepageCopy } from "../../../data/homepage-copy"
import UpgradeToPro from "@/components/upgrade-to-pro"
import { InstantIcon, ScreenshotIcon, StudioIcon } from "./mode-icons"
import VideoModal from "./video-modal"

const HERO_MODE_ICONS = {
  instant: InstantIcon,
  studio: StudioIcon,
  screenshot: ScreenshotIcon,
} as const

const MODE_CYCLE_INTERVAL = 3500

const sendDownloadLink = async (_email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return _email.includes("@")
    ? { success: true as const }
    : { success: false as const, error: "Enter a valid email address." }
}

const HERO_MODE_COLORS = {
  instant: "text-primary",
  studio: "text-primary",
  screenshot: "text-primary",
} as const

const TITLE_LEADING = "leading-tight"

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
  const isChromium = useIsChromium()
  // Render the button at its final size on first paint to avoid a layout shift
  // once the platform resolves: the label is "Download for free" for every
  // platform and the icon is always the same size, so defaulting the display to
  // macOS (also the default download target) keeps width stable.
  const displayPlatform = platform ?? "macos"
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")
  const [emailError, setEmailError] = useState("")
  const [isPending, startTransition] = useTransition()
  const primaryDownloadUrl =
    platform === "windows" ? "/download" : getDownloadUrl(platform, isIntel)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailStatus("sending")
    setEmailError("")
    trackHomepageEvent("download_cta_clicked", {
      source_page: "home_header",
      cta_location: "mobile_email_link",
      target: "email_download_link",
      target_url: "/download",
      detected_platform: platform ?? "unknown",
      is_intel: Boolean(isIntel),
    })

    startTransition(async () => {
      const result = await sendDownloadLink(email)
      if (result.success) {
        setEmailStatus("sent")
      } else {
        setEmailStatus("error")
        setEmailError(result.error ?? "Something went wrong.")
      }
    })
  }

  const getHeaderContent = () => {
    const variant =
      serverHomepageCopyVariant as keyof typeof homepageCopy.header.variants
    return (
      homepageCopy.header.variants[variant] ||
      homepageCopy.header.variants.default
    )
  }

  const headerContent = getHeaderContent()

  const heroModes = homepageCopy.header.modes
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
      text={homepageCopy.header.cta.primaryButton}
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
                      {isActive && (
                        <motion.span
                          layoutId="heroModeHighlight"
                          className="absolute inset-0 rounded-full border border-border bg-card shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
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
                    "block text-sm font-semibold italic",
                    activeMode
                      ? HERO_MODE_COLORS[activeMode.id]
                      : "text-muted-foreground"
                  )}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  with {activeMode?.label ?? "Instant"} Mode...
                </motion.span>
              </AnimatePresence>
            </div>

            <h1 className="relative z-10 mb-6 flex min-h-20 flex-col justify-center text-4xl leading-tight font-medium text-foreground md:min-h-28 md:text-6xl">
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

          {isChromium ? (
            <div className="mb-5 hidden flex-col gap-4 md:flex">
              <div className="flex flex-wrap items-center gap-4">
                {downloadButton}
                <span className="text-sm font-medium text-muted-foreground">
                  or
                </span>
                <ChromeExtensionButton
                  variant="white"
                  onClick={() =>
                    trackHomepageEvent("download_cta_clicked", {
                      source_page: "home_header",
                      cta_location: "chrome_extension_secondary",
                      target: "chrome_extension",
                      target_url: CAP_CHROME_EXTENSION_URL,
                      detected_platform: platform ?? "unknown",
                      is_intel: Boolean(isIntel),
                    })
                  }
                  className={clsx(
                    CHROME_EXTENSION_BUTTON_CLASS,
                    "max-w-fit font-medium"
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                {upgradeButton}
                <span className="max-w-[240px] text-sm leading-snug text-muted-foreground">
                  Theo Pro gives you unlimited cloud sharing, AI summaries &amp;
                  team features
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-5 hidden flex-wrap items-center gap-4 md:flex">
              {downloadButton}
              {upgradeButton}
            </div>
          )}

          <div className="mb-5 flex flex-col gap-3 md:hidden">
            {emailStatus === "sent" ? (
              <div className="rounded-xl border border-border bg-muted px-4 py-3">
                <p className="text-base font-medium text-foreground">
                  Check your inbox! We&apos;ve sent the download links to{" "}
                  <strong>{email}</strong>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col gap-2"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full"
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? "Sending..." : "Email me the download link"}
                </Button>
                {emailStatus === "error" && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </form>
            )}
            <div className="mt-1 flex flex-col items-center gap-2">
              <UpgradeToPro
                text={homepageCopy.header.cta.primaryButton}
                onClick={() =>
                  trackHomepageEvent("pricing_cta_clicked", {
                    source_page: "home_header",
                    cta_location: "mobile_secondary",
                    target_url: "/pricing",
                  })
                }
              />
              <span className="text-center text-sm text-muted-foreground">
                Theo Pro gives you unlimited cloud sharing, AI summaries &amp;
                team features
              </span>
            </div>
          </div>

          <div className="mb-3 flex justify-center md:justify-start">
            <Link
              href="/migrate-from-loom"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LoomMark size={15} />
              Coming from Loom? Bring your library with you
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-left">
            {homepageCopy.header.cta.freeVersionText}
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
              {homepageCopy.header.cta.seeOtherOptionsText}
            </Link>
          </div>

          <div className="mt-14">
            <p className="mb-4 text-center text-sm text-muted-foreground italic md:text-left">
              Trusted by <strong>40,000+</strong> teams, builders and creators
            </p>
            <LogoMarquee />
          </div>
        </div>

        <div className="top-[-22%] w-full drop-shadow-2xl lg:right-[-400px] xl:absolute xl:max-w-[1000px] 2xl:right-[-300px] 2xl:max-w-[1200px]">
          {/* Play Button*/}
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setVideoToggled(true)}
            className="xs:top-[180px] relative inset-x-0 top-[35vw] z-10 mx-auto flex size-[100px] cursor-pointer items-center justify-center rounded-full bg-primary shadow-xl sm:top-[35vw] md:size-[150px] xl:top-[350px] xl:left-[-120px] 2xl:top-[400px]"
          >
            <FontAwesomeIcon
              icon={faPlay}
              className="size-8 text-primary-foreground md:size-12"
            />
          </motion.div>
          <Image
            src="/illustrations/app.webp"
            width={1000}
            height={1000}
            quality={75}
            priority
            sizes="(min-width: 1536px) 1200px, (min-width: 1280px) 1000px, 100vw"
            alt="App"
            className="relative inset-0 size-full rounded-xl object-cover opacity-70"
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
