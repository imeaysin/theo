import type { Metadata } from "next"
import {
  ScreenRecorderPage,
  screenRecorderContent,
} from "@/components/pages/seo/screen-recorder-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Screen Recorder: High-Quality, User-Friendly, and 100% Free Locally",
  description:
    "Theo is a powerful, user-friendly screen recorder and is 100% free locally with no usage limits. Perfect for team collaboration, creating tutorials, or recording professional presentations.",
  openGraph: {
    title:
      "Screen Recorder: High-Quality, User-Friendly, and 100% Free Locally",
    description:
      "Theo is a powerful, user-friendly screen recorder and is 100% free locally with no usage limits.",
    url: "https://theo.example/screen-recorder",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Free Screen Recorder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Screen Recorder: High-Quality, User-Friendly, and 100% Free Locally",
    description:
      "Theo is a powerful, user-friendly screen recorder and is 100% free locally with no usage limits.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/screen-recorder",
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(screenRecorderContent.faqs))}
      </script>
      <ScreenRecorderPage />
    </>
  )
}
