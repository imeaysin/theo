import type { Metadata } from "next"
import { RemoteTeamCollaborationPage } from "@/components/pages/seo/remote-team-collaboration-page"

export const metadata: Metadata = {
  title:
    "Remote Team Collaboration Software: Asynchronous Screen Recording for Distributed Teams",
  description:
    "Enhance your remote team collaboration with Theo's secure, open-source screen recording platform. Save time, improve clarity, and boost productivity across time zones.",
  openGraph: {
    title:
      "Remote Team Collaboration Software: Async Screen Recording for Distributed Teams",
    description:
      "Enhance your remote team collaboration with Theo's secure, open-source screen recording platform. Save time and boost productivity across time zones.",
    url: "https://theo.example/solutions/remote-team-collaboration",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Remote Team Collaboration Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Team Collaboration Software | Theo Screen Recorder",
    description:
      "Enhance your remote team collaboration with Theo's secure, open-source screen recording platform. Save time and boost productivity.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/solutions/remote-team-collaboration",
  },
}

export default RemoteTeamCollaborationPage
