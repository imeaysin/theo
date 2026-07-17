import type { Metadata } from "next"
import { OnlineClassroomToolsPage } from "@/components/pages/seo/online-classroom-tools-page"

export const metadata: Metadata = {
  title: "Online Classroom Tools: Empower Remote Teaching with Theo",
  description:
    "Searching for online classroom tools? Learn how Theo's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
  openGraph: {
    title: "Online Classroom Tools: Empower Remote Teaching with Theo",
    description:
      "Learn how Theo's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
    url: "https://theo.example/solutions/online-classroom-tools",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Online Classroom Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Classroom Tools | Theo Screen Recorder",
    description:
      "Learn how Theo's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/solutions/online-classroom-tools",
  },
}

export default OnlineClassroomToolsPage
