"use client"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Icons } from "@workspace/ui/components/icons"
import { PageContainer, SectionHeading } from "../layout"
import { LinkCard } from "../link-card"

export interface HubCardItem {
  id: string
  name: string
  description: string
  href: string
}

export interface HubSectionProps {
  eyebrow: string
  title: string
  description: string
  items: HubCardItem[]
  promptsTitle: string
  promptsSubtitle: string
  prompts: string[]
  featuresTitle: string
  featuresSubtitle: string
  features: string[]
}

function ItemBadge({ name }: { name: string }) {
  return (
    <Avatar className="size-10 rounded-none border border-border bg-secondary text-xs font-medium text-foreground">
      <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

function ItemGrid({
  items,
  className,
}: {
  items: HubSectionProps["items"]
  className?: string
}) {
  return (
    <div className={className}>
      {items.map((item) => (
        <LinkCard
          key={item.id}
          className="group"
          href={item.href}
          panelClassName="flex flex-col items-start p-4 sm:p-5"
        >
          <div className="mb-2 sm:mb-3">
            <ItemBadge name={item.name} />
          </div>
          <h3 className="mb-0.5 text-xs font-medium text-foreground sm:mb-1 sm:text-sm">
            {item.name}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground sm:text-xs">
            {item.description}
          </p>
        </LinkCard>
      ))}
    </div>
  )
}

export function HubSection({
  eyebrow,
  title,
  description,
  items,
  promptsTitle,
  promptsSubtitle,
  prompts,
  featuresTitle,
  featuresSubtitle,
  features,
}: HubSectionProps) {
  const highlightedIndices = new Set([0, 2, 6, 9, 12])

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-visible bg-background lg:min-h-screen lg:overflow-hidden">
        <div className="landing-grid-bg pointer-events-none absolute inset-0 z-0 hidden opacity-20 lg:block" />

        <div className="relative flex flex-col overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 lg:hidden">
          <div className="z-20 flex flex-col items-center justify-start px-4 sm:px-6">
            <SectionHeading
              className="w-full max-w-xl"
              eyebrow={eyebrow}
              subtitle={description}
              title={title}
              variant="hero"
            />
            <ItemGrid
              className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5"
              items={items}
            />
          </div>
        </div>

        <div className="relative hidden min-h-screen flex-col overflow-hidden pt-40 lg:flex">
          <div className="z-20 flex flex-1 flex-col items-center justify-center px-4 pb-32">
            <SectionHeading
              className="mb-16 w-full"
              eyebrow={eyebrow}
              subtitle={description}
              title={title}
              titleClassName="text-6xl xl:text-7xl 2xl:text-8xl"
              variant="hero"
            />
            <ItemGrid
              className="grid max-w-5xl grid-cols-5 gap-5"
              items={items}
            />
          </div>
        </div>
      </div>

      <section className="bg-background py-12 sm:py-16 lg:py-24">
        <PageContainer>
          <SectionHeading subtitle={promptsSubtitle} title={promptsTitle} />
          <div className="relative mx-auto max-w-5xl">
            <div className="relative z-0 flex flex-wrap justify-center gap-x-1.5 gap-y-1.5 sm:gap-x-2 sm:gap-y-2">
              {prompts.map((prompt, index) => {
                const visibilityClass =
                  index >= 12
                    ? "hidden lg:block"
                    : index >= 8
                      ? "hidden md:block"
                      : ""

                return (
                  <Badge
                    key={prompt}
                    className={`rounded-tl-full rounded-tr-full rounded-bl-full px-3 py-1.5 text-xs whitespace-nowrap sm:text-sm ${visibilityClass} ${
                      highlightedIndices.has(index)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    variant="secondary"
                  >
                    &ldquo;{prompt}&rdquo;
                  </Badge>
                )
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-background py-12 sm:py-16 lg:py-24">
        <PageContainer>
          <SectionHeading subtitle={featuresSubtitle} title={featuresTitle} />
          <ul className="mx-auto max-w-3xl space-y-3">
            {features.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <Icons.Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>
    </div>
  )
}
