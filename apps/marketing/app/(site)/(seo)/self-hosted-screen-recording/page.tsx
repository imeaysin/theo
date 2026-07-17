import type { Metadata } from "next"
import {
  SelfHostedScreenRecordingPage,
  selfHostedScreenRecordingContent,
} from "@/components/pages/seo/self-hosted-screen-recording-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title:
    "Self-Hosted Screen Recording — Own Your Data, No Vendor Lock-In | Theo",
  description:
    "Theo lets you self-host screen recordings on your own S3-compatible storage. Connect AWS S3, Cloudflare R2, or MinIO — recordings go directly to your infrastructure. Open source, MIT-licensed, free to use.",
  alternates: {
    canonical: "https://theo.example/self-hosted-screen-recording",
  },
  openGraph: {
    title:
      "Self-Hosted Screen Recording — Own Your Data, No Vendor Lock-In | Theo",
    description:
      "Theo lets you self-host screen recordings on your own S3-compatible storage. Connect AWS S3, Cloudflare R2, or MinIO — recordings go directly to your infrastructure. Open source and free.",
    url: "https://theo.example/self-hosted-screen-recording",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Self-Hosted Screen Recording",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Self-Hosted Screen Recording — Own Your Data, No Vendor Lock-In | Theo",
    description:
      "Theo lets you self-host screen recordings on your own S3-compatible storage. AWS S3, Cloudflare R2, MinIO — your infrastructure, instant shareable links.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(selfHostedScreenRecordingContent.faqs))}
      </script>
      <SelfHostedScreenRecordingPage />
    </>
  )
}
