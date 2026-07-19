"use client"

import { Button, Logo } from "@/components/product-ui"
import MobileMenu from "@/components/ui/mobile-menu"
import {
  featureNavLinks,
  featurePrefetchRoutes,
  resourceNavLinks,
  resourcePrefetchRoutes,
  type NavLink,
} from "@/config/navigation"
import { productConfig } from "@workspace/config/public"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useRef } from "react"

function MegaNavLink({ title, description, href, external }: NavLink) {
  const body = (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm leading-none font-medium text-foreground">
        {title}
      </span>
      <span className="line-clamp-2 text-xs text-muted-foreground">
        {description}
      </span>
    </div>
  )

  if (external) {
    return (
      <li>
        <NavigationMenuLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-start gap-0 rounded-xl px-3 py-3"
        >
          {body}
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <li>
      <NavigationMenuLink
        render={<Link href={href} />}
        className="flex flex-col items-start gap-0 rounded-xl px-3 py-3"
      >
        {body}
      </NavigationMenuLink>
    </li>
  )
}

function PreviewCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <NavigationMenuLink
      render={<Link href={href} />}
      className="flex min-h-[200px] flex-col items-stretch gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 hover:border-foreground/20 hover:bg-background"
    >
      <div className="flex flex-1 items-center justify-center bg-muted/40 p-6">
        <Logo hideLogoName className="size-12 opacity-40" />
      </div>
      <div className="border-t border-border p-3">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </NavigationMenuLink>
  )
}

const triggerClassName = cn(
  navigationMenuTriggerStyle(),
  "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-popup-open:bg-transparent data-popup-open:text-foreground data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:text-foreground data-open:hover:bg-transparent"
)

const topLinkClassName = cn(
  navigationMenuTriggerStyle(),
  "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent"
)

export function Navbar({ stars }: { stars?: string }) {
  const router = useRouter()
  const featuresPrefetched = useRef(false)
  const resourcesPrefetched = useRef(false)

  const prefetchFeatures = useCallback(() => {
    if (featuresPrefetched.current) return
    featuresPrefetched.current = true
    for (const route of featurePrefetchRoutes) router.prefetch(route)
  }, [router])

  const prefetchResources = useCallback(() => {
    if (resourcesPrefetched.current) return
    resourcesPrefetched.current = true
    for (const route of resourcePrefetchRoutes) router.prefetch(route)
  }, [router])

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full">
      <div className="relative flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link
          href="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo className="h-8" />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <NavigationMenu align="center">
            <NavigationMenuList>
              <NavigationMenuItem onMouseEnter={prefetchFeatures}>
                <NavigationMenuTrigger className={triggerClassName}>
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[min(56rem,calc(100vw-2rem))] gap-6 p-4 md:grid-cols-5 md:p-6">
                    <ul className="grid grid-cols-2 gap-1 md:col-span-3">
                      {featureNavLinks.map((item) => (
                        <MegaNavLink key={item.href} {...item} />
                      ))}
                    </ul>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-2">
                      <PreviewCard
                        href="/features"
                        title="Product overview"
                        description="See what you can build and share"
                      />
                      <PreviewCard
                        href="/testimonials"
                        title="Customer stories"
                        description={`How teams use ${productConfig.name}`}
                      />
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/pricing" />}
                  className={topLinkClassName}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/download" />}
                  className={topLinkClassName}
                >
                  Download
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem onMouseEnter={prefetchResources}>
                <NavigationMenuTrigger className={triggerClassName}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[min(56rem,calc(100vw-2rem))] gap-6 p-4 md:grid-cols-5 md:p-6">
                    <ul className="grid grid-cols-2 gap-1 md:col-span-3">
                      {resourceNavLinks.map((item) => (
                        <MegaNavLink
                          key={`${item.href}:${item.title}`}
                          {...item}
                        />
                      ))}
                    </ul>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-2">
                      <PreviewCard
                        href="/download"
                        title="Desktop apps"
                        description="macOS and Windows — download free"
                      />
                      <PreviewCard
                        href="/blog"
                        title="From the blog"
                        description="Guides, updates, and product notes"
                      />
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-2 flex items-center gap-2 border-l border-border pl-4">
            <Button
              variant="ghost"
              icon={<Image src="/github.svg" alt="" width={16} height={16} />}
              target="_blank"
              href={productConfig.repositoryUrl}
              size="sm"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              {stars ? `GitHub ${stars}` : "GitHub"}
            </Button>
            <Button
              variant="ghost"
              href={`${productConfig.siteUrl}/login`}
              size="sm"
              className="font-medium"
            >
              Sign in
            </Button>
            <Button
              variant="dark"
              href={`${productConfig.siteUrl}/signup`}
              size="sm"
              className="font-medium"
            >
              Sign up
            </Button>
          </div>
        </div>

        <div className="lg:hidden">
          <MobileMenu stars={stars} />
        </div>
      </div>
    </nav>
  )
}
