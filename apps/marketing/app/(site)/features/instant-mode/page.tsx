import type { Metadata } from "next"
import { InstantModePage } from "./instant-mode-page"

export const metadata: Metadata = {
  title: "Instant Mode - Quick Screen Recording & Sharing | Theo",
  description:
    "Record and share instantly with Theo's cloud-powered Instant Mode. Get automatic transcriptions, collaborative comments, shareable links, and team workspaces for fast feedback loops.",
  openGraph: {
    title: "Instant Mode - Quick Screen Recording & Sharing | Theo",
    description:
      "Record and share instantly with Theo's cloud-powered Instant Mode. Get automatic transcriptions, collaborative comments, shareable links, and team workspaces for fast feedback loops.",
    url: "https://theo.example/features/instant-mode",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo Instant Mode",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instant Mode - Quick Screen Recording & Sharing | Theo",
    description:
      "Record and share instantly with Theo's cloud-powered Instant Mode. Get automatic transcriptions, collaborative comments, shareable links, and team workspaces for fast feedback loops.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return <InstantModePage />
}
