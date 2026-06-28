"use client"

import type { ReactNode } from "react"
import { LandingContainer } from "../layout/page-container"

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
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2.5">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-muted-foreground opacity-40 transition-all duration-200 hover:opacity-100 ${item.iconClassName ?? "hover:text-foreground"}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 border border-border bg-background p-6 transition-colors hover:border-foreground/20 hover:bg-secondary/50"
            >
              <div className="flex size-12 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
                {item.icon}
              </div>
              <div className="text-left">
                <h2 className="font-sans text-base text-foreground">
                  {item.label}
                </h2>
                {item.description ? (
                  <p className="font-sans text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
