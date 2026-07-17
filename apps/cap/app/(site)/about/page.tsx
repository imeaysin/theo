import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/about-page"

export const metadata: Metadata = {
  title: "About — Cap",
  description:
    "Cap is the open source alternative to Loom. Learn why we started Cap and our commitment to privacy, transparency, and community-driven development.",
}

export default function App() {
  return <AboutPage />
}
