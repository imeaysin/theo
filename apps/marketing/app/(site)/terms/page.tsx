import type { Metadata } from "next"
import { TermsPage } from "@/components/pages/terms-page"

export const metadata: Metadata = {
  title: "Terms of Service — Theo",
}

export default function App() {
  return <TermsPage />
}
