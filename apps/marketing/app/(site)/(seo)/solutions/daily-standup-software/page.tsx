import type { Metadata } from "next"
import { DailyStandupSoftwarePage } from "@/components/pages/seo/daily-standup-software-page"

export const metadata: Metadata = {
  title: "Daily Standup Software: Streamline Your Agile Meetings with Theo",
  description:
    "Looking for daily standup software? Discover how Theo helps remote or hybrid teams run async standups efficiently—no more timezone conflicts!",
  openGraph: {
    title: "Daily Standup Software: Streamline Your Agile Meetings with Theo",
    description:
      "Looking for daily standup software? Discover how Theo helps remote or hybrid teams run async standups efficiently—no more timezone conflicts!",
    url: "https://theo.example/solutions/daily-standup-software",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Daily Standup Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Standup Software: Streamline Your Agile Meetings with Theo",
    description:
      "Looking for daily standup software? Discover how Theo helps remote or hybrid teams run async standups efficiently—no more timezone conflicts!",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/solutions/daily-standup-software",
  },
}

export default DailyStandupSoftwarePage
