import type { Metadata } from "next"
import { LoomAlternativePage } from "@/components/pages/seo/loom-alternative-page"

export const metadata: Metadata = {
  title:
    "The Ultimate Loom Alternative: Why Theo is the Best Open-Source Screen Recorder for Mac & Windows",
  description:
    "Looking for the best Loom alternative? Discover Theo, the open-source, privacy-focused screen recorder for Mac & Windows with a built-in Loom video importer. See why users are switching today!",
  openGraph: {
    title:
      "The Ultimate Loom Alternative: Why Theo is the Best Open-Source Screen Recorder",
    description:
      "Looking for the best Loom alternative? Discover Theo with a built-in Loom video importer. Open-source, privacy-focused screen recorder for Mac & Windows.",
    url: "https://theo.example/loom-alternative",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: The Best Loom Alternative",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ultimate Loom Alternative: Theo Screen Recorder",
    description:
      "Looking for the best Loom alternative? Discover Theo, the open-source, privacy-focused screen recorder for Mac & Windows.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/loom-alternative",
  },
}

export default function Page() {
  return <LoomAlternativePage />
}
