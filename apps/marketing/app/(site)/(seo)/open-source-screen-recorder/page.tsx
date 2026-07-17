import type { Metadata } from "next"
import {
  OpenSourceScreenRecorderPage,
  openSourceScreenRecorderContent,
} from "@/components/pages/seo/open-source-screen-recorder-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Open Source Screen Recorder — Free, Private, Self-Hostable | Theo",
  description:
    "Theo is the leading open-source screen recorder for Mac and Windows. Audit the code, self-host your recordings, and own your data. MIT-licensed, 4K quality, no watermarks.",
  alternates: {
    canonical: "https://theo.example/open-source-screen-recorder",
  },
  openGraph: {
    title: "Open Source Screen Recorder — Free, Private, Self-Hostable | Theo",
    description:
      "Theo is the leading open-source screen recorder for Mac and Windows. MIT-licensed, 4K quality, instant sharing, self-hostable storage. No watermarks, no vendor lock-in.",
    url: "https://theo.example/open-source-screen-recorder",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Open Source Screen Recorder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Source Screen Recorder — Free, Private, Self-Hostable | Theo",
    description:
      "Theo is the leading open-source screen recorder for Mac and Windows. MIT-licensed, 4K quality, instant sharing, self-hostable storage. No watermarks, no vendor lock-in.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(openSourceScreenRecorderContent.faqs))}
      </script>
      <OpenSourceScreenRecorderPage />
    </>
  )
}
