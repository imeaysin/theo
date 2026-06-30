"use client"

import {
  MaterialIcon,
  type MaterialIconName,
} from "@workspace/ui/components/material-icon"
import { PageContainer, PageSection, SectionHeading } from "../layout"
import { cn } from "@workspace/ui/lib/utils"

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

function FeatureTile({
  href,
  icon,
  title,
  description,
  className,
}: FeatureItem) {
  return (
    <a
      className={cn(
        "flex w-full touch-manipulation flex-col items-center sm:w-[150px]",
        className
      )}
      href={href}
    >
      <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-none border border-border bg-secondary transition-all duration-200 hover:border-muted-foreground">
        <MaterialIcon className="text-muted-foreground" name={icon} size={24} />
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm leading-[21px] text-foreground">{title}</h3>
        <p className="text-sm leading-[21px] text-muted-foreground">
          {description}
        </p>
      </div>
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
    <PageSection id="features">
      <PageContainer>
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="mx-auto flex max-w-sm flex-col gap-8 sm:max-w-none sm:gap-10">
          <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
            {firstRow.map((feature) => (
              <FeatureTile key={feature.href} {...feature} />
            ))}
          </div>
          {secondRow.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
              {secondRow.map((feature) => (
                <FeatureTile key={feature.href} {...feature} />
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </PageSection>
  )
}
