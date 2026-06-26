import { StartPage } from "@/components/home/startpage"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${siteConfig.name} — The business stack for modern founders`,
  description: siteConfig.description,
}

export default function Page() {
  return <StartPage />
}
