import type { Metadata } from "next"
import { FaqPage } from "@/components/pages/faq-page"

export const metadata: Metadata = {
  title: "FAQ — Cap",
}

export default function App() {
  return <FaqPage />
}
