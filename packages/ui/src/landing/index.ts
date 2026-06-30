// Layout — wrap sections and set page width
export { PageContainer, PageSection, SectionHeading } from "./layout"
export type { SectionHeadingProps } from "./layout"

// Page shells — full-page starters
export { FeatureHero } from "./feature-hero"
export type { FeatureHeroProps } from "./feature-hero"
export { LegalPage, PlaceholderPage } from "./legal-page"
export type { LegalBlock, LegalDocument, LegalSection } from "./legal-page"
export { ResourcePageShell } from "./resource-page-shell"

// Chrome
export { FooterWordmark } from "./chrome/footer-wordmark"
export { SiteFooter } from "./chrome/site-footer"
export type { FooterLink, FooterLinkGroup } from "./chrome/site-footer"

// Sections — compose a landing page from these blocks
export { FeaturesGridSection } from "./sections/features-grid-section"
export type { FeatureItem } from "./sections/features-grid-section"
export { IntegrationsSection } from "./sections/integrations-section"
export type { LogoLinkItem } from "./sections/integrations-section"
export { IntegrationsGridSection } from "./sections/integrations-grid-section"
export type {
  CatalogItem,
  FilterTab,
} from "./sections/integrations-grid-section"
export { IntegrationDetailSection } from "./sections/integration-detail-section"
export type { DetailPageProps } from "./sections/integration-detail-section"
export { UpdatesListSection } from "./sections/updates-list-section"
export type { UpdateItem } from "./sections/updates-list-section"
export { FaqSection } from "./sections/faq-section"
export type { FaqItem } from "./sections/faq-section"
export { CtaSection } from "./sections/cta-section"
export type { CtaSectionProps } from "./sections/cta-section"
export { HubSection } from "./sections/hub-section"
export type { HubCardItem, HubSectionProps } from "./sections/hub-section"
export { DirectorySection } from "./sections/directory-section"
export type {
  DirectoryItem,
  DirectorySectionProps,
} from "./sections/directory-section"
export { GuideSection } from "./sections/guide-section"
export type {
  GuideListSection,
  GuidePageData,
  GuideStep,
} from "./sections/guide-section"
