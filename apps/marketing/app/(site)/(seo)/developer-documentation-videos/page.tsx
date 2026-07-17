import type { Metadata } from "next"
import {
  DeveloperDocumentationVideosPage,
  developerDocumentationVideosContent,
} from "@/components/pages/seo/developer-documentation-videos-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title:
    "Developer Documentation Videos — Record API Demos and SDK Walkthroughs | Theo",
  description:
    "Create professional developer documentation videos with screen recording. Record API demos, SDK walkthroughs, and technical tutorials instantly. Theo is free, open-source, 4K quality, and built for developers.",
  alternates: {
    canonical: "https://theo.example/developer-documentation-videos",
  },
  openGraph: {
    title:
      "Developer Documentation Videos — Record API Demos and SDK Walkthroughs | Theo",
    description:
      "Create professional developer documentation videos with screen recording. Record API demos, SDK walkthroughs, and technical tutorials instantly. Free, open-source, and built for developers.",
    url: "https://theo.example/developer-documentation-videos",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Developer Documentation Videos",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Developer Documentation Videos — Record API Demos and SDK Walkthroughs | Theo",
    description:
      "Record API demos, SDK walkthroughs, and changelog videos instantly. Share a link, embed in your docs, get AI transcripts. Free and open-source.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(
          createFAQSchema(developerDocumentationVideosContent.faqs)
        )}
      </script>
      <DeveloperDocumentationVideosPage />
    </>
  )
}
