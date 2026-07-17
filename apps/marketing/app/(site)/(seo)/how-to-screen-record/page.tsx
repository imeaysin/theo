import type { Metadata } from "next"
import {
  HowToScreenRecordPage,
  howToScreenRecordContent,
} from "@/components/pages/seo/how-to-screen-record-page"
import { createFAQSchema, createHowToSchema } from "@/utils/web-schema"

export const metadata: Metadata = {
  title: "How to Screen Record on Mac, Windows & Chrome (2026 Guide) | Theo",
  description:
    "Learn how to screen record with audio on Mac, Windows, and Chrome. Free step-by-step guide covering built-in tools and Theo, the open-source screen recorder.",
  openGraph: {
    title: "How to Screen Record on Mac, Windows & Chrome (2026 Guide) | Theo",
    description:
      "Learn how to screen record with audio on any platform. Step-by-step instructions for macOS, Windows, and Chrome with free and paid options.",
    url: "https://theo.example/how-to-screen-record",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "How to Screen Record — Complete 2026 Guide by Theo",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Screen Record on Mac, Windows & Chrome (2026 Guide) | Theo",
    description:
      "Learn how to screen record with audio on Mac, Windows, and Chrome. Free step-by-step guide.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/how-to-screen-record",
  },
}

const howToSteps = [
  {
    name: "Download and install Theo",
    text: "Download Theo for free from theo.example/download for Mac or Windows, or use Instant Mode in your browser for quick recordings without any installation.",
  },
  {
    name: "Choose your recording settings",
    text: "Open Theo and select your recording source. Choose between full screen, specific window, or custom region capture. Toggle microphone and system audio on or off based on your needs.",
  },
  {
    name: "Start recording your screen",
    text: "Click the record button to begin capturing your screen. Theo records in high definition with minimal system impact so you can present, demo, or teach without lag.",
  },
  {
    name: "Share or export your recording",
    text: "Stop the recording when finished. Theo generates an instant shareable link, or you can export the video locally in your preferred format. Share your recording with anyone in seconds.",
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(createFAQSchema(howToScreenRecordContent.faqs))}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(
          createHowToSchema({
            name: "How to Screen Record on Mac, Windows & Chrome",
            description:
              "Learn how to screen record with audio on Mac, Windows, or in your browser using Theo, the free open-source screen recorder.",
            totalTime: "PT2M",
            steps: howToSteps,
          })
        )}
      </script>
      <HowToScreenRecordPage />
    </>
  )
}
