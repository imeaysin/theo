import type { Metadata } from "next"
import { EmployeeOnboardingPlatformPage } from "@/components/pages/seo/employee-onboarding-platform-page"

export const metadata: Metadata = {
  title: "Employee Onboarding Platform: Streamline New-Hire Training with Theo",
  description:
    "Looking for a powerful employee onboarding platform? Discover how Theo's open-source screen recorder and asynchronous features simplify new-hire training.",
  openGraph: {
    title:
      "Employee Onboarding Platform: Streamline New-Hire Training with Theo",
    description:
      "Looking for a powerful employee onboarding platform? Discover how Theo's open-source screen recorder and asynchronous features simplify new-hire training.",
    url: "https://theo.example/solutions/employee-onboarding-platform",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Theo: Employee Onboarding Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Onboarding Platform | Theo Screen Recorder",
    description:
      "Discover how Theo's open-source screen recorder simplifies new-hire training with asynchronous video and built-in feedback.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/solutions/employee-onboarding-platform",
  },
}

export default EmployeeOnboardingPlatformPage
