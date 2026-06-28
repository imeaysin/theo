"use client"

import { Icons } from "@workspace/ui/components/icons"
import { LandingContainer } from "../layout/page-container"
import { SectionHeading } from "../layout/section-heading"

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
    <div className="flex size-10 items-center justify-center border border-border bg-secondary font-sans text-xs font-medium text-foreground">
      {name.slice(0, 2).toUpperCase()}
    </div>
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
        <a
          key={item.id}
          href={item.href}
          className="group flex flex-col items-start border border-border bg-background p-4 transition-all duration-200 hover:border-foreground/20 sm:p-5"
        >
          <div className="mb-2 sm:mb-3">
            <ItemBadge name={item.name} />
          </div>
          <h3 className="mb-0.5 font-sans text-xs font-medium text-foreground sm:mb-1 sm:text-sm">
            {item.name}
          </h3>
          <p className="line-clamp-2 font-sans text-[10px] text-muted-foreground sm:text-xs">
            {item.description}
          </p>
        </a>
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
        <div className="pointer-events-none absolute inset-0 z-0 hidden bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 lg:block" />

        <div className="relative flex flex-col overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 lg:hidden">
          <div className="z-20 flex flex-col items-center justify-start px-4 sm:px-6">
            <div className="w-full max-w-xl space-y-4 text-center">
              <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
                {eyebrow}
              </p>
              <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="mx-auto text-center font-sans text-base leading-normal text-muted-foreground">
                {description}
              </p>
            </div>
            <ItemGrid
              className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5"
              items={items}
            />
          </div>
        </div>

        <div className="relative hidden min-h-screen flex-col overflow-hidden pt-40 lg:flex">
          <div className="z-20 flex flex-1 flex-col items-center justify-center px-4 pb-32">
            <div className="mb-16 w-full space-y-4 text-center">
              <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
                {eyebrow}
              </p>
              <h1 className="font-serif text-6xl leading-tight text-foreground xl:text-7xl 2xl:text-8xl">
                {title}
              </h1>
              <p className="mx-auto max-w-2xl text-center font-sans text-sm leading-normal text-muted-foreground xl:text-base">
                {description}
              </p>
            </div>
            <ItemGrid
              className="grid max-w-5xl grid-cols-5 gap-5"
              items={items}
            />
          </div>
        </div>
      </div>

      <section className="bg-background py-12 sm:py-16 lg:py-24">
        <LandingContainer>
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
                  <div
                    key={prompt}
                    className={`rounded-tl-full rounded-tr-full rounded-bl-full bg-secondary px-3 py-1.5 ${visibilityClass}`}
                  >
                    <p
                      className={`font-sans text-xs whitespace-nowrap sm:text-sm ${
                        highlightedIndices.has(index)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      &ldquo;{prompt}&rdquo;
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </LandingContainer>
      </section>

      <section className="bg-background py-12 sm:py-16 lg:py-24">
        <LandingContainer>
          <SectionHeading subtitle={featuresSubtitle} title={featuresTitle} />
          <ul className="mx-auto max-w-3xl space-y-3">
            {features.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-sans text-sm text-muted-foreground"
              >
                <Icons.Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </LandingContainer>
      </section>
    </div>
  )
}
