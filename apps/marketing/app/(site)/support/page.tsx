import type { Metadata } from "next"
import { SupportPage } from "@/components/pages/support-page"

export const metadata: Metadata = {
  title: "Support — Theo",
  description:
    "Get help with Theo. Join our Discord community, email support@theo.example, read the docs, or report an issue on GitHub.",
}

export default function App() {
  return <SupportPage />
}
