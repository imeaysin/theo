"use client"

import { Button } from "@/components/product-ui"
import clsx from "clsx"
import { memo } from "react"
import { WhenVisible } from "@/components/ui/when-visible"
import { Fit, Layout, useRive } from "@/lib/rive"
import { homeContent } from "@/content/home"

type FeatureArt = {
  artboard: string
  className: string
}

type Feature = {
  title: string
  description: string
  art: FeatureArt
  relative?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

const BentoRive = memo(({ artboard }: { artboard: string }) => {
  const { RiveComponent } = useRive({
    src: "/rive/bento.riv",
    artboard,
    animations: ["in"],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
    }),
  })

  return <RiveComponent className="h-full w-full" />
})
BentoRive.displayName = "BentoRive"

const BentoArt = ({ artboard, className }: FeatureArt) => (
  <WhenVisible className={className}>
    <BentoRive artboard={artboard} />
  </WhenVisible>
)

const featureArt: FeatureArt[] = [
  {
    artboard: "storageoptions",
    className: "w-full max-w-[350px] mx-auto h-[275px]",
  },
  {
    artboard: "privacyfirst",
    className: "w-full max-w-[560px] mx-auto h-[250px]",
  },
  { artboard: "collab", className: "w-full max-w-[500px] mx-auto h-[280px]" },
  {
    artboard: "platformsupport",
    className: "w-full max-w-[500px] mx-auto h-[280px]",
  },
  {
    artboard: "videocapture",
    className: "w-full max-w-[420px] mx-auto h-[244px]",
  },
  { artboard: "everyone", className: "w-full max-w-[600px] mx-auto h-[300px]" },
  // Rive binary artboard name is Cap-era; do not rename or animation breaks.
  { artboard: "capai", className: "w-full max-w-[550px] mx-auto h-[300px]" },
]

const features: Feature[] = homeContent.features.features.map(
  (feature, index) => {
    const relatives = [
      { top: 25 },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]

    return {
      title: feature.title,
      description: feature.description,
      art: featureArt[index] ?? { artboard: "", className: "" },
      relative: relatives[index],
    }
  }
)

const Features = () => {
  return (
    <div className="mx-auto max-w-6xl px-5 text-center">
      <p className="mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Features
      </p>
      <h2 className="mb-3 text-3xl font-medium tracking-tight text-balance text-foreground md:text-4xl">
        {homeContent.features.title}
      </h2>
      <p className="mx-auto w-full max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {homeContent.features.subtitle}
      </p>
      <div className="mt-12 flex flex-col gap-3 md:mt-14 md:gap-4">
        <div className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {features.slice(3, 5).map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              className="min-w-full flex-1"
              description={feature.description}
              art={feature.art}
              relative={feature.relative}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {features.slice(0, 3).map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              art={feature.art}
              relative={feature.relative}
            />
          ))}
        </div>

        <div className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {features.slice(5, 7).map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              art={feature.art}
              relative={feature.relative}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <Button
          href="/features"
          variant="outline"
          size="lg"
          className="inline-flex font-medium"
        >
          View all features
        </Button>
      </div>
    </div>
  )
}

const FeatureCard = ({
  title,
  description,
  art,
  relative,
  className,
}: {
  title: string
  description: string
  art?: FeatureArt
  className?: string
  relative?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-evenly gap-8 rounded-2xl border border-border/80 bg-card/60 p-6 text-left md:gap-10 md:p-8",
        className
      )}
    >
      <div
        style={{
          top: relative?.top,
          bottom: relative?.bottom,
          left: relative?.left,
          right: relative?.right,
        }}
        className="relative flex-1 grow content-center justify-center"
      >
        {art ? (
          <BentoArt artboard={art.artboard} className={art.className} />
        ) : null}
      </div>
      <div className="flex h-fit flex-col justify-end gap-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default Features
