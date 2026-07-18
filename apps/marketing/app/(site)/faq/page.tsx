import type { Metadata } from "next"
import { FaqPage } from "@/components/pages/faq-page"

export const metadata: Metadata = {
  title: "FAQ — Theo",
}

export default function App() {
  return <FaqPage />
}
