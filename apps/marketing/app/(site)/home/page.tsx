import { productConfig } from "@workspace/config/public"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${productConfig.siteUrl}/`,
  },
}

export default function HomeAliasPage() {
  redirect("/")
}
