import type { Metadata } from "next"
import { DownloadPage } from "@/components/pages/download-page"

export const metadata: Metadata = {
  title: "Download — Theo",
}

export default function App() {
  return <DownloadPage />
}
