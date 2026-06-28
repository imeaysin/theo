import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { LandingPageHero } from "../primitives/landing-page-hero"

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
  const cta = ctaHref ? (
    <div className="pt-2">
      <Button render={<a href={ctaHref} />} size="xl" variant="default">
        {ctaLabel}
      </Button>
    </div>
  ) : null

  return (
    <div className="relative overflow-visible bg-background lg:min-h-screen lg:overflow-hidden">
      <div className="relative flex flex-col overflow-hidden pt-32 pb-8 sm:pt-40 sm:pb-8 md:pt-48 lg:hidden">
        <div className="z-20 flex flex-col items-center justify-start space-y-6 px-3 sm:px-4">
          <LandingPageHero
            className="w-full max-w-xl px-2"
            description={mobileDescription ?? description}
            eyebrow={eyebrow}
            title={title}
            titleClassName="text-4xl sm:text-4xl md:text-5xl"
          >
            {cta}
          </LandingPageHero>
          {children ? <div className="w-full">{children}</div> : null}
        </div>
      </div>

      <div className="relative hidden min-h-screen flex-col overflow-hidden pt-40 lg:flex">
        <div className="z-20 flex flex-1 flex-col items-center justify-start space-y-12 px-4 pt-16">
          <LandingPageHero
            className="3xl:space-y-12 w-full space-y-8 2xl:space-y-12"
            description={description}
            eyebrow={eyebrow}
            title={title}
            titleClassName="text-8xl xl:text-9xl 2xl:text-9xl"
          >
            {cta}
          </LandingPageHero>
          {children ? <div className="w-full">{children}</div> : null}
        </div>
      </div>
    </div>
  )
}
