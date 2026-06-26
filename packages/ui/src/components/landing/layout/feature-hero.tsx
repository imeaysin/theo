import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { LandingContainer } from "@workspace/ui/components/landing/layout/page-container"

export interface FeatureHeroProps {
  eyebrow: string
  title: string
  description: string
  mobileDescription?: string
  ctaHref?: string
  ctaLabel?: string
  children?: ReactNode
}

export function FeatureHero({
  eyebrow,
  title,
  description,
  mobileDescription,
  ctaHref,
  ctaLabel = "Start your trial",
  children,
}: FeatureHeroProps) {
  return (
    <div className="relative overflow-hidden bg-background pb-12 pt-24 sm:pt-32 lg:pb-20 lg:pt-40">
      <LandingContainer>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="font-sans text-base leading-relaxed text-muted-foreground lg:hidden">
            {mobileDescription ?? description}
          </p>
          <p className="hidden font-sans text-base leading-relaxed text-muted-foreground lg:block">
            {description}
          </p>
          {ctaHref ? (
            <div className="pt-2">
              <Button
                className="px-6"
                render={<a href={ctaHref} />}
                size="xl"
                variant="inverse"
              >
                {ctaLabel}
              </Button>
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-12 md:mt-16">{children}</div> : null}
      </LandingContainer>
    </div>
  )
}
