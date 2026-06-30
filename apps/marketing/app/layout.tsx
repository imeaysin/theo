import type { Metadata } from "next"
import { site } from "@/config/site"
import "@workspace/ui/globals.css"
import "./globals.css"

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
