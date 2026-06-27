"use client"

import type { ReactNode } from "react"
import type {
  FooterLink,
  FooterLinkGroup,
} from "@workspace/ui/components/landing/types"
import { FooterWordmark } from "@workspace/ui/components/landing/chrome/footer-wordmark"
import { cn } from "@workspace/ui/lib/utils"

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
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className="block font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {link.label}
    </a>
  )
}

function StatusIndicator({
  status,
}: {
  status: FooterLink & { value: string }
}) {
  return (
    <a
      href={status.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <span className="font-sans text-sm text-muted-foreground">
        {status.label}
      </span>
      <span className="font-sans text-sm text-foreground">{status.value}</span>
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        <span className="relative z-10 block h-2 w-2 rounded-full bg-green-500" />
        <span
          className="absolute inset-0 rounded-full bg-green-500"
          style={{
            animation: "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </span>
    </a>
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
      <div className="h-px w-full border-t border-border" />

      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:pb-80">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 md:grid-cols-5 lg:col-span-1">
            {linkGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="mb-4 font-sans text-sm text-foreground">
                  {group.title}
                </h3>
                <div className="space-y-2.5">
                  {group.links.map((link) => (
                    <FooterLinkItem key={link.href + link.label} link={link} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:gap-10">
            <p className="text-left font-sans text-base text-foreground sm:text-xl lg:text-right">
              {tagline}
            </p>
            {sidebar}
          </div>
        </div>

        <div className="my-12 border-t border-border sm:my-16" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {status ? (
            <div className="hidden sm:block">
              <StatusIndicator status={status} />
            </div>
          ) : null}
          <p className="font-sans text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>

      <FooterWordmark text={wordmark} />
    </footer>
  )
}
