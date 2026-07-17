import type { Metadata } from "next"
import {
  FreeScreenRecorderPage,
  freeScreenRecorderContent,
} from "@/components/pages/seo/free-screen-recorder-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "Free Screen Recorder: High-Quality Recording at No Cost",
  description:
    "Theo offers a top-rated, free screen recorder with high-quality video capture, making it perfect for creating tutorials, educational content, and professional demos without any hidden fees.",
  openGraph: {
    title: "Free Screen Recorder: High-Quality Recording at No Cost",
    description:
      "Theo offers a top-rated, free screen recorder with high-quality video capture, making it perfect for creating tutorials, educational content, and professional demos without any hidden fees.",
    url: "https://theo.example/free-screen-recorder",
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
    title: "Free Screen Recorder: High-Quality Recording at No Cost",
    description:
      "Theo offers a top-rated, free screen recorder with high-quality video capture, making it perfect for creating tutorials, educational content, and professional demos without any hidden fees.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/free-screen-recorder",
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(freeScreenRecorderContent.faqs))}
      </script>
      <FreeScreenRecorderPage />
    </>
  )
}
