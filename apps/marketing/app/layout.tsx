import "@/app/globals.css"
import { productConfig } from "@workspace/config/public"
import type { Metadata } from "next"
import localFont from "next/font/local"
import type { PropsWithChildren } from "react"

const productFont = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMontreal-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/NeueMontreal-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/NeueMontreal-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(productConfig.siteUrl),
  title: `${productConfig.name} — ${productConfig.tagline}`,
  description: productConfig.description,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${productConfig.name} — ${productConfig.tagline}`,
    description: productConfig.description,
    type: "website",
    url: productConfig.siteUrl,
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={productFont.variable} lang="en">
      <body suppressHydrationWarning>
        <main className="w-full">{children}</main>
      </body>
    </html>
  )
}
