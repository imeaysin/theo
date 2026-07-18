export type AbsolutePublicUrl = `https://${string}`

export interface ProductConfig {
  readonly name: string
  readonly shortName: string
  readonly legalName: string
  readonly tagline: string
  readonly description: string
  readonly siteUrl: AbsolutePublicUrl
  readonly repositoryUrl: AbsolutePublicUrl
  readonly supportEmail: string
  readonly privacyEmail: string
  readonly analyticsEventName: string
  readonly logoIcon: "webhook"
}

export const productConfig = {
  /** Sample product name for this monorepo template — change when forking. */
  name: "Theo",
  shortName: "Theo",
  legalName: "Theo Software, Inc.",
  tagline: "Beautiful product demos, owned by you.",
  description:
    "Theo is a lightweight product template for recording, editing, and sharing polished videos — customize this config for your brand.",
  siteUrl: "https://theo.example",
  repositoryUrl: "https://github.com/imeaysin/theo",
  supportEmail: "support@theo.example",
  privacyEmail: "privacy@theo.example",
  analyticsEventName: "theo:analytics",
  logoIcon: "webhook",
} as const satisfies ProductConfig
