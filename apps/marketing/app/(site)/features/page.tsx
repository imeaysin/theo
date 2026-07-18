import type { Metadata } from "next"
import { productConfig } from "@workspace/config/public"
import { FeaturesPage } from "./features-page"

export const metadata: Metadata = {
  title: `Features — ${productConfig.name}`,
  description: productConfig.description,
}

export default function Page() {
  return <FeaturesPage />
}
