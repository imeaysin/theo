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
  readonly logoIcon: "orbit"
}

export const productConfig = {
  name: "Theo",
  shortName: "Theo",
  legalName: "Theo Software, Inc.",
  tagline: "Beautiful screen recordings, owned by you.",
  description:
    "Theo is a lightweight, powerful screen recorder for creating and sharing polished videos.",
  siteUrl: "https://theo.example",
  repositoryUrl: "https://github.com/imeaysin/theo",
  supportEmail: "support@theo.example",
  privacyEmail: "privacy@theo.example",
  analyticsEventName: "theo:analytics",
  logoIcon: "orbit",
} as const satisfies ProductConfig
