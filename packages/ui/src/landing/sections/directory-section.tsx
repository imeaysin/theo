"use client"

import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { PageContainer, SectionHeading } from "../layout"
import { LinkCard } from "../link-card"

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
      <PageContainer className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48">
        <SectionHeading
          className="mx-auto max-w-3xl space-y-6"
          eyebrow={eyebrow}
          subtitle={description}
          title={title}
          variant="hero"
        >
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2.5">
              {items.map((item) => (
                <Button
                  key={item.href}
                  className={
                    item.iconClassName ??
                    "text-muted-foreground/40 hover:text-foreground"
                  }
                  render={<a href={item.href} />}
                  size="icon-lg"
                  variant="ghost"
                >
                  {item.icon}
                </Button>
              ))}
            </div>
          </div>
        </SectionHeading>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <LinkCard
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
            </LinkCard>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
