"use client"

import { LandingContainer, LandingSection } from "../layout/page-container"
import { LandingFeatureTile } from "../primitives/landing-tiles"
import { SectionHeading } from "../layout/section-heading"
import type { MaterialIconName } from "@workspace/ui/components/material-icon"

export interface FeatureItem {
  href: string
  icon: MaterialIconName
  title: string
  description: string
  className?: string
}

interface FeaturesGridSectionProps {
  title?: string
  subtitle?: string
  features: FeatureItem[]
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
              <LandingFeatureTile
                key={feature.href}
                className={feature.className}
                description={feature.description}
                href={feature.href}
                icon={feature.icon}
                title={feature.title}
              />
            ))}
          </div>
          {secondRow.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
              {secondRow.map((feature) => (
                <LandingFeatureTile
                  key={feature.href}
                  className={feature.className}
                  description={feature.description}
                  href={feature.href}
                  icon={feature.icon}
                  title={feature.title}
                />
              ))}
            </div>
          ) : null}
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
