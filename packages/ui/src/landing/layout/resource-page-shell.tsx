"use client"

import type { ReactNode } from "react"
import type { FaqItem } from "../sections/faq-section"
import { CtaSection } from "../sections/cta-section"
import { FaqSection } from "../sections/faq-section"
import { PlaceholderPage } from "./legal-page"

interface ResourcePageShellProps {
  title: string
  description: string
  ctaTitle: string
  ctaHref: string
  ctaLabel?: string
  ctaDescription?: string
  faqItems?: FaqItem[]
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
