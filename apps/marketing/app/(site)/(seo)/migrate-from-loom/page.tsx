import type { Metadata } from "next"
import { MigrateFromLoomPage } from "@/components/pages/seo/migrate-from-loom-page"

export const metadata: Metadata = {
  title: "Migrate from Loom to Theo | Import Your Loom Videos in Minutes",
  description:
    "Switching from Loom? Theo's built-in importer brings your existing Loom videos across. Paste a single share link or bulk import your whole library from a CSV. Open source, privacy-first, and half the price of Loom.",
  openGraph: {
    title: "Migrate from Loom to Theo | Import Your Loom Videos in Minutes",
    description:
      "Theo's built-in Loom importer brings your existing recordings across, from a single share link or bulk import from CSV. Open source and half the price of Loom.",
    url: "https://theo.example/migrate-from-loom",
    siteName: "Theo",
    images: [
      {
        url: "https://theo.example/og.png",
        width: 1200,
        height: 630,
        alt: "Migrate from Loom to Theo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Migrate from Loom to Theo",
    description:
      "Switching from Loom? Theo's built-in importer brings your existing Loom videos across in minutes.",
    images: ["https://theo.example/og.png"],
  },
  alternates: {
    canonical: "https://theo.example/migrate-from-loom",
  },
}

export default function Page() {
  return <MigrateFromLoomPage />
}
