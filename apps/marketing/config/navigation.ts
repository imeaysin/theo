import { productConfig } from "@workspace/config/public"

export type NavLink = {
  title: string
  description: string
  href: string
  external?: boolean
}

/** Features mega-menu columns */
export const featureNavLinks: NavLink[] = [
  {
    title: "Overview",
    description: "Everything included in the product",
    href: "/features",
  },
  {
    title: "Download",
    description: "Get the desktop apps",
    href: "/download",
  },
  {
    title: "Pricing",
    description: "Simple plans that scale with you",
    href: "/pricing",
  },
  {
    title: "Migrate",
    description: "Bring your library from another tool",
    href: "/migrate",
  },
]

/** Resources mega-menu columns */
export const resourceNavLinks: NavLink[] = [
  {
    title: "Blog",
    description: "Updates, guides, and product notes",
    href: "/blog",
  },
  {
    title: "About",
    description: `Why we built ${productConfig.name}`,
    href: "/about",
  },
  {
    title: "Testimonials",
    description: "What teams are saying",
    href: "/testimonials",
  },
  {
    title: "Support",
    description: "Get help when you need it",
    href: "/support",
  },
  {
    title: "FAQ",
    description: "Common questions answered",
    href: "/faq",
  },
  {
    title: "GitHub",
    description: "Open source on GitHub",
    href: productConfig.repositoryUrl,
    external: true,
  },
]

export const featurePrefetchRoutes = featureNavLinks.map((l) => l.href)
export const resourcePrefetchRoutes = resourceNavLinks
  .filter((l) => !l.external)
  .map((l) => l.href)
