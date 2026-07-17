import type { Metadata } from "next"
import { StudioModePage } from "./studio-mode-page"

export const metadata: Metadata = {
  title: "Studio Mode - Professional Screen Recording | Theo",
  description:
    "Create professional-quality screen recordings with Theo Studio Mode. Local recording, 4K 60fps quality, precision editing tools, and complete privacy control.",
  openGraph: {
    title: "Studio Mode - Professional Screen Recording | Theo",
    description:
      "Create professional-quality screen recordings with Theo Studio Mode. Local recording, 4K 60fps quality, precision editing tools, and complete privacy control.",
    url: "https://theo.example/features/studio-mode",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo Studio Mode",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Mode - Professional Screen Recording | Theo",
    description:
      "Create professional-quality screen recordings with Theo Studio Mode. Local recording, 4K 60fps quality, precision editing tools, and complete privacy control.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return <StudioModePage />
}
