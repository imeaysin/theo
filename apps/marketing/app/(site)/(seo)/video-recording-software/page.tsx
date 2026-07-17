import type { Metadata } from "next"
import {
  VideoRecordingSoftwarePage,
  videoRecordingSoftwareContent,
} from "@/components/pages/seo/video-recording-software-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Video Recording Software — Free HD Capture, Instant Sharing | Theo",
  description:
    "Theo is free video recording software for Mac and Windows. Record your screen, webcam, and audio in HD, then share instantly with a link. Open-source, no watermarks, no time limits in Studio Mode.",
  alternates: {
    canonical: "https://theo.example/video-recording-software",
  },
  openGraph: {
    title: "Video Recording Software — Free HD Capture, Instant Sharing | Theo",
    description:
      "Theo is free video recording software for Mac and Windows. Record in HD with audio and webcam, then share with a link instantly. Open-source, no watermarks.",
    url: "https://theo.example/video-recording-software",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Video Recording Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Recording Software — Free HD Capture, Instant Sharing | Theo",
    description:
      "Theo is free video recording software for Mac and Windows. Record in HD with audio and webcam, then share with a link instantly. Open-source, no watermarks.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(videoRecordingSoftwareContent.faqs))}
      </script>
      <VideoRecordingSoftwarePage />
    </>
  )
}
