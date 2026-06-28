"use client"

import type { ReactNode } from "react"
import { Separator } from "@workspace/ui/components/separator"
import { FooterWordmark } from "./footer-wordmark"
import { LandingContainer } from "../layout/page-container"
import { LandingLink } from "../primitives/landing-link"
import { cn } from "@workspace/ui/lib/utils"

export interface FooterLink {
  href: string
  label: string
  external?: boolean
}

export interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

interface SiteFooterProps {
  linkGroups: FooterLinkGroup[]
  tagline: string
  wordmark: string
  copyright: string
  status?: FooterLink & { value: string }
  sidebar?: ReactNode
  className?: string
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <LandingLink
      className="h-auto justify-start p-0 text-sm text-muted-foreground hover:text-foreground"
      external={link.external}
      href={link.href}
      size="sm"
      variant="link"
    >
      {link.label}
    </LandingLink>
  )
}

function StatusIndicator({
  status,
}: {
  status: FooterLink & { value: string }
}) {
  return (
    <LandingLink
      className="inline-flex h-auto items-center gap-2 p-0 no-underline hover:opacity-80 hover:no-underline"
      external
      href={status.href}
      variant="ghost"
    >
      <span className="text-sm text-muted-foreground">{status.label}</span>
      <span className="text-sm text-foreground">{status.value}</span>
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        <span className="relative z-10 block size-2 rounded-full bg-success" />
        <span className="absolute inset-0 animate-pulse-glow rounded-full bg-success" />
      </span>
    </LandingLink>
  )
}

export function SiteFooter({
  linkGroups,
  tagline,
  wordmark,
  copyright,
  status,
  sidebar,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn("relative overflow-hidden bg-background", className)}>
      <Separator />

      <LandingContainer className="py-16 sm:pb-80">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 md:grid-cols-5 lg:col-span-1">
            {linkGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="mb-4 text-sm text-foreground">{group.title}</h3>
                <div className="space-y-2.5">
                  {group.links.map((link) => (
                    <FooterLinkItem key={link.href + link.label} link={link} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:gap-10">
            <p className="text-left text-base text-foreground sm:text-xl lg:text-right">
              {tagline}
            </p>
            {sidebar}
          </div>
        </div>

        <Separator className="my-12 sm:my-16" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {status ? (
            <div className="hidden sm:block">
              <StatusIndicator status={status} />
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">{copyright}</p>
        </div>
      </LandingContainer>

      <FooterWordmark text={wordmark} />
    </footer>
  )
}
