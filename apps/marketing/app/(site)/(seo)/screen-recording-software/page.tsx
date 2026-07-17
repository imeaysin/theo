import type { Metadata } from "next"
import { ScreenRecordingSoftwarePage } from "@/components/pages/seo/screen-recording-software-page"

export const metadata: Metadata = {
  title: "Screen Recording Software — Free HD Screen Capture | Theo",
  description:
    "Free, open-source screen recording software for Mac and Windows. Capture HD video with audio, share instantly, and own your data. Download Theo today.",
  alternates: {
    canonical: "https://theo.example/screen-recording-software",
  },
  openGraph: {
    title: "Screen Recording Software — Free HD Screen Capture | Theo",
    description:
      "Free, open-source screen recording software for Mac and Windows. Capture HD video with audio, share instantly, and own your data.",
    url: "https://theo.example/screen-recording-software",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Screen Recording Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Screen Recording Software — Free HD Screen Capture | Theo",
    description:
      "Free, open-source screen recording software for Mac and Windows. Capture HD video with audio, share instantly, and own your data.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return <ScreenRecordingSoftwarePage />
}
