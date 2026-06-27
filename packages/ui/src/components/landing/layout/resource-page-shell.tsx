"use client"

import type { ReactNode } from "react"
import type { LandingFaqItem } from "@workspace/ui/components/landing/types"
import { CtaSection } from "@workspace/ui/components/landing/sections/cta-section"
import { FaqSection } from "@workspace/ui/components/landing/sections/faq-section"
import { PlaceholderPage } from "@workspace/ui/components/landing/layout/legal-page"

interface ResourcePageShellProps {
  title: string
  description: string
  ctaTitle: string
  ctaHref: string
  ctaLabel?: string
  ctaDescription?: string
  faqItems?: LandingFaqItem[]
  action?: ReactNode
  variant?: "default" | "story"
  children?: ReactNode
}

export function ResourcePageShell({
  title,
  description,
  ctaTitle,
  ctaHref,
  ctaLabel = "Start your trial",
  ctaDescription,
  faqItems,
  action,
  variant = "default",
  children,
}: ResourcePageShellProps) {
  return (
    <>
      <PlaceholderPage
        action={action}
        description={description}
        title={title}
        variant={variant}
      />
      {children}
      {faqItems?.length ? <FaqSection items={faqItems} /> : null}
      <CtaSection
        description={ctaDescription}
        href={ctaHref}
        label={ctaLabel}
        title={ctaTitle}
      />
    </>
  )
}
