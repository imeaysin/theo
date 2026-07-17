import type { Metadata } from "next"
import {
  ObsAlternativePage,
  obsAlternativeContent,
} from "@/components/pages/seo/obs-alternative-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title:
    "OBS Alternative — Easier Screen Recording with Instant Sharing | Theo",
  description:
    "Theo is the modern OBS alternative for async screen sharing. Record in 4K, get a shareable link in seconds, and collaborate with timestamped comments. No configuration required.",
  alternates: {
    canonical: "https://theo.example/obs-alternative",
  },
  openGraph: {
    title:
      "OBS Alternative — Easier Screen Recording with Instant Sharing | Theo",
    description:
      "Theo is the modern OBS alternative for async screen sharing. Record in 4K, get a shareable link in seconds, and collaborate with timestamped comments. No configuration required.",
    url: "https://theo.example/obs-alternative",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: OBS Alternative for Async Screen Recording",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "OBS Alternative — Easier Screen Recording with Instant Sharing | Theo",
    description:
      "Theo is the modern OBS alternative for async screen sharing. Record in 4K, get a shareable link in seconds, and collaborate with timestamped comments. No configuration required.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(obsAlternativeContent.faqs))}
      </script>
      <ObsAlternativePage />
    </>
  )
}
