import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/about-page"

export const metadata: Metadata = {
  title: "About — Theo",
  description:
    "Theo is the open source alternative to Loom. Learn why we started Theo and our commitment to privacy, transparency, and community-driven development.",
}

export default function App() {
  return <AboutPage />
}
