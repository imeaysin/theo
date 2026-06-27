"use client"

import type { ReactNode } from "react"
import { Icons } from "@workspace/ui/components/icons"
import { LandingContainer } from "@workspace/ui/components/landing/layout/page-container"

interface ChatPlatformLink {
  href: string
  label: string
  icon: ReactNode
  iconClassName?: string
}

interface ChatHubSectionProps {
  productName: string
  platforms: ChatPlatformLink[]
}

export function ChatHubSection({ productName, platforms }: ChatHubSectionProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingContainer className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
            Chat
          </p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Run your business from iMessage, WhatsApp, Slack &amp; Telegram
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            Get invoices paid, track time, manage expenses — right from the
            messaging apps you already use with {productName}.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2.5">
              {platforms.map((platform) => (
                <a
                  key={platform.href}
                  href={platform.href}
                  className={`text-muted-foreground opacity-40 transition-all duration-200 hover:opacity-100 ${platform.iconClassName ?? "hover:text-foreground"}`}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {platforms.map((platform) => (
            <a
              key={platform.href}
              href={platform.href}
              className="group flex items-center gap-4 border border-border bg-background p-6 transition-colors hover:border-foreground/20 hover:bg-secondary/50"
            >
              <div className="flex size-12 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
                {platform.icon}
              </div>
              <div className="text-left">
                <h2 className="font-sans text-base text-foreground">
                  {platform.label}
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Set up {platform.label} with {productName}
                </p>
              </div>
            </a>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
