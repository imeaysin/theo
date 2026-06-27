"use client"

import { LogEvents, track } from "@/lib/track"
import { cn } from "@workspace/ui/lib/utils"
import { Icons } from "@workspace/ui/components/icons"
import { marketingEnv } from "@/config/env"
import {
  appPrefetchRoutes,
  featurePrefetchRoutes,
  headerFeatureLinks,
  headerResourceLinksCol1,
  headerResourceLinksCol2,
  headerResourceLinks,
} from "@/config/navigation"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config/site"
import { useCallback, useEffect, useRef, useState } from "react"
import { HeaderIntegrationsPreview } from "@/components/layout/header-integrations-preview"
import type { Testimonial } from "@/components/sections/testimonials-section"
import { defaultTestimonials } from "@/components/sections/testimonials-section"

// All testimonials for header rotation (includes default + new ones)
const headerTestimonials: Testimonial[] = [
  ...defaultTestimonials,
  {
    name: "Vitalie Rosescu",
    title: "",
    company: "Awwwocado",
    country: "Netherlands",
    image: "/stories/vitalie.jpg",
    content:
      "All in one platform for freelancers looking to create clear insights on income and expenses.",
    fullContent:
      "Company\nAwwwocado is a Webflow development business.\n\nChallenge\nWhat I lacked in other software is the overview of which invoices were paid and which were pending, and seeing my overall income. Existing tools didn't give a clear picture of finances.\n\nImpact\nHaving a clear overview of income, invoices, and expenses in one place made managing the business much easier.\n\nFavorite features\nInvoices, because it's a big time saver.\nA clean share link for customers is very nice.\nExpenses being taken from my inbox and being able to upload expenses is a huge one.\nThe invoice template is clean out of the box and very customizable.",
  },
  {
    name: "Nick Speer",
    title: "",
    company: "Speer Technologies",
    country: "United States",
    image: "/stories/speer.jpeg",
    content:
      "Midday is bookkeeping software without the fluff. It's a ledger with modern tooling and integrations.",
    fullContent:
      "Company\nSpeer Technologies is an AI consulting firm in the US. We accelerate our clients' AI initiatives from problem discovery to production across industries including Finance, Healthcare, and Defense.\n\nChallenge\nI was spending too much time on weekends cleaning up my books, juggling invoices, and clicking around clunky software. It felt like another job, and the other solutions didn't work the way I wanted.\n\nImpact\nAfter switching from QuickBooks to Midday, it felt like I was in control of my books. I could see every transaction and expense as it came in and manage it without feeling overwhelmed.\n\nFavorite features\nAuto-categorization is far better than other programs, which saves time from manually organizing books. From there, I can export data and get insights into exact spending categories.",
  },
  {
    name: "Ivo Dukov",
    title: "",
    company: "Smarch",
    country: "Bulgaria",
    content:
      "Everything lives in one place now — customers, invoices, documents, and financial analytics.",
    fullContent:
      "Company\nSmarch is a software development agency specializing in e-commerce, web applications, and custom backend systems.\n\nChallenge\nBefore Midday, I was manually creating PDF invoices, piecing together bank reports to understand how the company was doing, and collecting financial documents every time accounting needed something. It was scattered and tedious.\n\nImpact\nEverything lives in one place now. I set up invoice templates once, have all clients organized, get real analytics on company performance, and keep documents in a proper vault. What used to take hours of admin work is now streamlined and mostly automatic.\n\nFavorite features\nInvoice templates. They eliminate repetitive work when billing multiple clients.",
  },
  {
    name: "Isabel Sá",
    title: "",
    company: "Character",
    country: "Portugal",
    content:
      "I find myself having a better sense of runway and financials than before. The auto-reconciliation of payments and receipts is a game changer.",
    fullContent:
      "Company\nCharacter is a software design studio.\n\nChallenge\nGetting the big picture across banks and currencies. We have both Portuguese and Belgian bank accounts, and reconciling these two was always difficult. There was no easy way to see everything in one place.\n\nImpact\nA much better sense of runway and financials than before. Both bigger picture things like tax breakdowns, and smaller things like keeping an eye on expenses and removing unused subscriptions. The accounting team just logs in to Midday to grab what they need.\n\nFavorite features\nInbox and Transactions. The transactions tab was already a major upgrade from the previous workflow in Excel, but the auto-reconciliation of payments and receipts is a game changer. Drastically reduced time spent on it. We're also in the process of migrating invoicing to Midday to get the full network effect.",
  },
  {
    name: "Ciarán Harris",
    title: "",
    company: "CogniStream",
    country: "Ireland",
    image: "/stories/ciaran.jpeg",
    content:
      "Financial admin stopped being a source of friction. Midday actually works the way you'd expect modern software to work.",
    fullContent:
      "Company\nCogniStream is an AI-moderated qualitative research platform. We have natural voice conversations with customers, analyse not just what they say but how they feel when they say it, and help businesses make confident decisions faster. I'm Ciarán Harris, CEO and Co-Founder, a two-time founder with over 25 years of research experience for global giants.\n\nChallenge\nI tried using Xero. It couldn't connect to my bank account reliably, the interface felt like it hadn't been updated in a decade, and just getting up and running was painful. It never worked out of the box. The real kicker? My accountant also used Xero, but he preferred I send him everything as a CSV anyway. That completely negated the point. As a founder, you need financial admin to just work so you can focus on building the business. It wasn't working.\n\nImpact\nFinancial admin stopped being a source of friction. Midday actually works the way you'd expect modern software to work. I check in every few days to keep on top of things, and every few weeks I'll do a more involved session to get through receipt scanning and matching ahead of VAT returns. It removed the single biggest pain point from my week-to-week financial admin, and everything else it does is a genuinely useful bonus on top of that.\n\nFavorite features\nReceipt scanning and matching, without question. That's the feature that removes the most friction from running the business day to day. Before, receipts were scattered and matching them to transactions was tedious. Now it's handled. That one feature alone justified the switch. The AI assistant is a nice bonus too, being able to ask a natural language question about your finances and get detailed results is genuinely useful.",
  },
]

interface HeaderProps {
  transparent?: boolean
  hideMenuItems?: boolean
}

// Feature pages to prefetch on hover
const FEATURE_ROUTES = featurePrefetchRoutes

// App pages to prefetch on hover
const APP_ROUTES = appPrefetchRoutes

const HEADER_INTEGRATIONS = [
  { src: "/images/gmail.svg", alt: "Gmail" },
  { src: "/images/slack.svg", alt: "Slack" },
  { src: "/images/stripe.svg", alt: "Stripe" },
  { src: "/images/gdrive.svg", alt: "Google Drive" },
  { src: "/images/outlook.svg", alt: "Outlook" },
  { src: "/images/whatsapp.svg", alt: "WhatsApp" },
  { src: "/images/dropbox.svg", alt: "Dropbox" },
]

export function Header({
  transparent = false,
  hideMenuItems = false,
}: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
  const [isAppsOpen, setIsAppsOpen] = useState(false)
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false)
  const [isMobileAppsOpen, setIsMobileAppsOpen] = useState(false)
  const [visibleIntegrations, setVisibleIntegrations] = useState<
    { id: number; key: string }[]
  >([])
  const [featuresDropdownHeight, setFeaturesDropdownHeight] = useState<
    number | null
  >(null)
  const featuresTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const appsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const integrationKeyCounterRef = useRef(0)
  const featuresListRef = useRef<HTMLDivElement>(null)
  const preAccountingRef = useRef<HTMLAnchorElement>(null)
  const appsListRef = useRef<HTMLDivElement>(null)
  const macAppRef = useRef<HTMLAnchorElement>(null)
  const integrationsAppRef = useRef<HTMLAnchorElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const featuresPrefetched = useRef(false)
  const appsPrefetched = useRef(false)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  // Prefetch feature pages on hover (only once)
  const prefetchFeatures = useCallback(() => {
    if (featuresPrefetched.current) return
    featuresPrefetched.current = true
    for (const route of FEATURE_ROUTES) {
      router.prefetch(route)
    }
  }, [router])

  // Prefetch app pages on hover (only once)
  const prefetchApps = useCallback(() => {
    if (appsPrefetched.current) return
    appsPrefetched.current = true
    for (const route of APP_ROUTES) {
      router.prefetch(route)
    }
  }, [router])

  // Initialize with 4 random integrations
  useEffect(() => {
    if (isAppsOpen && visibleIntegrations.length === 0) {
      const shuffled = [...HEADER_INTEGRATIONS.keys()].sort(
        () => Math.random() - 0.5
      )
      setVisibleIntegrations(
        shuffled.slice(0, 4).map((idx) => ({
          id: idx,
          key: `init-${integrationKeyCounterRef.current++}`,
        }))
      )
    }
  }, [isAppsOpen, visibleIntegrations.length])

  // Randomly fade in/out individual logos
  useEffect(() => {
    if (!isAppsOpen || visibleIntegrations.length === 0) return

    const interval = setInterval(
      () => {
        setVisibleIntegrations((current) => {
          // Randomly decide to replace one logo (70% chance)
          if (Math.random() < 0.7 && current.length === 4) {
            const indexToReplace = Math.floor(Math.random() * 4)
            const availableIndices = HEADER_INTEGRATIONS.map(
              (_, i) => i
            ).filter((i) => !current.some((item) => item.id === i))

            if (availableIndices.length > 0) {
              const newIndex =
                availableIndices[
                  Math.floor(Math.random() * availableIndices.length)
                ]
              const newVisible = [...current]
              newVisible[indexToReplace] = {
                id: newIndex ?? 0,
                key: `change-${integrationKeyCounterRef.current++}`,
              }
              return newVisible
            }
          }
          return current
        })
      },
      1500 + Math.random() * 1000
    ) // Random interval between 1.5-2.5 seconds

    return () => clearInterval(interval)
  }, [isAppsOpen, visibleIntegrations.length])

  // Match Pre-accounting container height to features list and store height for apps dropdown
  useEffect(() => {
    if (isFeaturesOpen && featuresListRef.current) {
      // Get the full dropdown height including padding
      const featuresDropdown = featuresListRef.current.closest(
        "[data-features-dropdown]"
      ) as HTMLElement
      const featuresHeight = featuresDropdown
        ? featuresDropdown.offsetHeight
        : featuresListRef.current.offsetHeight
      setFeaturesDropdownHeight(featuresHeight)
    }
  }, [isFeaturesOpen])

  // Apps dropdown height matches Features dropdown (image containers are fixed at 442x277)

  useEffect(() => {
    return () => {
      if (featuresTimeoutRef.current) {
        clearTimeout(featuresTimeoutRef.current)
      }
      if (appsTimeoutRef.current) {
        clearTimeout(appsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Dark Overlay */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-40 transition-opacity duration-150 ${
          isFeaturesOpen || isAppsOpen
            ? "visible bg-black/40 opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        style={{ top: "108px" }}
      />

      {/* Navigation Bar */}
      <nav className="fixed top-9 right-0 left-0 z-50 w-full">
        <div
          ref={headerRef}
          className={cn(
            "relative flex items-center justify-between px-4 py-3 sm:px-4 md:px-4 lg:px-4 xl:gap-6 xl:px-6 xl:py-4 2xl:px-8",
            isMenuOpen && "border-b border-border",
            !transparent && "bg-background-semi-transparent backdrop-blur-md",
            !transparent && (isFeaturesOpen || isAppsOpen) && "xl:bg-background"
          )}
        >
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex touch-manipulation items-center gap-2 transition-opacity duration-200 hover:opacity-80 active:opacity-80"
            onClick={() => setIsMenuOpen(false)}
            style={{ WebkitTapHighlightColor: "transparent" }}
            aria-label={`${siteConfig.name} - Go to homepage`}
          >
            <div className="h-6 w-6">
              <Icons.LogoSmall className="h-full w-full text-foreground" />
            </div>
            <span className="font-sans text-base text-foreground xl:hidden">
              {siteConfig.name.toLowerCase()}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {!hideMenuItems && (
            <div className="hidden items-center gap-6 xl:flex">
              {/* Features with Dropdown */}
              <div
                className="relative -mx-3 -my-2"
                onMouseEnter={() => {
                  if (featuresTimeoutRef.current) {
                    clearTimeout(featuresTimeoutRef.current)
                  }
                  prefetchFeatures()
                  // Rotate to next testimonial
                  setCurrentTestimonialIndex(
                    (prev) => (prev + 1) % headerTestimonials.length
                  )
                  setIsFeaturesOpen(true)
                }}
                onMouseLeave={() => {
                  featuresTimeoutRef.current = setTimeout(() => {
                    setIsFeaturesOpen(false)
                  }, 200)
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                  <Icons.ArrowDropDown
                    className={`h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Invisible bridge to dropdown */}
                {isFeaturesOpen && (
                  <div
                    className="absolute right-0 left-0 h-4"
                    style={{ top: "100%" }}
                  />
                )}

                {/* Features Dropdown - Full Width */}
                {isFeaturesOpen && (
                  <div
                    data-features-dropdown
                    className="fixed right-0 left-0 z-50 animate-dropdown-fade overflow-hidden border-t border-b border-border bg-background opacity-0 shadow-lg"
                    style={{ top: "100%" }}
                  >
                    <div className="p-6 xl:p-8 2xl:p-10">
                      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
                        {/* Column 1 & 2 - Features List (2 columns) */}
                        <div
                          className="lg:col-span-2 xl:max-w-xl 2xl:max-w-xl"
                          ref={featuresListRef}
                        >
                          <div className="grid grid-cols-2 gap-x-4">
                            {/* Column 1 */}
                            <div>
                              {headerFeatureLinks
                                .slice(0, 4)
                                .map((item, index) => (
                                  <div
                                    key={item.href}
                                    className="animate-dropdown-slide opacity-0"
                                    style={{
                                      animationDelay: `${index * 30}ms`,
                                    }}
                                  >
                                    <Link
                                      href={item.href}
                                      className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                      onClick={() => setIsFeaturesOpen(false)}
                                    >
                                      <div className="flex flex-col pl-2">
                                        <span className="mb-1 font-sans text-base text-foreground">
                                          {item.title}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                          {item.description}
                                        </span>
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                            </div>
                            {/* Column 2 */}
                            <div>
                              {headerFeatureLinks
                                .slice(4)
                                .map((item, index) => (
                                  <div
                                    key={item.href}
                                    className="animate-dropdown-slide opacity-0"
                                    style={{
                                      animationDelay: `${(index + 4) * 30}ms`,
                                    }}
                                  >
                                    <Link
                                      href={item.href}
                                      className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                      onClick={() => setIsFeaturesOpen(false)}
                                    >
                                      <div className="flex flex-col pl-2">
                                        <span className="mb-1 font-sans text-base text-foreground">
                                          {item.title}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                          {item.description}
                                        </span>
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 3 & 4 - Preview Cards */}
                        <div className="flex flex-nowrap items-start justify-end gap-4 lg:col-span-2">
                          {/* Pre-accounting Preview */}
                          <Link
                            ref={preAccountingRef}
                            href="/pre-accounting"
                            onClick={() => setIsFeaturesOpen(false)}
                            className="flex h-[277px] w-full max-w-[320px] shrink-0 cursor-pointer flex-col overflow-hidden border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-[350px] 2xl:w-[400px]"
                          >
                            <div className="flex h-[214px] items-center justify-center bg-background p-4">
                              <Image
                                src="/images/accounting-light.png"
                                alt="Pre-accounting"
                                width={112}
                                height={400}
                                className="h-auto max-h-[80px] w-auto object-contain dark:hidden"
                              />
                              <Image
                                src="/images/accounting-dark.png"
                                alt="Pre-accounting"
                                width={112}
                                height={400}
                                className="hidden h-auto max-h-[80px] w-auto object-contain dark:block"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-border bg-background p-2.5">
                              <div className="flex-1">
                                <span className="block font-sans text-xs text-foreground">
                                  Pre-accounting
                                </span>
                                <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                  Clean records ready for your accountant
                                </span>
                              </div>
                              <div className="flex shrink-0 items-center gap-1.5">
                                <div className="flex h-6 w-6 items-center justify-center border border-border bg-background">
                                  <Image
                                    src="/images/xero.svg"
                                    alt="Xero"
                                    width={14}
                                    height={14}
                                    unoptimized
                                    className="h-auto max-h-[14px] w-auto max-w-[14px] object-contain opacity-70"
                                    style={{ width: "auto", height: "auto" }}
                                  />
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center border border-border bg-background">
                                  <Image
                                    src="/images/quickbooks.svg"
                                    alt="QuickBooks"
                                    width={14}
                                    height={14}
                                    unoptimized
                                    className="h-auto max-h-[14px] w-auto max-w-[14px] object-contain opacity-70"
                                    style={{ width: "auto", height: "auto" }}
                                  />
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center border border-border bg-background">
                                  <Image
                                    src="/images/fortnox.svg"
                                    alt="Fortnox"
                                    width={14}
                                    height={14}
                                    unoptimized
                                    className="h-auto max-h-[14px] w-auto max-w-[14px] object-contain opacity-70"
                                    style={{ width: "auto", height: "auto" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Customer Stories Preview */}
                          <Link
                            href="/testimonials"
                            onClick={() => setIsFeaturesOpen(false)}
                            className="flex h-[277px] w-full max-w-[320px] shrink-0 cursor-pointer flex-col overflow-visible border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-[350px] 2xl:w-[400px]"
                          >
                            <div className="relative flex flex-1 items-center justify-center overflow-visible bg-background p-4">
                              <span className="pointer-events-none absolute top-[89%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 font-serif text-[20rem] leading-none whitespace-nowrap text-muted-foreground opacity-10 select-none xl:text-[22rem] 2xl:text-[24rem]">
                                &rdquo;
                              </span>
                              {(() => {
                                const testimonial =
                                  headerTestimonials[currentTestimonialIndex]
                                if (!testimonial) return null
                                const firstSentenceEnd =
                                  testimonial.content.match(/[.!?]\s/)
                                const firstSentence = firstSentenceEnd
                                  ? testimonial.content.substring(
                                      0,
                                      firstSentenceEnd.index! + 1
                                    )
                                  : testimonial.content
                                return (
                                  <div className="relative z-10 line-clamp-3 w-full px-2 text-center font-serif text-sm leading-tight xl:text-base 2xl:text-lg">
                                    <span className="text-primary">
                                      &ldquo;{firstSentence}&rdquo;
                                    </span>
                                  </div>
                                )
                              })()}
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-border bg-background p-2.5">
                              <div className="flex-1">
                                <span className="block font-sans text-xs text-foreground">
                                  Customer Stories
                                </span>
                                <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                  See how founders use Midday
                                </span>
                              </div>
                              {(() => {
                                const testimonial =
                                  headerTestimonials[currentTestimonialIndex]
                                if (!testimonial?.image) return null
                                return (
                                  <div className="flex shrink-0 items-center gap-1.5">
                                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden bg-background">
                                      <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={24}
                                        height={24}
                                        className="h-full w-full object-cover opacity-70"
                                        style={{ filter: "grayscale(100%)" }}
                                      />
                                    </div>
                                  </div>
                                )
                              })()}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/story"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Story
              </Link>
              <Link
                href="/download"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Download
              </Link>

              {/* Resources with Dropdown */}
              <div
                className="relative -mx-3 -my-2"
                onMouseEnter={() => {
                  if (appsTimeoutRef.current) {
                    clearTimeout(appsTimeoutRef.current)
                  }
                  prefetchApps()
                  setIsAppsOpen(true)
                }}
                onMouseLeave={() => {
                  appsTimeoutRef.current = setTimeout(() => {
                    setIsAppsOpen(false)
                  }, 200)
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resources
                  <Icons.ArrowDropDown
                    className={`h-4 w-4 transition-transform duration-200 ${isAppsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Invisible bridge to dropdown */}
                {isAppsOpen && (
                  <div
                    className="absolute right-0 left-0 h-4"
                    style={{ top: "100%" }}
                  />
                )}

                {/* Resources Dropdown - Full Width */}
                {isAppsOpen && (
                  <div
                    className="fixed right-0 left-0 z-50 animate-dropdown-fade overflow-hidden border-t border-b border-border bg-background opacity-0 shadow-lg"
                    style={{
                      top: "100%",
                      height:
                        featuresDropdownHeight !== null
                          ? `${featuresDropdownHeight}px`
                          : "auto",
                    }}
                  >
                    <div className="h-full p-6 xl:p-8 2xl:p-10">
                      <div className="grid h-full grid-cols-1 items-start gap-4 lg:grid-cols-4 xl:gap-6">
                        {/* Column 1 & 2 - Apps List (2 columns) */}
                        <div
                          ref={appsListRef}
                          className="lg:col-span-2 lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
                        >
                          <div className="grid grid-cols-2 gap-x-4">
                            {/* Column 1 */}
                            <div>
                              {headerResourceLinksCol1.map((item, index) => (
                                <div
                                  key={item.href}
                                  className="animate-dropdown-slide opacity-0"
                                  style={{ animationDelay: `${index * 30}ms` }}
                                >
                                  <Link
                                    href={item.href}
                                    className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                    onClick={() => setIsAppsOpen(false)}
                                  >
                                    <div className="flex flex-col pl-2">
                                      <span className="mb-1 font-sans text-base text-foreground">
                                        {item.title}
                                      </span>
                                      <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                        {item.description}
                                      </span>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                            {/* Column 2 */}
                            <div>
                              {headerResourceLinksCol2.map((item, index) => (
                                <div
                                  key={`${item.href}-${item.title}`}
                                  className="animate-dropdown-slide opacity-0"
                                  style={{
                                    animationDelay: `${(index + 2) * 30}ms`,
                                  }}
                                >
                                  {item.external ? (
                                    <a
                                      href={item.href}
                                      className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                      onClick={() => setIsAppsOpen(false)}
                                    >
                                      <div className="flex flex-col pl-2">
                                        <span className="mb-1 font-sans text-base text-foreground">
                                          {item.title}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                          {item.description}
                                        </span>
                                      </div>
                                    </a>
                                  ) : (
                                    <Link
                                      href={item.href}
                                      className="group flex items-center py-3 transition-colors duration-200 hover:bg-secondary"
                                      onClick={() => setIsAppsOpen(false)}
                                    >
                                      <div className="flex flex-col pl-2">
                                        <span className="mb-1 font-sans text-base text-foreground">
                                          {item.title}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                          {item.description}
                                        </span>
                                      </div>
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Columns 3 & 4 - Image Previews Container */}
                        <div className="flex flex-nowrap items-start justify-end gap-4 lg:col-span-2">
                          {/* Integrations Preview */}
                          <Link
                            ref={integrationsAppRef}
                            href="/integrations"
                            onClick={() => setIsAppsOpen(false)}
                            className="flex h-[277px] w-full max-w-[320px] shrink-0 cursor-pointer flex-col overflow-hidden border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-[350px] 2xl:w-[400px]"
                          >
                            <div className="flex-1">
                              <HeaderIntegrationsPreview />
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-border bg-background p-2.5">
                              <div className="flex-1">
                                <span className="block font-sans text-xs text-foreground">
                                  Integrations
                                </span>
                                <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                  Connect your existing tools.
                                </span>
                              </div>
                              <div className="relative flex h-6 shrink-0 items-center gap-1.5">
                                {visibleIntegrations.map((item) => (
                                  <div
                                    key={item.key}
                                    className="flex h-6 w-6 items-center justify-center border border-border bg-background transition-all duration-300"
                                  >
                                    <Image
                                      src={
                                        HEADER_INTEGRATIONS[item.id]?.src ?? ""
                                      }
                                      alt={
                                        HEADER_INTEGRATIONS[item.id]?.alt ?? ""
                                      }
                                      width={14}
                                      height={14}
                                      unoptimized
                                      className="h-auto max-h-[14px] w-auto max-w-[14px] object-contain opacity-70"
                                      style={{ width: "auto", height: "auto" }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Link>

                          {/* Mac App Preview */}
                          <Link
                            ref={macAppRef}
                            href="/download"
                            onClick={() => setIsAppsOpen(false)}
                            className="flex h-[277px] w-full max-w-[320px] shrink-0 cursor-pointer flex-col overflow-hidden border border-border transition-all duration-200 hover:scale-[1.02] hover:border-foreground/20 hover:opacity-90 lg:w-[320px] lg:max-w-none xl:w-[350px] 2xl:w-[400px]"
                          >
                            <div className="flex flex-1 items-center justify-center bg-background p-4">
                              <Image
                                src="/images/header-dock-light.png"
                                alt="Mac Dock"
                                width={1200}
                                height={300}
                                className="h-auto w-3/4 object-contain dark:hidden"
                              />
                              <Image
                                src="/images/header-dock-dark.png"
                                alt="Mac Dock"
                                width={1200}
                                height={300}
                                className="hidden h-auto w-3/4 object-contain dark:block"
                              />
                            </div>
                            <div className="border-t border-border bg-background p-2.5">
                              <span className="block font-sans text-xs text-foreground">
                                Mac app
                              </span>
                              <span className="font-sans text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                                Your business, always one click away.
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign in */}
              <div className="border-l border-border pl-4">
                <Link
                  href={marketingEnv.appUrl}
                  className="text-sm text-primary transition-colors hover:text-primary/80"
                  onClick={() =>
                    track({
                      event: LogEvents.CTA.name,
                      channel: LogEvents.CTA.channel,
                      label: "Sign in",
                      position: "header",
                    })
                  }
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {/* Mobile & Tablet Hamburger Menu */}
          <div className="flex items-center xl:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-end p-2 text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:outline-none xl:active:text-primary"
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative flex size-5 flex-col items-center justify-center">
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded-none bg-current"
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 0 : -4.5,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded-none bg-current"
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                    scaleX: isMenuOpen ? 0 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded-none bg-current"
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? 0 : 4.5,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background xl:hidden">
          <div className="px-6 pt-28">
            <div className="flex flex-col space-y-6 text-left">
              {/* Features Expandable Section */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={(e) => {
                    setIsMobileFeaturesOpen(!isMobileFeaturesOpen)
                    e.currentTarget.blur()
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.blur()
                  }}
                  className="flex touch-manipulation items-center justify-between py-2 font-sans text-2xl text-primary transition-colors hover:text-primary focus:outline-none focus-visible:outline-none xl:active:text-primary"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span>Features</span>
                  <Icons.ArrowDropDown
                    className={`h-6 w-6 transition-transform duration-200 ${
                      isMobileFeaturesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileFeaturesOpen && (
                  <>
                    <div className="my-2 h-px w-full border-t border-border" />
                    <div className="animate-mobile-slide overflow-hidden opacity-0">
                      <div className="flex flex-col space-y-4 pt-2">
                        {headerFeatureLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsMobileFeaturesOpen(false)
                            }}
                            className="touch-manipulation text-left font-sans text-lg text-muted-foreground transition-colors hover:text-muted-foreground focus:outline-none focus-visible:outline-none xl:active:text-muted-foreground"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link
                href="/story"
                onTouchEnd={(e) => {
                  const target = e.currentTarget
                  if (target) {
                    target.blur()
                    setTimeout(() => {
                      if (target) {
                        target.blur()
                      }
                    }, 100)
                  }
                }}
                className="no-touch-active touch-manipulation py-2 font-sans text-2xl text-primary transition-colors hover:text-primary focus:outline-none focus-visible:outline-none xl:active:text-primary"
                onClick={() => setIsMenuOpen(false)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Story
              </Link>
              <Link
                href="/download"
                onTouchEnd={(e) => {
                  const target = e.currentTarget
                  if (target) {
                    target.blur()
                    setTimeout(() => {
                      if (target) {
                        target.blur()
                      }
                    }, 100)
                  }
                }}
                className="no-touch-active touch-manipulation py-2 font-sans text-2xl text-primary transition-colors hover:text-primary focus:outline-none focus-visible:outline-none xl:active:text-primary"
                onClick={() => setIsMenuOpen(false)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Download
              </Link>

              {/* Resources Expandable Section */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={(e) => {
                    setIsMobileAppsOpen(!isMobileAppsOpen)
                    e.currentTarget.blur()
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.blur()
                  }}
                  className="flex touch-manipulation items-center justify-between py-2 font-sans text-2xl text-primary transition-colors hover:text-primary focus:outline-none focus-visible:outline-none xl:active:text-primary"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span>Resources</span>
                  <Icons.ArrowDropDown
                    className={`h-6 w-6 transition-transform duration-200 ${
                      isMobileAppsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileAppsOpen && (
                  <>
                    <div className="my-2 h-px w-full border-t border-border" />
                    <div className="animate-mobile-slide overflow-hidden opacity-0">
                      <div className="flex flex-col space-y-4 pt-2">
                        {headerResourceLinks.map((item) =>
                          item.external ? (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setIsMenuOpen(false)
                                setIsMobileAppsOpen(false)
                              }}
                              className="touch-manipulation text-left font-sans text-lg text-muted-foreground transition-colors hover:text-muted-foreground focus:outline-none focus-visible:outline-none xl:active:text-muted-foreground"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                              {item.title}
                            </a>
                          ) : (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setIsMenuOpen(false)
                                setIsMobileAppsOpen(false)
                              }}
                              className="touch-manipulation text-left font-sans text-lg text-muted-foreground transition-colors hover:text-muted-foreground focus:outline-none focus-visible:outline-none xl:active:text-muted-foreground"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                              {item.title}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sign in */}
              <div className="mt-8 border-t border-border pt-8">
                <Link
                  href={marketingEnv.appUrl}
                  onTouchEnd={(e) => {
                    const target = e.currentTarget
                    if (target) {
                      target.blur()
                      setTimeout(() => {
                        if (target) {
                          target.blur()
                        }
                      }, 100)
                    }
                  }}
                  className="touch-manipulation py-2 font-sans text-2xl text-primary transition-colors hover:text-primary focus:outline-none focus-visible:outline-none xl:active:text-primary"
                  onClick={() => {
                    setIsMenuOpen(false)
                    track({
                      event: LogEvents.CTA.name,
                      channel: LogEvents.CTA.channel,
                      label: "Sign in",
                      position: "header_mobile",
                    })
                  }}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
