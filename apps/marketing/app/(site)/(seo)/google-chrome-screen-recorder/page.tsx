import type { Metadata } from "next"
import {
  GoogleChromeScreenRecorderPage,
  googleChromeScreenRecorderContent,
} from "@/components/pages/seo/google-chrome-screen-recorder-page"
import {
  createFAQSchema,
  createSoftwareApplicationSchema,
} from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Google Chrome Screen Recorder: Record & Share Free | Theo",
  description:
    "Theo is a free, open-source screen recorder for Google Chrome. Add the extension, click record, and get an instant shareable link — no downloads, no watermarks, no sign-up.",
  keywords: [
    "google chrome screen recorder",
    "chrome screen recorder",
    "screen recorder for chrome",
    "chrome extension screen recorder",
    "record screen on chrome",
    "browser screen recorder",
  ],
  alternates: {
    canonical: "https://theo.example/google-chrome-screen-recorder",
  },
  openGraph: {
    title: "Google Chrome Screen Recorder: Record & Share Free | Theo",
    description:
      "Record your screen directly from Google Chrome with Theo's free, open-source extension. Instant shareable links, no watermarks, no downloads.",
    url: "https://theo.example/google-chrome-screen-recorder",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Google Chrome Screen Recorder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Chrome Screen Recorder | Theo",
    description:
      "Record your screen from Google Chrome with Theo's free, open-source extension. Instant sharing, no watermarks.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(
          createFAQSchema(googleChromeScreenRecorderContent.faqs)
        )}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(createSoftwareApplicationSchema())}
      </script>
      <GoogleChromeScreenRecorderPage />
    </>
  )
}
