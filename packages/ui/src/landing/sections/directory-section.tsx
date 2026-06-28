"use client"

import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { LandingContainer } from "../layout/page-container"
import { LandingLinkCard } from "../primitives/landing-link-card"
import { LandingPageHero } from "../primitives/landing-page-hero"

export interface DirectoryItem {
  href: string
  label: string
  description?: string
  icon: ReactNode
  iconClassName?: string
}

export interface DirectorySectionProps {
  eyebrow: string
  title: string
  description: string
  items: DirectoryItem[]
}

export function DirectorySection({
  eyebrow,
  title,
  description,
  items,
}: DirectorySectionProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingContainer className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48">
        <LandingPageHero
          className="mx-auto max-w-3xl space-y-6"
          description={description}
          eyebrow={eyebrow}
          title={title}
        >
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2.5">
              {items.map((item) => (
                <Button
                  key={item.href}
                  className={item.iconClassName ?? "text-muted-foreground/40 hover:text-foreground"}
                  render={<a href={item.href} />}
                  size="icon-lg"
                  variant="ghost"
                >
                  {item.icon}
                </Button>
              ))}
            </div>
          </div>
        </LandingPageHero>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <LandingLinkCard
              key={item.href}
              className="group"
              href={item.href}
              panelClassName="flex items-center gap-4 p-6"
            >
              <div className="flex size-12 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
                {item.icon}
              </div>
              <div className="text-left">
                <h2 className="text-base text-foreground">{item.label}</h2>
                {item.description ? (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </LandingLinkCard>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
