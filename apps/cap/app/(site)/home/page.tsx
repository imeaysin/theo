import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://cap.so/",
  },
}

export default async function Home() {
  return <HomePage />
}
