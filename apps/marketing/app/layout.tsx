import type { Metadata } from "next"
import "@workspace/ui/globals.css"
import { AppProviders } from "@workspace/ui/providers/app-providers"

export const metadata: Metadata = {
  title: "Marketing",
  description: "Theo marketing site",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="isolate h-full antialiased" suppressHydrationWarning>
      <body className="relative flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
