import type { Metadata } from "next"
import {
  HipaaCompliantScreenRecordingPage,
  hipaaCompliantScreenRecordingContent,
} from "@/components/pages/seo/hipaa-compliant-screen-recording-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title:
    "HIPAA-Compliant Screen Recording — Secure Healthcare Recordings | Theo",
  description:
    "Theo enables HIPAA-compliant screen recording for healthcare teams. Self-host recordings on your own AWS S3 bucket, keep PHI off third-party servers, and audit every line of open-source code.",
  alternates: {
    canonical: "https://theo.example/hipaa-compliant-screen-recording",
  },
  openGraph: {
    title:
      "HIPAA-Compliant Screen Recording — Secure Healthcare Recordings | Theo",
    description:
      "Theo enables HIPAA-compliant screen recording for healthcare teams. Self-host recordings on your own AWS S3 bucket, keep PHI off third-party servers, and audit every line of open-source code.",
    url: "https://theo.example/hipaa-compliant-screen-recording",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: HIPAA-Compliant Screen Recording for Healthcare",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "HIPAA-Compliant Screen Recording — Secure Healthcare Recordings | Theo",
    description:
      "Theo enables HIPAA-compliant screen recording for healthcare teams. Self-host recordings on your own AWS S3 bucket, keep PHI off third-party servers.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(
          createFAQSchema(hipaaCompliantScreenRecordingContent.faqs)
        )}
      </script>
      <HipaaCompliantScreenRecordingPage />
    </>
  )
}
