import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/about-page"
import { productConfig } from "@workspace/config/public"

export const metadata: Metadata = {
  title: `About — ${productConfig.name}`,
  description: `Learn why we built ${productConfig.name} and our commitment to privacy, transparency, and community-driven development.`,
}

export default function App() {
  return <AboutPage />
}
