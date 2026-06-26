"use client"

import {
  LandingContainer,
  LandingSection,
} from "@workspace/ui/components/landing/layout/page-container"
import { SectionHeading } from "@workspace/ui/components/landing/layout/section-heading"
import type { LandingFeatureItem } from "@workspace/ui/components/landing/types"
import { MaterialIcon } from "@workspace/ui/components/material-icon"
import { cn } from "@workspace/ui/lib/utils"

interface FeaturesGridSectionProps {
  title?: string
  subtitle?: string
  features: LandingFeatureItem[]
}

function FeatureTile({ feature }: { feature: LandingFeatureItem }) {
  const content = (
    <>
      <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-none border border-border bg-secondary transition-all duration-200 hover:border-muted-foreground">
        <MaterialIcon
          name={feature.icon}
          className="text-muted-foreground"
          size={24}
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="font-sans text-sm leading-[21px] text-foreground">
          {feature.title}
        </h3>
        <p className="font-sans text-sm leading-[21px] text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </>
  )

  return (
    <a
      href={feature.href}
      className={cn(
        "flex w-full touch-manipulation flex-col items-center sm:w-[150px]",
        feature.className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {content}
    </a>
  )
}

export function FeaturesGridSection({
  title = "Everything you need to run your business",
  subtitle = "Invoicing, transactions, time tracking, customers, and files — all connected in one system.",
  features,
}: FeaturesGridSectionProps) {
  const midpoint = Math.ceil(features.length / 2)
  const firstRow = features.slice(0, midpoint)
  const secondRow = features.slice(midpoint)

  return (
    <LandingSection id="features">
      <LandingContainer>
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="mx-auto flex max-w-sm flex-col gap-8 sm:max-w-none sm:gap-10">
          <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
            {firstRow.map((feature) => (
              <FeatureTile key={feature.href} feature={feature} />
            ))}
          </div>
          {secondRow.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
              {secondRow.map((feature) => (
                <FeatureTile key={feature.href} feature={feature} />
              ))}
            </div>
          ) : null}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
