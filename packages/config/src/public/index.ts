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
  tagline: "Full-stack monorepo template.",
  description:
    "Theo is an open-source monorepo template — NestJS API, Vite web app, Next.js marketing site, Expo mobile, and shared packages. Fork it and ship your product.",
  siteUrl: "https://theo.example",
  repositoryUrl: "https://github.com/imeaysin/theo",
  supportEmail: "support@theo.example",
  privacyEmail: "privacy@theo.example",
  analyticsEventName: "theo:analytics",
  logoIcon: "webhook",
} as const satisfies ProductConfig
