"use client"

import { Icons } from "@workspace/ui/components/icons"
import { SiteFooter } from "@workspace/ui/components/landing"
import type { FooterLinkGroup } from "@workspace/ui/components/landing"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { useIsClient } from "@workspace/ui/hooks/use-is-client"
import { footerNavigation, socialLinks } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import Image from "next/image"

const footerLinkGroups: FooterLinkGroup[] = [
  { title: "Features", links: [...footerNavigation.features] },
  { title: "Product", links: [...footerNavigation.product] },
  {
    title: "Company",
    links: [
      ...footerNavigation.company.map(({ href, label }) => ({ href, label })),
      { href: socialLinks.twitter, label: "X / Twitter", external: true },
      { href: socialLinks.linkedin, label: "LinkedIn", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      ...footerNavigation.resources.map(({ href, label }) => ({ href, label })),
      { href: socialLinks.api, label: "API", external: true },
    ],
  },
]

export function Footer() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useIsClient()

  return (
    <SiteFooter
      copyright={`© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`}
      linkGroups={footerLinkGroups}
      status={{
        href: socialLinks.status,
        label: "System status:",
        value: "Operational",
      }}
      tagline={siteConfig.tagline}
      wordmark={siteConfig.name.toLowerCase()}
      sidebar={
        <>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9">
                <Image
                  alt="GDPR Compliant"
                  className="h-full w-full object-contain"
                  height={36}
                  src="/images/gdpr.png"
                  width={36}
                />
              </div>
              <div className="text-center">
                <p className="font-sans text-xs text-foreground">GDPR</p>
                <p className="font-sans text-xs text-muted-foreground">
                  Compliant
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9">
                <Image
                  alt="SOC2 In Progress"
                  className="h-full w-full object-contain"
                  height={36}
                  src="/images/soc2.png"
                  width={36}
                />
              </div>
              <div className="text-center">
                <p className="font-sans text-xs text-foreground">Soc2</p>
                <p className="font-sans text-xs text-muted-foreground">
                  In progress
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center gap-2 border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Icons.LightMode className="h-4 w-4" />
              ) : (
                <Icons.DarkMode className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
            <span className="font-sans text-sm">
              {mounted
                ? resolvedTheme === "dark"
                  ? "Light mode"
                  : "Dark mode"
                : "Toggle theme"}
            </span>
          </button>
        </>
      }
    />
  )
}
