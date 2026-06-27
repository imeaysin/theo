import type { ReactNode } from "react"
import type { IconMap } from "@workspace/ui/components/material-icon"

export type MaterialIconName = keyof typeof IconMap

export interface LandingFeatureItem {
  href: string
  icon: MaterialIconName
  title: string
  description: string
  className?: string
}

export interface LandingIntegrationItem {
  id: string
  name: string
  slug: string
  logoUrl?: string
}

export interface LandingFaqItem {
  question: string
  answer: string
}

export interface LandingTestimonial {
  name: string
  title: string
  company: string
  country: string
  image?: string
  video?: string
  content: string
  fullContent?: string
}

export interface LandingTimeSavingsCard {
  label: string
  value: string
  description: string
  href?: string
  hiddenOnMobile?: boolean
  hiddenOnDesktop?: boolean
  colSpan?: string
}

export interface LandingChecklistItem {
  mobile: string
  desktop: string
}

export interface FooterLink {
  href: string
  label: string
  external?: boolean
}

export interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subsection"; title: string; blocks: LegalBlock[] }
  | { type: "email"; address: string }

export interface LegalSection {
  title: string
  blocks?: LegalBlock[]
  content?: string
  paragraphs?: string[]
  subsections?: {
    title?: string
    content: string
  }[]
}

export interface LegalDocument {
  title: string
  lastUpdated: string
  intro?: string[]
  sections: LegalSection[]
}

export interface LandingCtaProps {
  title: string
  description?: string
  href: string
  label: string
  onClick?: () => void
}

export interface LandingSectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  children?: ReactNode
  variant?: "section" | "page"
}
