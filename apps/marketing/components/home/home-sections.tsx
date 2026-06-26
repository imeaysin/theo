"use client"

import { FeaturesGridSection, IntegrationsSection } from "@workspace/ui/components/landing"
import { landingIntegrations } from "@/data/apps"
import { defaultFeatureGridItems } from "@/data/feature-pages"

export function HomeFeaturesGridSection() {
  return <FeaturesGridSection features={defaultFeatureGridItems} />
}

export function HomeIntegrationsSection() {
  return <IntegrationsSection apps={landingIntegrations} />
}
