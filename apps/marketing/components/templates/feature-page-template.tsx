"use client"

import type { FeaturePageConfig } from "@/data/feature-pages"
import { defaultFeatureGridItems } from "@/data/feature-pages"
import { defaultFaqItems } from "@/data/faq"
import { marketingEnv } from "@/config/env"
import { landingIntegrations } from "@/data/apps"
import { PreAccountingSection } from "@/components/sections/pre-accounting-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { TimeSavingsSection } from "@/components/sections/time-savings-section"
import {
  CtaSection,
  FaqSection,
  FeatureHero,
  FeaturesGridSection,
  IntegrationsSection,
} from "@workspace/ui/components/landing"

interface FeaturePageTemplateProps {
  page: FeaturePageConfig
}

export function FeaturePageTemplate({ page }: FeaturePageTemplateProps) {
  return (
    <>
      <FeatureHero
        ctaHref={marketingEnv.appUrl}
        ctaLabel="Start your trial"
        description={page.description}
        eyebrow={page.eyebrow}
        mobileDescription={page.mobileDescription}
        title={page.title}
      />
      <FeaturesGridSection features={defaultFeatureGridItems} />
      <TimeSavingsSection />
      <PreAccountingSection />
      <TestimonialsSection title="Founders on Theo" />
      <IntegrationsSection apps={landingIntegrations} />
      <FaqSection items={defaultFaqItems} />
      <CtaSection
        description="Join founders who run their company on Theo."
        href={marketingEnv.appUrl}
        label="Start your trial"
        title="Ready to get started?"
      />
    </>
  )
}
