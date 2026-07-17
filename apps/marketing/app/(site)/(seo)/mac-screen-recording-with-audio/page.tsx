import type { Metadata } from "next"
import {
  MacScreenRecordingWithAudioPage,
  macScreenRecordingWithAudioContent,
} from "@/components/pages/seo/mac-screen-recording-with-audio-page"
import { createFAQSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title:
    "Mac Screen Recording With Audio — Capture Internal System Sound + Mic | Theo",
  description:
    "Record your Mac screen with audio — system sound and microphone — using Theo. Native internal audio capture, no BlackHole and no plugins. Free, open-source, made for macOS.",
  alternates: {
    canonical: "https://theo.example/mac-screen-recording-with-audio",
  },
  openGraph: {
    title:
      "Mac Screen Recording With Audio — Capture Internal System Sound + Mic | Theo",
    description:
      "Record your Mac screen with system audio and microphone using Theo. Native internal audio capture — no BlackHole, no plugins. Free and open-source for macOS.",
    url: "https://theo.example/mac-screen-recording-with-audio",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Mac screen recorder with internal audio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Mac Screen Recording With Audio — Capture Internal System Sound + Mic | Theo",
    description:
      "Record your Mac screen with system audio and microphone using Theo. Native internal audio capture — no BlackHole, no plugins. Free and open-source for macOS.",
    images: ["https://theo.example/og.png"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(
          createFAQSchema(macScreenRecordingWithAudioContent.faqs)
        )}
      </script>
      <MacScreenRecordingWithAudioPage />
    </>
  )
}
