import type { Metadata } from "next"
import { ScreenRecordMacPage } from "@/components/pages/seo/screen-record-mac-page"

export const metadata: Metadata = {
  title: "Best Screen Recorder for Mac | High-Quality, Free & Easy (2026)",
  description:
    "Theo is the best free screen recorder for Mac, with HD quality, no time limit in Studio Mode, and easy export. Ideal for tutorials, presentations, and educational videos.",
  openGraph: {
    title: "Best Screen Recorder for Mac | High-Quality, Free & Easy (2026)",
    description:
      "Theo is the best free screen recorder for Mac, with HD quality, no time limit in Studio Mode, and easy export. Ideal for tutorials, presentations, and educational videos.",
    url: "https://theo.example/screen-recorder-mac",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Best Screen Recorder for Mac",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Screen Recorder for Mac | Theo",
    description:
      "Theo is the best free screen recorder for Mac, with HD quality, no time limit in Studio Mode, and easy export. Ideal for tutorials, presentations, and educational videos.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/screen-recorder-mac",
  },
}

export default function Page() {
  return <ScreenRecordMacPage />
}
