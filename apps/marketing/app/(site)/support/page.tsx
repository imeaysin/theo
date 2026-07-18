import type { Metadata } from "next"
import { productConfig } from "@workspace/config/public"
import { SupportPage } from "@/components/pages/support-page"

export const metadata: Metadata = {
  title: `Support — ${productConfig.name}`,
  description: `Get help with ${productConfig.name}. Join Discord, email ${productConfig.supportEmail}, or report an issue on GitHub.`,
}

export default function App() {
  return <SupportPage />
}
