import type { Metadata } from "next"
import {
  AsyncVideoCodeReviewsPage,
  asyncVideoCodeReviewsContent,
} from "@/components/pages/seo/async-video-code-reviews-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Async Video Code Reviews — Ship Faster Without the Meetings | Theo",
  description:
    "Record screen walkthroughs of pull requests and share a timestamped link your team watches on their schedule. Theo makes async code reviews faster and calendar-free.",
  alternates: {
    canonical: "https://theo.example/async-video-code-reviews",
  },
  openGraph: {
    title: "Async Video Code Reviews — Ship Faster Without the Meetings | Theo",
    description:
      "Record screen walkthroughs of pull requests and share a timestamped link your team watches on their schedule. Theo makes async code reviews faster and calendar-free.",
    url: "https://theo.example/async-video-code-reviews",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Async Video Code Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Async Video Code Reviews — Ship Faster Without the Meetings | Theo",
    description:
      "Record PR walkthroughs and share instant links with timestamped comments. No meetings, no scheduling. Just faster code reviews.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(asyncVideoCodeReviewsContent.faqs))}
      </script>
      <AsyncVideoCodeReviewsPage />
    </>
  )
}
