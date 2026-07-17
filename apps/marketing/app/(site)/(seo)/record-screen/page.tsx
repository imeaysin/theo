import type { Metadata } from "next"
import {
  RecordScreenPage,
  recordScreenContent,
} from "@/components/pages/seo/record-screen-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Record Screen — Free HD Screen Recorder with Instant Sharing | Theo",
  description:
    "Record your screen in HD on Mac or Windows with Theo. Capture audio, webcam overlay, and share with a link instantly. Free, open-source, no watermarks, no time limits in Studio Mode.",
  alternates: {
    canonical: "https://theo.example/record-screen",
  },
  openGraph: {
    title:
      "Record Screen — Free HD Screen Recorder with Instant Sharing | Theo",
    description:
      "Record your screen in HD on Mac or Windows. Capture audio and webcam, then share with a link instantly. Free, open-source, no watermarks.",
    url: "https://theo.example/record-screen",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Record Your Screen for Free",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Record Screen — Free HD Screen Recorder with Instant Sharing | Theo",
    description:
      "Record your screen in HD on Mac or Windows. Capture audio and webcam, then share with a link instantly. Free, open-source, no watermarks.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(recordScreenContent.faqs))}
      </script>
      <RecordScreenPage />
    </>
  )
}
