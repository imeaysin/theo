import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"

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
          <div className="w-full max-w-xl space-y-4 px-2 text-center">
            <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto text-center font-sans text-base leading-normal text-muted-foreground">
              {mobileDescription ?? description}
            </p>
            {cta}
          </div>
          {children ? <div className="w-full">{children}</div> : null}
        </div>
      </div>

      <div className="relative hidden min-h-screen flex-col overflow-hidden pt-40 lg:flex">
        <div className="z-20 flex flex-1 flex-col items-center justify-start space-y-12 px-4 pt-16">
          <div className="3xl:space-y-12 w-full space-y-8 text-center 2xl:space-y-12">
            <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h1 className="text-center font-serif text-8xl leading-tight text-foreground xl:text-9xl 2xl:text-[11rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-center font-sans text-base leading-normal text-muted-foreground">
              {description}
            </p>
            {cta}
          </div>
          {children ? <div className="w-full">{children}</div> : null}
        </div>
      </div>
    </div>
  )
}
