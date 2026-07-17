import type { Metadata } from "next"
import { ScreenRecordWindowsPage } from "@/components/pages/seo/screen-record-windows-page"

export const metadata: Metadata = {
  title: "Best Free Screen Recorder for Windows 10 & 11 | Theo",
  description:
    "Record your screen on Windows with Theo — free, open-source screen recorder with HD video, audio, webcam overlay, and instant sharing. No watermarks. Works on Windows 10 & 11.",
  openGraph: {
    title: "Best Free Screen Recorder for Windows 10 & 11 | Theo",
    description:
      "Record your screen on Windows with Theo — free, open-source screen recorder with HD video, audio, webcam overlay, and instant sharing. No watermarks. Works on Windows 10 & 11.",
    url: "https://theo.example/screen-recorder-windows",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Best Free Screen Recorder for Windows",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free Screen Recorder for Windows 10 & 11 | Theo",
    description:
      "Record your screen on Windows with Theo — free, open-source screen recorder with HD video, audio, webcam overlay, and instant sharing. No watermarks.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/screen-recorder-windows",
  },
}

export default function Page() {
  return <ScreenRecordWindowsPage />
}
